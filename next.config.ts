import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for GitHub Pages
  output: 'export',
  // Ensure links/assets work under the repo subpath
  basePath: '/wentitech',
  assetPrefix: '/wentitech/',
  // Make routes end with a trailing slash so Pages serves index.html correctly
  trailingSlash: true,
  // Disable Next Image optimization on Pages
  images: { unoptimized: true },
  productionBrowserSourceMaps: true,
};

export default nextConfig;
