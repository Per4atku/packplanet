import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker deployment
  output: "standalone",

  // Configure Server Actions
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb", // Increase from default 1mb to 20mb for image uploads
    },
  },
};

export default nextConfig;
