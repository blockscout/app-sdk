import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    dts({
      include: ["./src/package/**/*.ts", "./src/package/**/*.tsx"],
      rollupTypes: true,
      outDir: "./dist",
      insertTypesEntry: true,
      entryRoot: "./src/package",
      staticImport: true,
      tsconfigPath: "./tsconfig.package.json",
    }),
  ],
  build: {
    lib: {
      entry: "./src/package/index.ts",
      formats: ["es"],
      fileName: "index",
    },
    outDir: "./dist",
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
      ],
      output: {
        preserveModules: false,
        exports: "named",
        interop: "auto",
      },
    },
  },
});
