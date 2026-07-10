import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // GitHub Pages 部署在 https://<user>.github.io/Underway/ 子路徑下
  base: "/Underway/",
});
