import { readFile } from "fs/promises";
import { join } from "path";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";

// Next.js App Router page
const Page = async () => {
  const docsPath = join(process.cwd(), "..", "..", "apps", "trpcclient");

  try {
    const appRouter = await readFile(
      join(docsPath, "docs", "APP_ROUTER.md"),
      "utf-8",
    );
    return <MarkdownRenderer content={appRouter} />;
  } catch (error) {
    console.error("Error loading App Router documentation:", error);
    return (
      <div className="p-8">
        <h1 className="mb-4 text-2xl font-bold">Documentation Not Available</h1>
        <p className="text-red-600">
          Unable to load Next.js App Router documentation.
        </p>
        {error instanceof Error && (
          <pre className="mt-4 overflow-auto rounded bg-gray-100 p-4">
            {error.message}
          </pre>
        )}
      </div>
    );
  }
};

export default Page;
