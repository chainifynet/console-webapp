import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { ViteMinifyPlugin } from "vite-plugin-minify";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), ViteMinifyPlugin({})],
  build: {
    outDir: "build",
    // sourcemap: true,
  },
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
});
