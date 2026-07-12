import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  // Pin the workspace root so the parent-folder lockfile doesn't confuse Turbopack.
  turbopack: { root: path.resolve(__dirname) },
};

export default nextConfig;
