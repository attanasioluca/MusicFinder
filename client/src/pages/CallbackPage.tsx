// src/pages/Callback.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CallbackPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");
        const expiresIn = params.get("expires_in");

        if (accessToken) {
            localStorage.setItem("spotify_access_token", accessToken);
            localStorage.setItem("spotify_refresh_token", refreshToken || "");
            localStorage.setItem("spotify_token_expires_in", expiresIn || "");
            navigate("/");
        }
    }, [navigate]);

    return <p>Loading...</p>;
};

export default CallbackPage;
