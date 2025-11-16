import React, { createContext, useContext, useState } from "react";
import { useSpotifyData } from "../hooks/useSpotifyData";

type SpotifyContextType = ReturnType<typeof useSpotifyData> & {
    tracksType: string;
    timeRange: string;
    setTracksType: (type: string) => void;
    setTimeRange: (range: string) => void;
};

const SpotifyContext = createContext<SpotifyContextType | null>(null);

export const SpotifyProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [tracksType, setTracksType] = useState("top");
    const [timeRange, setTimeRange] = useState("medium_term");
    const data = useSpotifyData(timeRange, tracksType);

    return (
        <SpotifyContext.Provider value={{ ...data, tracksType, setTracksType, setTimeRange, timeRange }}>
            {children}
        </SpotifyContext.Provider>
    );
};

export const useSpotify = () => {
    const ctx = useContext(SpotifyContext);
    if (!ctx) throw new Error("useSpotify must be used inside SpotifyProvider");
    return ctx;
};
