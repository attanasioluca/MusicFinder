import { useEffect, useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_LOCAL_API_URL;

export interface Artist {
    artist_code: string,
    artist_name: string,
    monthly_streams: number,
    genre_code: string,
    rating: number
}

export const useArtists = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
    const req = `${API_URL}/api/artists`
    
  useEffect(() => {
    axios
      .get(req)
      .then((res) => setArtists(res.data))
      .catch((err) => console.error("Error fetching artists:", err))
      .finally(() => setLoading(false));
  }, []);

  return { artists, loading };
};
