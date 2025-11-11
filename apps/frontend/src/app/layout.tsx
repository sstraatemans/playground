"use client";

import { kodeMono, roboto } from "./fonts";
import "./globals.css";
import Stack from "@/components/layout/Stack";
import { TabList, Tabs } from "react-aria-components";
import { useRouter } from "next/navigation";
import { Tab } from "@/components/Tabs/Tab";
import Link from "next/link";

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const router = useRouter();

  const handleTabChange = (url: string) => {
    router.push(url);
  };

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
          className="mh-auto h-dvh max-w-[1600] items-start px-10"
        >
          <img src="/assets/header.png" />

          <Stack className="flex inline-block w-full max-w-full flex-1 rounded border-[5px] border-white bg-gray-200 bg-white p-8 outline outline-1 outline-offset-[-16px] outline-black">
            <Tabs className="w-full">
              <TabList aria-label="Article categories">
                <Tab
                  id="home"
                  onClick={() => {
                    handleTabChange("/");
                  }}
                >
                  Home
                </Tab>
                <Tab
                  id="graph"
                  onClick={() => {
                    handleTabChange("/docs/graphql");
                  }}
                >
                  GraphQL
                </Tab>
                <Tab
                  id="rest"
                  onClick={() => {
                    handleTabChange("/docs/rest");
                  }}
                >
                  Rest
                </Tab>
                <Tab
                  id="trpc"
                  onClick={() => {
                    handleTabChange("/docs/trpc");
                  }}
                >
                  tRPC
                </Tab>
              </TabList>
            </Tabs>

            {children}
          </Stack>
          <Stack className="h-7 flex-row gap-2">
            <Link href="/changelog">Changelog</Link>
            <Link href="/about">About us</Link>
          </Stack>
        </Stack>
      </body>
    </html>
  );
};

export default RootLayout;
