import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { ViteAliases } from "vite-aliases";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "localhost",
    port: 10000,
    strictPort: true,
  },
  plugins: [
    react(),
    ViteAliases({
      /**
       * Relative path to the project directory
       */
      dir: "src",

      /**
       * Prefix symbol for the aliases
       */
      prefix: "@",

      /**
       * Allow searching for subdirectories
       */
      deep: true,

      /**
       * Search depthlevel for subdirectories
       */
      depth: 2,

      /**
       * Creates a Logfile
       * use `logPath` to change the location
       */
      createLog: true,

      /**
       * Path for Logfile
       */

      logPath: "src/logs",

      /**
       * Create global project directory alias
       */
      createGlobalAlias: true,

      /**
       * Turns duplicates into camelCased path aliases
       */
      adjustDuplicates: true,

      /**
       * Used paths in JS/TS configs will now be relative to baseUrl
       */
      useAbsolute: false,

      /**
       * Adds seperate index paths
       * approach created by @davidohlin
       */
      useIndexes: true,

      /**
       * Generates paths in IDE config file
       * works with JS or TS
       */
      useConfig: true,

      /**
       * Will generate Paths in tsconfig
       * used in combination with `useConfig`
       * Typescript will be auto detected
       */
      dts: false,

      /**
       * Root path of Vite project
       */
      root: process.cwd(),
    }),
  ],
  css: {
    modules: {
      localsConvention: "camelCase",
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
