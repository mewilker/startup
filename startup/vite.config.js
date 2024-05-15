import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:6001',
      '/ws': {
        target: 'ws://localhost:6001',
        ws: true,
      },
    },
  },

  build:{
    sourcemap: true,
  }
});