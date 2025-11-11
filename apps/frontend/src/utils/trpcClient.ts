import { createClient } from "@sw/trpcclient";

export const trpcClient = createClient({
  url: process.env.NEXT_PUBLIC_TRPC_SERVER_URL!,
});
