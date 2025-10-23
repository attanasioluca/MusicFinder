// src/hooks/useSpotifyData.ts
import { useState, useEffect } from "react";
import axios from "axios";
import type { SpotifyData } from "../../models";


export const useSpotifyData = () => {
  const [data, setData] = useState<SpotifyData>({
    user: null,
    tracks: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("spotify_access_token");
      if (!token) {
        setData({ user: null, tracks: null, loading: false, error: "No token" });
        return;
      }

      try {
        const [userRes, tracksRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_LOCAL_API_URL}/spot/user`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_LOCAL_API_URL}/spot/tracks`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setData({
          user: userRes.data,
          tracks: tracksRes.data,
          loading: false,
          error: null,
        });
      } catch (err: any) {
        console.error("❌ Spotify data fetch failed:", err);
        setData({
          user: null,
          tracks: null,
          loading: false,
          error: "Failed to fetch Spotify data",
        });
      }
    };

    fetchData();
  }, []);

  return data;
};
