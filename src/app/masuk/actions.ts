"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { loginSchema } from "@/lib/validation";

export interface LoginState {
  error?: string;
  fieldErrors?: { email?: string; password?: string };
  email?: string;
}

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const raw = { email: formData.get("email"), password: formData.get("password") };
  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    const flat = parsed.error.flatten().fieldErrors;
    return {
      fieldErrors: { email: flat.email?.[0], password: flat.password?.[0] },
      email: typeof raw.email === "string" ? raw.email : "",
    };
  }

  try {
    await signIn("credentials", { email: parsed.data.email, password: parsed.data.password, redirectTo: "/admin" });
  } catch (error) {
    if (error instanceof AuthError) {
      const code = (error as AuthError & { code?: string }).code;
      if (code === "rate_limited") {
        return { error: "Terlalu banyak percobaan gagal. Coba lagi dalam 15 menit.", email: parsed.data.email };
      }
      return { error: "Email atau kata sandi salah.", email: parsed.data.email };
    }
    // Successful sign-in redirects by throwing; any other error must propagate.
    throw error;
  }
  return {};
}
