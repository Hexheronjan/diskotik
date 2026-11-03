"use client";

// Error boundary: shown when the database or a render fails. Never leaks error details to visitors.
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <main style={{ minHeight: "100dvh", display: "grid", placeItems: "center", padding: 24, textAlign: "center" }}>
      <div style={{ display: "grid", gap: 16, justifyItems: "center" }}>
        <h1 style={{ fontSize: "var(--text-h2)" }}>Terjadi Kesalahan</h1>
        <p style={{ color: "var(--color-text-muted)" }}>Halaman tidak dapat dimuat saat ini. Silakan coba lagi.</p>
        <Button variant="primary" onClick={reset}>
          Coba Lagi
        </Button>
      </div>
    </main>
  );
}
