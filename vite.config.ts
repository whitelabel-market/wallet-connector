// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, "src/index.ts"),
            name: "wallet-connector",
            fileName: (format) => `wallet-connector.${format}.ts`,
        },
        rollupOptions: {
            external: ["vue"],
            output: {
                // Provide global variables to use in the UMD build
                // Add external deps here
                globals: {
                    vue: "Vue",
                },
            },
        },
    },
    plugins: [vue(), tsconfigPaths()],
});
