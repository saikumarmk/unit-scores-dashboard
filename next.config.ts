import type { NextConfig } from "next";
const isProd = process.env.NODE_ENV === 'production';
const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    unoptimized: true, // Disable default image optimization
  },
  typescript: {
    ignoreBuildErrors: true, // Skip TypeScript type checking
    
  },
  output: 'export',
  basePath: isProd ? '/unit-scores-dashboard' : '',
};

export default nextConfig;
