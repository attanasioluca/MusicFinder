import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import path from "path";

// Load env variables manually
dotenv.config({ path: path.resolve(__dirname, ".env") });

const ngrokUrl = process.env.VITE_NGROK_URL;
if (!ngrokUrl) {
  throw new Error("VITE_NGROK_URL is not defined in .env");
}
else {
    console.log("VITE_NGROK_URL:", ngrokUrl);
    }

export default defineConfig({
  server: {
    port: 5173,
    allowedHosts: ["musicfinder.loca.lt", ngrokUrl],
  },
  plugins: [react()],
});
