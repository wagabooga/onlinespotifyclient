// NEXTJS 12 MIDDLEWARE:
import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"

export async function middleware(req) {
  // token will exist if user is logged in
  const token = await getToken({ req, secret: process.env.JWT_SECRET});

  const { pathname } = req.nextUrl
  // allow the request if the following is true...
  // 1) the token exists open the gates and let them through
  // 2) the token exists
  
  if (pathname.includes('/api/auth') || token ) {
    return NextResponse.next();
  }
  // redirect them to login if they dont have token aND are requesting a protected route
  if (!token && pathname !== "/login") {
    return NextResponse.redirect("/login");
  }
}