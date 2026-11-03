// Full Auth.js setup (Node runtime): Credentials provider for staff, bcrypt verification, JWT sessions.
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "@/auth.config";
import { db } from "@/lib/db";
import { loginSchema } from "@/lib/validation";
import { blockedForSeconds, loginKeys, recordFailure, resetFailures } from "@/lib/rateLimit";

export class RateLimitedError extends CredentialsSignin {
  code = "rate_limited";
}

// Compared when the user does not exist so response timing does not reveal which emails have accounts.
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 12);

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(raw, request) {
        const parsed = loginSchema.safeParse(raw);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;
        const keys = loginKeys(email, clientIp(request));

        if (keys.some((k) => blockedForSeconds(k) > 0)) throw new RateLimitedError();

        const user = await db.user.findUnique({
          where: { email: email.toLowerCase() },
          include: { role: true },
        });
        const valid = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
        if (!user || !user.isActive || !valid) {
          keys.forEach(recordFailure);
          return null;
        }

        resetFailures(keys[0]);
        await db.activityLog.create({
          data: { userId: user.id, action: "LOGIN", entity: "User", entityId: String(user.id), detail: "Staf masuk ke dasbor" },
        });
        return { id: String(user.id), name: user.name, email: user.email, role: user.role.name };
      },
    }),
  ],
});
