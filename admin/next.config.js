/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use standalone output for optimized production builds
  // This creates a minimal server bundle for deployment
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  
  // Image optimization disabled for Back4App compatibility
  images: {
    unoptimized: true,
  },
  
  // Ensure environment variables are available at build time
  // Note: These should also be set in Back4App dashboard
  env: {
    NEXT_PUBLIC_BACK4APP_APP_ID: process.env.NEXT_PUBLIC_BACK4APP_APP_ID,
    NEXT_PUBLIC_BACK4APP_JS_KEY: process.env.NEXT_PUBLIC_BACK4APP_JS_KEY,
    NEXT_PUBLIC_BACK4APP_SERVER_URL: process.env.NEXT_PUBLIC_BACK4APP_SERVER_URL || 'https://parseapi.back4app.com',
  },
  
  // Production optimizations
  compress: true,
  poweredByHeader: false,
};

module.exports = nextConfig;
