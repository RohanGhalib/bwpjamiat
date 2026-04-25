import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.8'],
  cacheComponents: true,
  experimental: {
    instantNavigationDevToolsToggle: true,
  },
  serverExternalPackages: ['@aws-sdk/s3-request-presigner', '@aws-sdk/client-s3', 'fluent-ffmpeg', 'ffmpeg-static'],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: '**.r2.dev',
      },
      {
        protocol: 'https',
        hostname: '**.r2.cloudflarestorage.com',
      },
    ],
  },
};

export default nextConfig;
