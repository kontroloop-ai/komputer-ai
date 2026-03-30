import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
      {
        source: '/healthz',
        destination: 'http://localhost:8080/healthz',
      },
    ];
  },
};

export default nextConfig;
