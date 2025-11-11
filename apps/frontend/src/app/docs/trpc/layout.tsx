import Link from "next/link";
import Stack from "@/components/layout/Stack";
import { Heading } from "@/components/Typography/Heading";

export default function TrpcDocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Stack direction="col" className="w-full">
      <Heading>tRPC Client Documentation</Heading>

      <nav className="mb-6 flex gap-4 border-b pb-2">
        <Link
          href="/docs/trpc"
          className="rounded px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Overview
        </Link>
        <Link
          href="/docs/trpc/api-reference"
          className="rounded px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          API Reference
        </Link>
        <Link
          href="/docs/trpc/app-router"
          className="rounded px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Next.js App Router
        </Link>
        <Link
          href="/docs/trpc/schemas"
          className="rounded px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Schemas & Types
        </Link>
      </nav>

      <div className="w-full">{children}</div>
    </Stack>
  );
}
