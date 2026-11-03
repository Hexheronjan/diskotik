// Shared layout for all public pages: skip link, navbar, footer, floating WhatsApp button.
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { Preloader } from "@/components/ui/Preloader";
import { getSettings } from "@/lib/queries";

// Content comes from the database, so these pages are rendered per request.
export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <>
      <Preloader />
      <a href="#konten" className="skip-link">
        Lewati ke konten utama
      </a>
      <Navbar siteName={settings.siteName} />
      <main id="konten">{children}</main>
      <Footer settings={settings} />
      <WhatsAppButton link={settings.whatsappLink} siteName={settings.siteName} />
    </>
  );
}
