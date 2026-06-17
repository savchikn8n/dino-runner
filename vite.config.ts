import { defineConfig } from "vite";

// Telegram Mini App is served from the root of the Vercel deployment.
export default defineConfig({
  base: "./",
  build: {
    target: "es2020",
    outDir: "dist",
    assetsInlineLimit: 4096,
  },
  server: {
    host: true,
    port: 5173,
  },
});
