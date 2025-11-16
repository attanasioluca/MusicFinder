import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { SpotifyProvider } from "./context/SpotifyContext";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider>
        <SpotifyProvider>
            <App />
        </SpotifyProvider>
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>
);
