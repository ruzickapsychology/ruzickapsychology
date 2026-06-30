import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";
import path from "node:path";

const nextConfig: NextConfig = {
  typedRoutes: true,
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  images: {
    loader: "custom",
    loaderFile: "./src/lib/next-image-loader.ts",
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})(nextConfig);
