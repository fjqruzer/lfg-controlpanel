/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Turbopack configuration for Next.js 16
  turbopack: {
    root: __dirname,
    resolveAlias: {
      '@': './src',
    },
  },
  // Keep webpack config for backwards compatibility (when using --webpack flag)
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './src'),
    };
    return config;
  },
};

module.exports = nextConfig;

