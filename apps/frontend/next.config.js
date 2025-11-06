/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@playground/trpcserver'],
  async redirects() {
    return [
      {
        source: '/graphql', // Matches /api/graph and any subpaths
        destination: `${process.env.GRAPHQLSERVER}`,
      },
    ];
  },
  async rewrites() {
    return [];
  },
};

export default nextConfig;
