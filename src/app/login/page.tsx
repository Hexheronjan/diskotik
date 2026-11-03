import type { Metadata } from "next";
import Link from "next/link";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { LoginForm } from "../masuk/LoginForm";
import styles from "../masuk/masuk.module.css";

export const metadata: Metadata = {
  title: "Login Staf",
  description: "Halaman login khusus staf.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className={styles.page}>
      <GlassPanel className={styles.card}>
        <h1 className={styles.title}>Login Staf</h1>
        <p className={styles.lead}>Halaman ini khusus untuk staf yang berwenang.</p>
        <LoginForm />
        <Link href="/" className={styles.back}>
          ← Kembali ke beranda
        </Link>
      </GlassPanel>
    </main>
  );
}
