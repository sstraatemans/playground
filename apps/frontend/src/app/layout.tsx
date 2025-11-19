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
        <meta content="#f50000" name="theme-color" />
        <link
          rel="icon"
          type="image/png"
          href="/assets/icons/favicon-96x96.png"
          sizes="96x96"
        />
        <link
          rel="icon"
          type="image/svg+xml"
          href="/assets/icons/favicon.svg"
        />
        <link rel="shortcut icon" href="/assets/icons/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/assets/icons/apple-touch-icon.png"
        />
        <meta name="apple-mobile-web-app-title" content="Suske en Wiske API" />
      </head>
      <body className="font-body bg-primary flex w-dvw max-w-dvw flex-col items-center">
        <Stack
          direction="col"
          className="mh-auto mb-10 h-dvh max-w-[1600] items-center px-1 sm:px-4"
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
