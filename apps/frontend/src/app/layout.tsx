"use client";

import { kodeMono, roboto } from "./fonts";
import "./globals.css";
import Stack from "@/components/layout/Stack";
import Link from "next/link";

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
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
        <Stack
          direction="col"
          className="mh-auto mb-10 h-dvh max-w-[1600] items-center px-10"
        >
          <img src="/assets/header.png" />

          <Stack
            direction="col"
            className="w-full max-w-full flex-1 rounded bg-white p-4 pt-0"
          >
            <Stack direction="row" className="my-2 gap-6 self-center">
              <Link href="/">Home</Link>
              <Link href="/docs">Docs</Link>
              <Link href="/about">About us</Link>
            </Stack>
            <Stack className="flex-1 rounded border border-[1px] border-black p-6">
              {children}
            </Stack>
          </Stack>
        </Stack>
      </body>
    </html>
  );
};

export default RootLayout;
