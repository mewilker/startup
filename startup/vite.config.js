import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:6000',
      '/ws': {
        target: 'ws://localhost:6000',
        ws: true,
      },
    },
  },

  build:{
    sourcemap: true,
  }
});