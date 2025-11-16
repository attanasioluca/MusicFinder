import { useState, useEffect } from "react";
import { spotifyClient } from "../api/spotifyClient";
import type { SpotifyUser, SpotifyTrack } from "../models";

export interface SpotifyData {
    user: SpotifyUser | null;
    tracks: (SpotifyTrack & { genres?: string[] })[] | null;
    loading: boolean;
    error: string | null;
}

export const useSpotifyData = ( timeRange: string, trackType: string ) => {
    const [data, setData] = useState<SpotifyData>({
        user: null,
        tracks: null,
        loading: true,
        error: null,
    });

    useEffect(() => {
        const fetchSpotifyData = async () => {
            const trackEndpoint = trackType === "top" ? `/spot/tracks/top/${timeRange}` : "/spot/tracks/recent";
            try {
                const [userRes, tracksRes] = await Promise.all([
                    spotifyClient.get("/spot/user"),
                    spotifyClient.get(trackEndpoint),
                ]);

                const user = userRes.data;
                const tracks: SpotifyTrack[] = tracksRes.data;
                let artistIds: string[] = [];
                console.log(tracks[0]?.artists);
                
                try{
                    artistIds = [
                    ...new Set(
                        tracks.flatMap((t) => t.artists.map((a) => a.id))
                    ),
                ];
                }catch(e){}
                const { data: genreMap } = await spotifyClient.get(
                    `/spot/artists-genres/${artistIds.join(",")}`
                );

                const tracksWithGenres = tracks.map((t) => ({
                    ...t,
                    genres: [
                        ...new Set(
                            t.artists.flatMap((a) => genreMap[a.id] || [])
                        ),
                    ],
                }));

                // 6️⃣ Save final data
                setData({
                    user,
                    tracks: tracksWithGenres,
                    loading: false,
                    error: null,
                });
            } catch (err: any) {
                console.error("❌ Failed to fetch Spotify data:", err);
                setData({
                    user: null,
                    tracks: null,
                    loading: false,
                    error: "Failed to fetch Spotify data",
                });
            }
        };

        fetchSpotifyData();
    }, [timeRange, trackType]);

    return data;
};
