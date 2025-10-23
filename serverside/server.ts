import express, { Request, Response, NextFunction } from "express";
import axios from "axios";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { User, Song, Artist, Genre } from "./models.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const mongoURI = `${process.env.MONGO_URI}musicfinder`;
const redirectUri = `${process.env.NGROK_URL}/callback`;

// ===== MongoDB connection =====
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ===== Middleware =====
app.use(
  cors({
    origin: [process.env.FRONTEND_URL!, "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// ===== OAuth: Step 1 - Login (redirect user to Spotify auth page) =====
app.get("/login", (_req: Request, res: Response) => {
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

// ===== OAuth: Step 2 - Spotify callback (exchange code for tokens) =====
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
    console.log("✅ Tokens retrieved successfully");

    // Redirect back to frontend with tokens in query params
    const frontendRedirect = `${process.env.FRONTEND_URL}/callback?access_token=${access_token}&refresh_token=${refresh_token}&expires_in=${expires_in}`;
    res.redirect(frontendRedirect);
  } catch (err: any) {
    console.error("❌ Spotify token exchange failed:", err.response?.data || err.message);
    res.status(500).send("Auth failed");
  }
});

// ===== Token refresh (frontend calls this with refresh_token) =====
app.get("/refresh_token", async (req: Request, res: Response) => {
  const refreshToken = req.query.refresh_token as string;
  if (!refreshToken) return res.status(400).json({ error: "Missing refresh token" });

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
    console.log("♻️ Refreshed Spotify access token");

    res.json({ access_token, expires_in });
  } catch (err: any) {
    console.error("❌ Failed to refresh Spotify token:", err.response?.data || err.message);
    res.status(500).json({ error: "Token refresh failed" });
  }
});

// ===== Middleware: Ensure a valid Spotify Bearer token =====
const ensureSpotifyAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid Authorization header" });
    return;
  }

  const accessToken = authHeader.split(" ")[1];
  try {
    // Check if token is valid by calling Spotify /me
    await axios.get("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    next();
  } catch (err: any) {
    console.error("❌ Invalid or expired Spotify token:", err.response?.data || err.message);
    res.status(401).json({ error: "Invalid or expired Spotify token" });
  }
};

// ===== Auth status check =====
app.get("/auth/status", ensureSpotifyAccessToken, (_req, res) => {
  res.status(200).json({ authenticated: true });
});

// ===== Spotify API: get user’s top songs =====
app.get("/spot/tracks", ensureSpotifyAccessToken, async (req: Request, res: Response) => {
  const accessToken = req.headers.authorization?.split(" ")[1];
  try {
    const spotRes = await axios.get("https://api.spotify.com/v1/me/top/tracks?limit=20", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    res.json(spotRes.data.items);
  } catch (err: any) {
    console.error("❌ Error fetching songs:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch songs" });
  }
});

// server.ts
app.get("/spot/user", ensureSpotifyAccessToken, async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    try {
      const userRes = await axios.get("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      res.json(userRes.data);
    } catch (err: any) {
      console.error("Error fetching user data:", err.response?.data || err.message);
      res.status(500).json({ error: "Failed to fetch user data" });
    }
  });
  

// ===== Core APIs =====
app.get("/api/users", async (_req, res) => res.json(await User.find()));
app.get("/api/users/:username", async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  user ? res.json(user) : res.status(404).json({ error: "User not found" });
});
app.get("/api/songs", async (_req, res) => res.json(await Song.find()));
app.get("/api/artists", async (_req, res) => res.json(await Artist.find()));
app.get("/api/genres", async (_req, res) => res.json(await Genre.find()));

export default app;
