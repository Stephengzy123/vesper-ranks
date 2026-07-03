import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  if (request.nextUrl.pathname === "/admin") {
    response.cookies.delete("vesper_session");
  }

  return response;
}

export const config = {
  matcher: ["/admin"]
};
