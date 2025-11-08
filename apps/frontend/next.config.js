/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@sw/s_w_trpcserver"],
  async redirects() {
    return [];
  },
  async rewrites() {
    return [
      {
        source: "/graphql/v1", // Matches /api/graph and any subpaths
        destination:
          process.env.GRAPHQLSERVER || "https://graphql.suskeenwiske.dev/v1", // Proxies to external URL
      },
    ];
  },
};

export default nextConfig;
