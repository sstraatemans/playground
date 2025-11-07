'use client';

import Link from 'next/link';

const Page = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">docs</h1>
      <ul>
        <li>
          <Link href="/docs/rest">REST API Documentation (Swagger)</Link>
        </li>
        <li>
          <Link href="/docs/trpc">TRPC API Documentation</Link>
        </li>
        <li>
          <Link href="/graphql">GraphQL API Documentation (GraphQL)</Link>
        </li>
      </ul>

      <pre className="font-mono">kodemono font</pre>
    </div>
  );
};

export default Page;
