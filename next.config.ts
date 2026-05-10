import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.governmentlandsales.us",
        pathname: "/storage/property-images/**",
      },
    ],
  },
};

export default nextConfig;
