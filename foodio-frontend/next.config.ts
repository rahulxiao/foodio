import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '2424',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '2424',
      },
    ],
  },
};


export default nextConfig;
