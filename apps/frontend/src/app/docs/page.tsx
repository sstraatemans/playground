"use client";

import Stack from "@/components/layout/Stack";
import { Heading } from "@/components/Typography/Heading";
import Link from "next/link";

const Page = () => {
  return (
    <Stack className="w-full flex-col">
      <Heading variant="h4">Docs</Heading>
      <ul>
        <li>
          <Link href="/docs/rest">REST Overview</Link>
          <Link href="/docs/graphql">GraphQL Overview</Link>
          <Link href="/docs/trpc/overview">tRPC Overview</Link>
        </li>
      </ul>
    </Stack>
  );
};

export default Page;
