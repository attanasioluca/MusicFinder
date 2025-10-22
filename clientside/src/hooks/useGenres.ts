import { useEffect, useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_LOCAL_API_URL;

export interface Genre {
  genre_code: string;
  genre_name: string;
  similar_genres_codes?: string;
  sub_genres?: string;
}


export const useGenres = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
    const req = `${API_URL}/api/genres`
    console.log("Fetching genres from:", req);
    
  useEffect(() => {
    axios
      .get(req)
      .then((res) => setGenres(res.data))
      .catch((err) => console.error("Error fetching genres:", err))
      .finally(() => setLoading(false));
  }, []);

  return { genres, loading };
};
