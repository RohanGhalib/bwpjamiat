import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.8'],
  cacheComponents: true,
  experimental: {
    instantNavigationDevToolsToggle: true,
  },
  serverExternalPackages: ['@aws-sdk/s3-request-presigner', '@aws-sdk/client-s3', 'fluent-ffmpeg', 'ffmpeg-static', 'firebase', '@firebase/firestore'],

  async redirects() {
    return [
      {
        source: '/ember/verify',
        destination: '/ember/certificate/verify',
        permanent: true,
      },
    ];
  },


  // IMPORTANT: If you add new domains here, you MUST also add them to
  // ALLOWED_IMAGE_DOMAINS in lib/image-utils.ts
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
      {
        protocol: 'https',
        hostname: 'read-maududi-stage.s3.us-east-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'read-maududi-stage.s3.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;
