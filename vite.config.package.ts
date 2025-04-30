import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";

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
    svgr({
      include: "**/*.svg",
      exclude: "",
      svgrOptions: {
        icon: true,
        svgo: true,
        plugins: ["@svgr/plugin-jsx"],
        svgoConfig: {
          plugins: [
            {
              name: "preset-default",
              params: {
                overrides: {
                  removeViewBox: false,
                  removeHiddenElems: false,
                },
              },
            },
            "removeDimensions",
          ],
        },
      },
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
