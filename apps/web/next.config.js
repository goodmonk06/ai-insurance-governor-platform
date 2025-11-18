/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@insurance-platform/shared'],
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

module.exports = nextConfig;
