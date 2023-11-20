import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// eslint-disable-next-line import/no-extraneous-dependencies
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://api.ads-huzin.store/',
        changeOrigin: true,
      },
      '/auth': {
        target: 'https://api.ads-huzin.store/',
        changeOrigin: true,
      },
      '/sanctum': {
        target: 'https://api.ads-huzin.store/',
        changeOrigin: true,
      },
    },
  },
  plugins: [react(), svgr(), tsconfigPaths()],
});
