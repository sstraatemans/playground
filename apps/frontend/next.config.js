/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@sw/s_w_trpcserver"],
  async redirects() {
    return [
      {
        source: "/graphql/v1",
        destination:
          "https://swgraphserver-git-fixbuild-steven-straatemans-projects.vercel.app/v1",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [];
  },
};

export default nextConfig;
