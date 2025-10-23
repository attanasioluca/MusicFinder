import React, { useEffect, useState, type JSX } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

interface ProtectedRouteProps {
    children: JSX.Element;
}

const API_URL = import.meta.env.VITE_NGROK_API_URL;

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const [authenticated, setAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("spotify_access_token");
        axios.get(`${API_URL}/auth/status`, {
            headers: { Authorization: `Bearer ${token}` },
        }).then(() => {setAuthenticated(true);})
        .catch(() => {setAuthenticated(false);});
    }, []);

    if (authenticated === null) return <div>Loading...</div>;
    if (!authenticated) return <Navigate to="/login" replace />;
    return children;
};
export default ProtectedRoute;
