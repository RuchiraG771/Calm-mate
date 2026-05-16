import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
<<<<<<< HEAD
=======
import { componentTagger } from "lovable-tagger";

>>>>>>> origin/main
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "./",
  server: {
    host: "::",
    port: 8080,
<<<<<<< HEAD
    open: false,
=======
>>>>>>> origin/main
    hmr: {
      overlay: false,
    },
  },
<<<<<<< HEAD
  plugins: [react()].filter(Boolean),
=======
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
>>>>>>> origin/main
  resolve: {
    alias: [
      { find: "@/components", replacement: path.resolve(__dirname, "./src/component") },
      { find: "@", replacement: path.resolve(__dirname, "./src") }
    ],
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
