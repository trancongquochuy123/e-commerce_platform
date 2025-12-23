import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const tokenUser = request.cookies.get("tokenUser")?.value;

  // Define protected routes
  const protectedRoutes = ["/cart", "/checkout", "/orders"];
  const authRoutes = ["/login", "/signup"];

  // Check if current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // If user is not logged in and tries to access protected route, redirect to login
  if (isProtectedRoute && !tokenUser) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If user is logged in and tries to access auth routes, redirect to home
  if (isAuthRoute && tokenUser) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/cart", "/login", "/signup", "/checkout", "/orders"],
};
