// Static build for GitHub Pages (https://rbadriorz.github.io): SPA shell, no server.
// AI calls to /api/* fail there, so every agent uses its scripted fallback.
// Build: npx vite build --config vite.pages.config.ts  (Lovable keeps using vite.config.ts)
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
    spa: { enabled: true },
  },
});
