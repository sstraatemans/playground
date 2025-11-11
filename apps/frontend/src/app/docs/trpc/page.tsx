import { readFile } from "fs/promises";
import { join } from "path";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";

// This is a Server Component - Overview/README page
const Page = async () => {
  const docsPath = join(process.cwd(), "..", "..", "apps", "trpcclient");

  try {
    const readme = await readFile(join(docsPath, "README.md"), "utf-8");
    return <MarkdownRenderer content={readme} />;
  } catch (error) {
    console.error("Error loading documentation:", error);
    return (
      <div className="p-8">
        <h1 className="mb-4 text-2xl font-bold">Documentation Not Available</h1>
        <p className="text-red-600">
          Unable to load tRPC documentation files. Please ensure the trpcclient
          package is available.
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
