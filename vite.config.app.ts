import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
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
});
