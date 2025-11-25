import { ssrExchange, cacheExchange, fetchExchange, createClient } from "urql";

export const graphSSR = ssrExchange({
  isClient: typeof window !== "undefined",
});

export const graphClient = createClient({
  url: process.env.GRAPHQLSERVER ?? "https://graphql.suskeenwiske.dev/v1",
  suspense: true,
  exchanges: [cacheExchange, graphSSR, fetchExchange],
});
