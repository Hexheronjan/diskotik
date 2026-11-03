import type { Metadata } from "next";
import { VipCard } from "@/components/public/Cards";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { EmptyState, SectionHeading } from "@/components/ui/SectionHeading";
import { getVipPackages } from "@/lib/queries";
import styles from "@/components/public/Page.module.css";

export const metadata: Metadata = {
  title: "Paket Meja VIP & Sofa",
  description: "Pilihan sofa VIP eksklusif, butler privat, dan spot terbaik panggung diskotik Prajalinks.",
};

export default async function VipPage() {
  const packages = await getVipPackages();
  return (
    <div className="container">
      <Reveal direction="up" delay={50}>
        <div className={styles.pageHeader}>
          <SectionHeading as="h1" eyebrow="Eksklusif &amp; Prestisius" title="Paket Sofa &amp; Meja VIP" description="Nikmati privasi dan layanan khusus di tengah gemerlap suasana diskotik Prajalinks." />
        </div>
      </Reveal>
      {packages.length === 0 ? (
        <EmptyState title="Paket belum tersedia" message="Paket VIP akan segera diumumkan." />
      ) : (
        <div className={styles.grid3}>
          {packages.map((p, index) => {
            const direction = index % 3 === 0 ? "left" : index % 3 === 1 ? "up" : "right";
            const delay = 100 + (index % 3) * 120;
            return (
              <Reveal key={p.id} direction={direction} delay={delay}>
                <VipCard pkg={p} />
              </Reveal>
            );
          })}
        </div>
      )}
      <Reveal direction="up" delay={250}>
        <div style={{ marginTop: "var(--space-8)", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-3)" }}>
          <p className={styles.muted}>
            Ingin mengamankan sofa VIP pilihan Anda sekarang? Lakukan reservasi instan secara online atau hubungi concierge kami via WhatsApp.
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
            <ButtonLink href="/reservasi" variant="primary" size="lg" icon="crown">
              Mulai Reservasi Meja VIP
            </ButtonLink>
            <ButtonLink href="https://wa.me/6285151951806" external variant="gold" size="lg" icon="whatsapp">
              WhatsApp Concierge
            </ButtonLink>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
