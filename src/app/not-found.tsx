import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main style={{ minHeight: "100dvh", display: "grid", placeItems: "center", padding: 24, textAlign: "center" }}>
      <div style={{ display: "grid", gap: 16, justifyItems: "center" }}>
        <h1 style={{ fontSize: "var(--text-h1)" }}>404</h1>
        <p style={{ color: "var(--color-text-muted)" }}>Halaman yang Anda cari tidak ditemukan.</p>
        <ButtonLink href="/" variant="primary">
          Kembali ke Beranda
        </ButtonLink>
      </div>
    </main>
  );
}
