import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://chatappapi-86qe.onrender.com/api/',
        changeOrigin: true,
        secure: false,
      },
      '/ws': {
        target: 'ws://chatappapi-86qe.onrender.com',
        ws: true,
        changeOrigin: true,
      },
    },
  },
});
