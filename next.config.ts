import type { NextConfig } from "next";

const replitDomains = process.env.REPLIT_DOMAINS?.split(",") || [];
const allowedOrigins = replitDomains.map(domain => `https://${domain}`);

const nextConfig: NextConfig = {
  allowedDevOrigins: allowedOrigins,
};

export default nextConfig;
