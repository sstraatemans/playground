/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@playground/trpcserver'],
  async rewrites() {
    return [
      {
        source: '/graphql', // Matches /api/graph and any subpaths
        destination: 'http://localhost:4001/graphql', // Proxies to external URL
      },
    ];
  },
};

export default nextConfig;
