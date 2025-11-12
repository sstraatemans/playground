"use client";

import { DocsLinks } from "@/components/DocsLinks/DocsLinks";
import Stack from "@/components/layout/Stack";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { Heading } from "@/components/Typography/Heading";

const Page = () => {
  return (
    <Stack className="w-full flex-col">
      <MarkdownRenderer
        content={`
# De Alwetende API

Everyone knows **Suske en Wiske** — the kids, Lambik, Jerom, Tante Sidonia, Professor Barabas, and the rest of Willy Vandersteen’s iconic crew. Hundreds of albums, decades of adventures, and somehow... still no clean, structured way to get the data. Because why would anyone need that? (Spoiler: me!)

Build trivia apps, plot character arcs, or finally prove Lambik was in *De Sprietatoom*. All JSON, no auth, rate-limited fairly. Dive in at **[the documentation](/docs)** or hit the endpoints directly.
`}
      />

      <Heading variant="h4">Docs</Heading>

      <DocsLinks />
    </Stack>
  );
};

export default Page;
