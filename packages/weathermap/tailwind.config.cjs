/**
 * Tailwind CSS configuration for the heatmap module.  This file
 * specifies which files Tailwind should scan to generate utility
 * classes.  It also enables arbitrary values (via ``[]`` syntax) so
 * that CSS variables defined in ``styles.css`` can be used in
 * utilities like ``bg-[var(--heatmap-bg-primary)]``.
 */

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};