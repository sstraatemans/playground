"use client";

import { DocsLinks } from "@/components/DocsLinks/DocsLinks";
import Stack from "@/components/layout/Stack";
import { Heading } from "@/components/Typography/Heading";

const Page = () => {
  return (
    <Stack className="w-full flex-col">
      <Heading variant="h4">Docs</Heading>
      <DocsLinks />
    </Stack>
  );
};

export default Page;
