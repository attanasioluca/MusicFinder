import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_LOCAL_API_URL;

export interface SpotifyTrack {
    id: string;
    name: string;
    artists: { name: string }[];
    album: { name: string; images: { url: string }[] };
}

export const useSpotifySongs = () => {
    const [songs, setSongs] = useState<SpotifyTrack[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const token = localStorage.getItem("spotify_access_token");
    const fetchSongs = async () => {
        try {
            const res = await axios.get(`${API_URL}/spot/songs`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSongs(res.data);
        } catch (err: any) {
            console.error("Error fetching songs:", err.message);
            if (err.response?.status === 401) {
                // Try refresh flow once
                try {
                    await axios.get(`${API_URL}/refresh_token`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    const retry = await axios.get(`${API_URL}/spot/songs`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setSongs(retry.data);
                } catch (refreshErr: any) {
                    console.error("Token refresh failed:", refreshErr.message);
                    setError("Session expired. Please log in again.");
                }
            } else {
                setError("Failed to fetch songs.");
            }
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchSongs();
    }, []);

    return { songs, loading, error, refetch: fetchSongs };
};
