import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // 相對路徑:同時支援 Zeabur(網域根目錄)與 GitHub Pages(/Underway/ 子路徑)
  base: "./",
});
