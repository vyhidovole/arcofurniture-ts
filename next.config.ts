//next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },

  async rewrites() {
    return [
      {
        source: '/work',
        destination: 'http://localhost:3002/work',
      },
      {
        source: '/Products',
        destination: 'http://localhost:3002/Products',
      },
    ];
  },
};

export default nextConfig;
