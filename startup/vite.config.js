import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:5999',
      '/ws': {
        target: 'ws://localhost:5999',
        ws: true,
      },
    },
  },

  build:{
    sourcemap: true,
  }
});