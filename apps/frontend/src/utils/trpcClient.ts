import { createClient } from "@straatemans/sw_trpcclient";

export const trpcClient = createClient({
  url:
    process.env.NEXT_PUBLIC_TRPC_SERVER_URL ||
    "https://playground-trpcserver.vercel.app/trpc/v1",
});
