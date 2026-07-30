import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Tree-shake large icon/animation libraries — only ship what's used
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  images: {
    // Serve modern formats — AVIF is ~50% smaller than JPEG, WebP ~30% smaller
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
