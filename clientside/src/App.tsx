import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import CallbackPage from "./pages/CallbackPage";
import ProfilePage from "./pages/ProfilePage";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route path="/callback" element={<CallbackPage />} />
      <Route path="/profile" element={<ProfilePage />} />

    </Routes>
  );
};

export default App;
