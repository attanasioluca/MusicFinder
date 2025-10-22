import { useEffect, useState } from "react";
import type { Genre } from "./useGenres";

export const useSubGenres = (genres: Genre[], codes: string[]) => {
  const [names, setNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!codes.length || !genres.length) {
      setNames([]);
      setLoading(false);
      return;
    }

    // Map codes to names directly from provided genres
    const found = codes
      .map((code) => {
        const match = genres.find((g) => g.genre_code === code);
        return match ? match.genre_name : null;
      })
      .filter((n): n is string => n !== null);

    setNames(found);
    setLoading(false);
  }, []);

  return { names, loading };
};
