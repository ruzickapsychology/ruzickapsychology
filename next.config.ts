import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  images: {
    loader: "custom",
    loaderFile: "./src/lib/next-image-loader.ts",
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
