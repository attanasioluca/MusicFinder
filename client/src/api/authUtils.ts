import axios from "axios";

const API_URL = import.meta.env.VITE_LOCAL_API_URL;

// === Helper to refresh token if expired ===
export const refreshIfNeeded = async (): Promise<string | null> => {
  const accessToken = localStorage.getItem("spotify_access_token");
  const refreshToken = localStorage.getItem("spotify_refresh_token");
  const expiresAt = Number(localStorage.getItem("spotify_expires_at"));

  if (!accessToken || !refreshToken) return null;

  // Still valid?
  if (Date.now() < expiresAt - 60000) return accessToken; // 1 min safety window

  try {
    const res = await axios.get(`${API_URL}/refresh_token`, {
      params: { refresh_token: refreshToken },
    });

    const newToken = res.data.access_token;
    const newExpiry = Date.now() + res.data.expires_in * 1000;

    localStorage.setItem("spotify_access_token", newToken);
    localStorage.setItem("spotify_expires_at", String(newExpiry));

    console.log("♻️ Access token refreshed");
    return newToken;
  } catch (err) {
    console.error("❌ Token refresh failed:", err);
    localStorage.clear();
    window.location.href = "/login"; // force re-auth
    return null;
  }
};
