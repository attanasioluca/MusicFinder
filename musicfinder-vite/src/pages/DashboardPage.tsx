import { useSpotifySongs } from "../hooks/spotify/useSpotifySongs";

const DashboardPage = () => {
  const { songs, loading, error, refetch } = useSpotifySongs();

  if (loading) return <p>Loading your Spotify tracks...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Your Top Spotify Tracks</h1>
      <button onClick={refetch}>Reload</button>
      <ul>
        {songs.map((t) => (
          <li key={t.id}>
            {t.name} — {t.artists.map((a) => a.name).join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DashboardPage;
