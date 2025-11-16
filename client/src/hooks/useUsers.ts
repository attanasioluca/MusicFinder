import { useEffect, useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_LOCAL_API_URL;

export interface User {
  user_id: number;
  username: string;
  full_name: string;
  email: string;
  favorite_genre_code: string;
  favorite_artist_code: string;
  playlist_count: number;
}


export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/api/users`)
      .then(res => setUsers(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return { users, loading };
};
