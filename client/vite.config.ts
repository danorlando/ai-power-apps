import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import { ViteAliases } from "vite-aliases";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "localhost",
    port: 10000,
    strictPort: true,
  },
  plugins: [react()],
  css: {
    modules: {
      localsConvention: "camelCase",
    },
  },
  resolve: {
    alias: {
      "@modules": path.join(__dirname, "src/modules"),
      "@common": path.join(__dirname, "src/common"),
      "@data-provider": path.join(__dirname, "src/data-provider"),
      "@": path.join(__dirname, "src/"),
    },
  },
  define: {
    global: {},
    // process: {
    //   env: {
    //     VITE_APP_API: process?.env.VITE_APP_API || 'production',
    //   },
    // },
  },
});
