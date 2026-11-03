import type { Metadata, Viewport } from "next";
import { Orbitron, Poppins } from "next/font/google";
import "./globals.css";

// Orbitron: logo and headings only.
const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["500", "700", "900"],
  display: "swap",
  variable: "--font-orbitron",
  fallback: ["Eurostile", "Segoe UI", "system-ui", "sans-serif"],
});

// Poppins: all other text.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
  fallback: ["Segoe UI", "system-ui", "-apple-system", "Roboto", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Prajalinks — Diskotik & Klub Malam Ponorogo",
    template: "%s | Prajalinks Diskotik",
  },
  description:
    "Nikmati pesta malam spektakuler bersama DJ papan atas, lighting laser arena, paket sofa VIP, serta atmosfer diskotik terbaik di Prajalinks Ponorogo, Jawa Timur.",
  openGraph: {
    type: "website",
    locale: "id_ID",
    title: "Prajalinks — Diskotik & Klub Malam Ponorogo",
    description: "Jadwal acara, DJ unggulan, menu, dan paket VIP untuk malam pesta spektakuler di Prajalinks Ponorogo.",
  },
};

export const viewport: Viewport = {
  themeColor: "#080711",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" data-scroll-behavior="smooth" className={`${orbitron.variable} ${poppins.variable}`}>
      <body>{children}</body>
    </html>
  );
}
