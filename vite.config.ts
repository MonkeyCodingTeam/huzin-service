import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
// eslint-disable-next-line import/no-extraneous-dependencies
import tsconfigPaths from "vite-tsconfig-paths";
import viteSvgr from "vite-plugin-svgr";
import process from "process";

// https://vitejs.dev/config/
// @ts-ignore
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    server: {
      port: 3000,
    },
    define: {
      __MODE__: JSON.stringify(process.env.VITE_MODE),
      __APP_TITLE__: JSON.stringify(process.env.VITE_APP_TITLE),
      __APP_API_URL__: JSON.stringify(process.env.VITE_APP_API_URL),
      __APP_DOMAIN__: JSON.stringify(process.env.VITE_APP_DOMAIN),
      __VK_API_URL__: JSON.stringify(process.env.VITE_VK_API_URL),
      __VK_TOKEN__: JSON.stringify(process.env.VITE_VK_TOKEN),
      __VK_AGENCY__: JSON.stringify(process.env.VITE_VK_AGENCY),
    },
    plugins: [react(), viteSvgr({ exportAsDefault: true }), tsconfigPaths()],
  });
};
