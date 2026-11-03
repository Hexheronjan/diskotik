// Request-routing layer (Next.js 16 "proxy"). Protects /admin before any page renders.
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import type { NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);

export default async function proxy(request: NextRequest) {
  return (auth as unknown as (req: NextRequest) => Promise<Response | void>)(request);
}

export const config = {
  matcher: ["/admin/:path*", "/masuk", "/login"],
};
