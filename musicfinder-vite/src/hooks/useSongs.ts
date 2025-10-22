import { useEffect, useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_LOCAL_API_URL;

export interface Song {
  title: string;
  id: string;
  artist_code: string;
  album_code: string;
  cover_link: string;
  genre_code: string;
  listens_count: number;
  date_published: string;
  duration: number;
  rating: number;
}

export const useSongs = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/api/songs`)
      .then(res => setSongs(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return { songs, loading };
};
