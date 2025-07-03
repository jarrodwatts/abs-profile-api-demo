import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.reservoir.tools',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
