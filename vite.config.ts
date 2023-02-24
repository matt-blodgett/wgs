import { defineConfig } from 'vite'
const path = require('path');
import react from '@vitejs/plugin-react'

export default defineConfig({
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [react()],
});
