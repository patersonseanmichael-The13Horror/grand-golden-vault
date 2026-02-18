/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/grand-golden-vault',
  assetPrefix: '/grand-golden-vault/',
};

export default nextConfig;
