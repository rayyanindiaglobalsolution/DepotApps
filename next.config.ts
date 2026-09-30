import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Kita hapus bagian devIndicators agar error hilang
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn-icons-png.flaticon.com',
      },
    ],
  },
};

export default nextConfig;