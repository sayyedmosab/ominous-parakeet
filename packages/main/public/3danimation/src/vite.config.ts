import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite 6.0 configuration optimized for React 19 + Three.js
export default defineConfig({
  plugins: [
    react({
      // Enable React 19 features
      jsxImportSource: 'react',
      babel: {
        // Enable React Compiler if available
        plugins: [
          // React Compiler will be automatically detected
        ],
      },
    }),
  ],
  optimizeDeps: {
    // Pre-bundle Three.js and related packages for faster dev server
    include: [
      'three',
      '@react-three/fiber',
      '@builder.io/react',
      '@builder.io/sdk',
      'react-router-dom'
    ],
    // Exclude packages that should not be pre-bundled
    exclude: [],
  },
  build: {
    // Optimize for modern browsers (React 19 + WebGL)
    target: ['es2022', 'chrome100', 'safari14'],
    // Better code splitting for large 3D assets
    rollupOptions: {
      output: {
        // Separate chunks for better caching
        manualChunks: {
          'three-vendor': ['three'],
          'react-three': ['@react-three/fiber'],
          'builder': ['@builder.io/react', '@builder.io/sdk'],
          'router': ['react-router-dom'],
        },
      },
    },
    // Enable source maps for debugging
    sourcemap: true,
  },
  server: {
    // Enhanced HMR for React 19
    hmr: {
      overlay: true,
    },
    // Faster dev server startup
    fs: {
      // Allow serving files from one level up (for Builder.io assets)
      allow: ['..'],
    },
  },
  // Enhanced CSS handling for Tailwind V4
  css: {
    devSourcemap: true,
    transformer: 'postcss',
  },
  // Better resolution for ESM packages
  resolve: {
    alias: {
      // Ensure consistent Three.js version across all imports
      'three': 'three',
    },
  },
  // Environment variables for different environments
  define: {
    // Enable React DevTools in development
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
  },
});