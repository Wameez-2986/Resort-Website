import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdminJWT } from "@/lib/adminAuth";

export async function middleware(request: NextRequest) {
  // Protect every route under /talav-control-panel/dashboard
  if (request.nextUrl.pathname.startsWith("/talav-control-panel/dashboard")) {
    const token = request.cookies.get("talav_admin_token")?.value;

    if (!token || !(await verifyAdminJWT(token))) {
      return NextResponse.redirect(new URL("/talav-control-panel", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/talav-control-panel/dashboard/:path*"],
};
