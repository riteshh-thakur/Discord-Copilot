/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure images
  images: {
    unoptimized: true,
    domains: [],
  },
  // Disable strict mode for production
  reactStrictMode: false,
  // Enable SWC minification
  swcMinify: true,
  // Use standalone output for optimized production builds
  output: 'standalone',
  
  // Ensure environment variables are available at build time
  env: {
    NEXT_PUBLIC_BACK4APP_APP_ID: process.env.NEXT_PUBLIC_BACK4APP_APP_ID,
    NEXT_PUBLIC_BACK4APP_JS_KEY: process.env.NEXT_PUBLIC_BACK4APP_JS_KEY,
    NEXT_PUBLIC_BACK4APP_SERVER_URL: process.env.NEXT_PUBLIC_BACK4APP_SERVER_URL || 'https://parseapi.back4app.com',
  },
  
  // Production optimizations
  compress: true,
  poweredByHeader: false,
  
  // Vercel-specific configuration
  trailingSlash: false,
  generateEtags: false,
};

module.exports = nextConfig;
