import React, { useEffect } from "react";
import { Button, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("spotify_access_token");
    const refreshToken = localStorage.getItem("spotify_refresh_token");
    if (token) {
      navigate("/"); // redirect logged-in users
    }
  }, [navigate]);

  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_NGROK_URL}/login`;
  };

  return (
    <div>
      <Heading>Login with Spotify</Heading>
      <Button onClick={handleLogin}>Connect Spotify</Button>
    </div>
  );
};

export default LoginPage;
