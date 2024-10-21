import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const enableAuth = process.env.NEXT_PUBLIC_ENABLE_AUTH === "true";

  if (!enableAuth) {
    return NextResponse.next();
  }

  const isAuthenticated = request.cookies.get("isAuthenticated")?.value === "true";
  const isAuthPage = request.nextUrl.pathname === "/login";

  if (!isAuthenticated && !isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectUrl", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
