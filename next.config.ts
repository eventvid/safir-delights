import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      // Add your own storage domain here, e.g. Supabase Storage:
      // { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;
