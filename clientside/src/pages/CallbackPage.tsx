// src/pages/Callback.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");

    if (accessToken) {
      localStorage.setItem("spotify_access_token", accessToken);
      localStorage.setItem("spotify_refresh_token", refreshToken || "");
      navigate("/");
    }
  }, [navigate]);

  return <p>Loading...</p>;
};

export default CallbackPage;
