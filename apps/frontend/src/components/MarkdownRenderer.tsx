import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Heading } from "./Typography/Heading";
import { Typography } from "./Typography/Typography";
import Link from "next/link";

interface MarkdownRendererProps {
  content: string;
}

// Helper function to generate ID from heading text
const generateId = (children: React.ReactNode): string => {
  const text = extractText(children);
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

// Helper function to extract text from React children
const extractText = (children: React.ReactNode): string => {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(extractText).join("");
  if (
    children &&
    typeof children === "object" &&
    "props" in children &&
    children.props &&
    typeof children.props === "object" &&
    "children" in children.props
  ) {
    return extractText(children.props.children as React.ReactNode);
  }
  return "";
};

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  return (
    <div className="prose prose-lg max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({ children, ...props }) => (
            <Heading variant="h2" id={generateId(children)} {...props}>
              {children}
            </Heading>
          ),
          h2: ({ children, ...props }) => (
            <Heading variant="h3" id={generateId(children)} {...props}>
              {children}
            </Heading>
          ),
          h3: ({ children, ...props }) => (
            <Heading variant="h4" id={generateId(children)} {...props}>
              {children}
            </Heading>
          ),
          h4: ({ children, ...props }) => (
            <Heading variant="h5" id={generateId(children)} {...props}>
              {children}
            </Heading>
          ),
          p: ({ ...props }) => (
            <Typography variant="body" {...props}>
              {props.content}
            </Typography>
          ),
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match;

            if (isInline) {
              return (
                <code
                  className="rounded bg-gray-100 px-1.5 py-0.5 text-sm text-red-600"
                  style={{ fontFamily: "var(--font-kodemono)" }}
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <code
                className={`block overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-white ${className}`}
                style={{ fontFamily: "var(--font-kodemono)" }}
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: ({ ...props }) => (
            <pre className="mb-4 overflow-x-auto font-mono" {...props} />
          ),
          ul: ({ ...props }) => (
            <ul className="mb-4 list-inside list-disc space-y-2" {...props} />
          ),
          ol: ({ ...props }) => (
            <ol
              className="mb-4 list-inside list-decimal space-y-2"
              {...props}
            />
          ),
          li: ({ ...props }) => <li className="ml-4" {...props} />,
          blockquote: ({ ...props }) => (
            <blockquote
              className="my-4 border-l-4 border-gray-300 pl-4 italic"
              {...props}
            />
          ),
          a: ({ href, ...props }) => {
            // Handle anchor links (table of contents)
            if (href?.startsWith("#")) {
              return <a href={href} {...props} className="underline" />;
            }
            // Handle external links
            if (href?.startsWith("http://") || href?.startsWith("https://")) {
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                  className="underline"
                />
              );
            }
            // Handle internal markdown links and convert them to frontend routes
            if (href) {
              let internalPath = href;

              // Transform .md file links to frontend routes
              if (internalPath.includes(".md")) {
                // Handle relative paths to docs
                internalPath = internalPath
                  .replace(/^\.\.\/README\.md$/, "/docs/trpc") // Keep special case
                  .replace(
                    /^(?:\.\/docs\/|\.\/)?([A-Z_]+)\.md$/i,
                    (match, name) =>
                      `/docs/trpc/${name.toLowerCase().replace(/_/g, "-")}`,
                  )
                  .replace(/\.md$/, ""); // Final cleanup for any leftover .md (shouldn't be needed, but safe)
              }

              return (
                <Link href={internalPath} {...props} className="underline" />
              );
            }

            // Fallback
            return <Link href={`/${href}`} {...props} className="underline" />;
          },
          table: ({ ...props }) => (
            <div className="mb-4 overflow-x-auto">
              <table
                className="min-w-full border-collapse border border-gray-300"
                {...props}
              />
            </div>
          ),
          thead: ({ ...props }) => <thead className="bg-gray-100" {...props} />,
          th: ({ ...props }) => (
            <th
              className="border border-gray-300 px-4 py-2 text-left font-semibold"
              {...props}
            />
          ),
          td: ({ ...props }) => (
            <td className="border border-gray-300 px-4 py-2" {...props} />
          ),
          hr: ({ ...props }) => (
            <hr className="my-8 border-gray-300" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
