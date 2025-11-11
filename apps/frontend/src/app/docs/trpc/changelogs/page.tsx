import { readFile } from "fs/promises";
import { join } from "path";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import Stack from "@/components/layout/Stack";

// Schemas & Types page
const Page = async () => {
  const docsPath = join(process.cwd(), "..", "..", "apps", "trpcclient");

  try {
    const schemas = await readFile(join(docsPath, "", "CHANGELOG.md"), "utf-8");
    return <MarkdownRenderer content={schemas} />;
  } catch (error) {
    console.error("Error loading changelogs:", error);
    return (
      <Stack className="p-8">
        <h1 className="mb-4 text-2xl font-bold">Documentation Not Available</h1>
        <p className="text-red-600">Unable to load changelogs documentation.</p>
        {error instanceof Error && (
          <pre className="mt-4 overflow-auto rounded bg-gray-100 p-4">
            {error.message}
          </pre>
        )}
      </Stack>
    );
  }
};

export default Page;
