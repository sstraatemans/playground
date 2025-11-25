"use client";

import { GraphProvider } from "@/components/GraphProvider/GraphProvider";
import { kodeMono, roboto } from "./fonts";
import "./globals.css";

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
      <body className="font-body m-5 flex w-dvw max-w-dvw flex-col">
        <GraphProvider>{children}</GraphProvider>
      </body>
    </html>
  );
};

export default RootLayout;
