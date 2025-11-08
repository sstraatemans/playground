// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith("/graphql/v1")) {
    const targetPath = path.replace("/graphql/v1", "/v1");
    const url = new URL(
      targetPath + request.nextUrl.search,
      process.env.GRAPHQLSERVER || "",
    );

    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/graphql/v1/:path*",
};
