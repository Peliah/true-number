import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { refreshTokenAction } from "./actions/auth";

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch {
    return true;
  }
}

function getUserFromToken(token: string): { userId: string; role: string } | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      userId: payload.userId,
      role: payload.role
    };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;

  const isAuthPage = request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname.startsWith("/auth");
  const isProtectedPage = request.nextUrl.pathname.startsWith("/game") ||
    request.nextUrl.pathname.startsWith("/dashboard");
  const isDashboardPage = request.nextUrl.pathname.startsWith("/dashboard");

  // Check if token exists and is valid
  const hasValidToken = accessToken && !isTokenExpired(accessToken);

  if (!hasValidToken && accessToken) {
    // Token exists but is expired - try to refresh
    try {
      const refreshResult = await refreshTokenAction();

      if (refreshResult.success) {
        // Token refreshed successfully, continue with request
        return NextResponse.next();
      }
    } catch (error) {
      // Refresh failed, treat as no valid token and redirect to login
      console.error("Token refresh error:", error);
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (!hasValidToken) {
    const response = isProtectedPage
      ? NextResponse.redirect(new URL("/", request.url))
      : NextResponse.next();

    // Clear expired cookies
    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");
    response.cookies.delete("user");

    return response;
  }

  // Check admin access for dashboard pages
  if (isDashboardPage && hasValidToken && accessToken) {
    const user = getUserFromToken(accessToken);

    if (!user) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // If user is not an admin, redirect to game page
    if (user.role !== 'admin') {
      return NextResponse.redirect(new URL("/game", request.url));
    }
  }

  // User has valid token - redirect from auth pages
  if (isAuthPage) {
    return NextResponse.redirect(new URL("/game", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};