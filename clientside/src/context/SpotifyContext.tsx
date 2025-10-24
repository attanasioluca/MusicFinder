import React, { createContext, useContext } from "react";
import { useSpotifyData } from "../hooks/useSpotifyData";

const SpotifyContext = createContext<ReturnType<typeof useSpotifyData> | null>(null);

export const SpotifyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const data = useSpotifyData();
  return <SpotifyContext.Provider value={data}>{children}</SpotifyContext.Provider>;
};

export const useSpotify = () => {
  const ctx = useContext(SpotifyContext);
  if (!ctx) throw new Error("useSpotify must be used inside SpotifyProvider");
  return ctx;
};
