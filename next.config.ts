import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow all localtunnel subdomains to load CSS/JS in dev mode
  allowedDevOrigins: [
    "*.loca.lt",
    "loca.lt"
  ]
};

export default nextConfig;
