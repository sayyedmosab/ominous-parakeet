import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration for the weathermap module
export default defineConfig({
  plugins: [react()],
  // Weathermap app runs on port 5177 with host mode
  server: {
    port: 5177,
    host: true,
  },
});