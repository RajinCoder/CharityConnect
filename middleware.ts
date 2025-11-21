/* eslint-disable @typescript-eslint/no-explicit-any */
// Bouncer
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req: any) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    console.log("No token found, redirecting to login.");
    return Response.redirect(new URL("/Account/Login", req.url));
  }

  try {
    await jwtVerify(token, secret);
    return;
  } catch (e) {
    console.log("Invalid token, redirecting to login.", e);
    return Response.redirect(new URL("/Account/Login", req.url));
  }
}

export const config = {
  matcher: ["/Dashboard/:path*", 
"/Account/Profile"
  ], //
};