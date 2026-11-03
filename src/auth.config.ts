// Edge-safe Auth.js configuration (no database or bcrypt imports) shared by the proxy and the full auth setup.
import type { NextAuthConfig } from "next-auth";
import { PERMISSIONS, hasPermission } from "@/lib/permissions";

export const authConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  providers: [],
  callbacks: {
    // Runs in the proxy for every matched request: protects /admin and redirects /login or /masuk when already signed in.
    authorized({ auth, request: { nextUrl } }) {
      const signedIn = !!auth?.user;
      const isAdminArea = nextUrl.pathname.startsWith("/admin");
      if (isAdminArea) return signedIn && hasPermission(auth?.user?.role, PERMISSIONS.DASHBOARD_VIEW);
      if ((nextUrl.pathname === "/masuk" || nextUrl.pathname === "/login") && signedIn) {
        return Response.redirect(new URL("/admin", nextUrl));
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id ?? "");
        session.user.role = typeof token.role === "string" ? token.role : "";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
