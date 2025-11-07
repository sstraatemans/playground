"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import { trpc } from "@/providers/TRPCProvider";
import { kodeMono, roboto } from "./fonts";
import "./globals.css";
import Stack from "@/components/layout/Stack";

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:4000/trpc",
          transformer: superjson,
        }),
      ],
    }),
  );

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${roboto.variable} ${kodeMono.variable} antialiased`}
    >
      <head>
        <title>Suske en Wiske - De Alwetende API</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="TRPC demo" />
        <meta content="text/html; charset=UTF-8" name="Content-Type" />
        <meta content="#020E1B" name="theme-color" />
      </head>
      <body className="font-body bg-primary flex max-w-full flex-col items-center">
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <Stack
              direction="col"
              className="mh-auto h-dvh max-w-[1600] items-start px-10"
            >
              <img src="/assets/header.png" />

              <Stack className="flex inline-block w-full max-w-full flex-1 border-[5px] border-white bg-gray-200 bg-white p-8 outline outline-1 outline-offset-[-16px] outline-black">
                {children}
              </Stack>
              <Stack className="h-7"> </Stack>
            </Stack>
          </QueryClientProvider>
        </trpc.Provider>
      </body>
    </html>
  );
};

export default RootLayout;
