import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // base: process.env.VITE_BASE_PATH || "/E-commerce-front"
  /*  server: {
        proxy: {
            "/api": {
                target: "http://127.0.0.1:8000",
                changeOrigin: true,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            },
        },
    }, */
});
