import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Frontend runs on http://localhost:5173 and talks to the backend on http://localhost:8080
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
