import express, { Request, Response, NextFunction, CookieOptions } from "express";
import axios from "axios";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { User, Song, Artist, Genre } from "./models.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const mongoURI = `${process.env.MONGO_URI}musicfinder`;
const redirectUri = `${process.env.NGROK_URL}/callback`;

// 🧠 Environment detection
const isLocalhost = process.env.FRONTEND_URL?.includes("localhost");
const isNgrok = process.env.NGROK_URL?.includes("ngrok");
const isProd = process.env.NODE_ENV === "production" && !isNgrok && !isLocalhost;

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(port, () =>
      console.log(`🚀 Server running on http://localhost:${port}`)
    );
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// ===== Middleware =====
app.use(
    cors({
      origin: [
        process.env.FRONTEND_URL!,
        "https://musicfinder.loca.lt",
        "http://localhost:5173",
      ],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
  
app.use(express.json());
app.use(cookieParser());

// ===== Cookie Options (auto-adaptive) =====
const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: false, // HTTPS only for ngrok/prod
  sameSite: "lax",
  path: "/",
};

// ===== OAuth login =====
app.get("/login", (req: Request, res: Response) => {
  const scopes = [
    "user-read-private",
    "user-read-email",
    "user-top-read",
    "playlist-read-private",
  ].join(" ");

  const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${
    process.env.SPOTIFY_CLIENT_ID
  }&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}`;

  res.redirect(authUrl);
});

// ===== OAuth callback =====
app.get("/callback", async (req: Request, res: Response) => {
  const code = req.query.code as string;
  if (!code) return res.status(400).send("Missing code");

  try {
    const tokenRes = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        client_id: process.env.SPOTIFY_CLIENT_ID!,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET!,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token, refresh_token, expires_in } = tokenRes.data;

    res.cookie("spotify_access_token", access_token, {
      ...baseCookieOptions,
      maxAge: expires_in * 1000,
    });

    res.cookie("spotify_refresh_token", refresh_token, {
      ...baseCookieOptions,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    console.log("✅ Tokens stored in cookies");
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  } catch (err: any) {
    console.error("❌ Spotify token error:", err.response?.data || err.message);
    res.status(500).send("Auth failed");
  }
});

// ===== Token refresh =====
app.get("/refresh_token", async (req: Request, res: Response) => {
  const refreshToken =
    req.cookies.spotify_refresh_token || req.query.refresh_token;
  if (!refreshToken) return res.status(400).send("Missing refresh token");

  try {
    const refreshRes = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: process.env.SPOTIFY_CLIENT_ID!,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET!,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token, expires_in } = refreshRes.data;

    res.cookie("spotify_access_token", access_token, {
      ...baseCookieOptions,
      maxAge: expires_in * 1000,
    });

    console.log("♻️ Refreshed Spotify access token");
    res.json({ success: true });
  } catch (err: any) {
    console.error("❌ Token refresh failed:", err.response?.data || err.message);
    res.status(500).send("Failed to refresh token");
  }
});

// ===== Middleware: auto-refresh Spotify access token =====
const ensureSpotifyAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let accessToken = req.cookies.spotify_access_token;
  const refreshToken = req.cookies.spotify_refresh_token;

  if (!accessToken && !refreshToken) {
    res.status(401).json({ error: "No tokens found" });
    return;
  }

  try {
    // Test if the token works
    await axios.get("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    next();
  } catch (err: any) {
    if (!refreshToken) {
      res.status(401).json({ error: "No refresh token" });
      return;
    }

    try {
      const refreshRes = await axios.post(
        "https://accounts.spotify.com/api/token",
        new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
          client_id: process.env.SPOTIFY_CLIENT_ID!,
          client_secret: process.env.SPOTIFY_CLIENT_SECRET!,
        }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      const { access_token, expires_in } = refreshRes.data;

      res.cookie("spotify_access_token", access_token, {
        ...baseCookieOptions,
        maxAge: expires_in * 1000,
      });

      req.cookies.spotify_access_token = access_token;
      console.log("♻️ Spotify token refreshed automatically");
      next();
    } catch (refreshErr: any) {
      console.error("❌ Failed to refresh Spotify token:", refreshErr.message);
      res.status(401).json({ error: "Token expired and refresh failed" });
    }
  }
};

// ===== Spotify API: get user’s top songs =====
app.get("/spot/songs", ensureSpotifyAccessToken, async (req: Request, res: Response) => {
  const accessToken = req.cookies.spotify_access_token;

  try {
    const spotRes = await axios.get(
      "https://api.spotify.com/v1/me/top/tracks?limit=20",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    res.json(spotRes.data.items.map((item: any) => item.track));
  } catch (err: any) {
    console.error("Error fetching songs:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch songs" });
  }
});

// ===== Core APIs =====
app.get("/api/users", async (_: Request, res: Response) => res.json(await User.find()));
app.get("/api/users/:username", async (req: Request, res: Response) => {
  const user = await User.findOne({ username: req.params.username });
  user ? res.json(user) : res.status(404).send("User not found");
});
app.get("/api/songs", async (_: Request, res: Response) => res.json(await Song.find()));
app.get("/api/artists", async (_: Request, res: Response) => res.json(await Artist.find()));
app.get("/api/genres", async (_: Request, res: Response) => res.json(await Genre.find()));

export default app;
