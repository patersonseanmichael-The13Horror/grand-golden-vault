import path from 'node:path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  outputFileTracingRoot: path.join(process.cwd()),
};

export default nextConfig;
