import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  images: { unoptimized: true },
  basePath: '/komputer-ai',
  trailingSlash: true,
  reactStrictMode: true,
  turbopack: {
    resolveSymlinks: false,
  },
  webpack(config) {
    config.resolve.symlinks = false;
    return config;
  },
};

export default withMDX(config);
