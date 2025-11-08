/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@sw/s_w_trpcserver"],

  // Remove or comment out redirects if you don't want browser redirect
  // async redirects() {
  //   return [
  //     {
  //       source: "/graphql/v1",
  //       destination: "https://swgraphserver-git-fixbuild-steven-straatemans-projects.vercel.app/v1",
  //       permanent: true,
  //     },
  //   ];
  // },

  async rewrites() {
    return [
      {
        source: "/graphql/v1/:path*",
        destination:
          "https://swgraphserver-git-fixbuild-steven-straatemans-projects.vercel.app/v1/:path*",
      },
      // Optional: also catch root /graphql/v1 exactly (without trailing slash issues)
      {
        source: "/graphql/v1",
        destination:
          "https://swgraphserver-git-fixbuild-steven-straatemans-projects.vercel.app/v1",
      },
    ];
  },
};

export default nextConfig;
