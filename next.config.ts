import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        
      },
      {
        protocol: 'https',
        hostname: 'static.wixstatic.com',
        
      },
      {
        protocol: 'https',
        hostname: 'google.com',
        
      },
    ],
  },
};

export default nextConfig;
