/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@playground/trpcserver'],
  async redirects() {
    return [];
  },
  async rewrites() {
    return [
      {
        source: '/graphql', // Matches /api/graph and any subpaths
        destination: process.env.GRAPHQLSERVER, // Proxies to external URL
      },
    ];
  },
};

export default nextConfig;
