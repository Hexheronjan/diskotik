import type { NextConfig } from "next";

// Fully static, client-only app: no API routes, no server actions.
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
