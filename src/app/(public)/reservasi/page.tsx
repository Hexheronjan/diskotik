import type { Metadata } from "next";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getSettings, getVipPackages } from "@/lib/queries";
import { ReservationForm } from "./ReservationForm";
import styles from "./reservasi.module.css";

export const metadata: Metadata = {
  title: "Reservasi Meja VIP & Tiket Diskotik",
  description:
    "Reservasi sofa VIP, perjamuan suite privat, dan meja diskotik Prajalinks Ponorogo. Layanan concierge dan butler pribadi 24/7.",
};

export default async function ReservasiPage({
  searchParams,
}: {
  searchParams: Promise<{ paket?: string }>;
}) {
  const { paket } = await searchParams;
  const [settings, packages] = await Promise.all([getSettings(), getVipPackages()]);

  const packageOptions = packages.map((p) => ({
    slug: p.slug,
    name: p.name,
    maxCapacity: p.maxCapacity,
    price: p.price,
  }));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Reveal direction="up" delay={50}>
          <SectionHeading
            as="h1"
            eyebrow="VIP Concierge &amp; Booking"
            title="Reservasi Meja &amp; Sofa VIP"
            description="Amankan tempat duduk terbaik Anda di lantai dansa atau lounge mezanin privat Prajalinks Ponorogo. Tim concierge kami siap menyambut perayaan malam istimewa Anda."
          />
        </Reveal>
      </div>

      <div className={styles.grid}>
        <Reveal direction="left" delay={100}>
          <ReservationForm packages={packageOptions} defaultPackageSlug={paket} />
        </Reveal>

        <Reveal direction="right" delay={180}>
          <aside className={styles.sidebar}>
            <div className={styles.perksCard}>
              <h2 className={styles.perksTitle}>
                <Icon name="crown" size={22} style={{ color: "var(--color-gold)" }} />
                <span>Keuntungan Reservasi VIP</span>
              </h2>

              <ul className={styles.perksList}>
                <li className={styles.perkItem}>
                  <Icon name="check" size={18} />
                  <span>
                    <strong>Priority Fast-Track Entry:</strong> Masuk langsung tanpa antre di pintu utama klub.
                  </span>
                </li>
                <li className={styles.perkItem}>
                  <Icon name="check" size={18} />
                  <span>
                    <strong>Dedicated Host &amp; Butler:</strong> Pelayan pribadi yang siaga melayani pesanan Anda sepanjang pesta.
                  </span>
                </li>
                <li className={styles.perkItem}>
                  <Icon name="check" size={18} />
                  <span>
                    <strong>Complimentary Bottles &amp; Platter:</strong> Botol minuman sparkling artisan &amp; sajian finger food gourmet.
                  </span>
                </li>
                <li className={styles.perkItem}>
                  <Icon name="check" size={18} />
                  <span>
                    <strong>Prime Stage Sightline:</strong> Sudut pandang terbaik menghadap ke panggung DJ dan sorotan laser spektakuler.
                  </span>
                </li>
                <li className={styles.perkItem}>
                  <Icon name="check" size={18} />
                  <span>
                    <strong>Free Valet Parking:</strong> Layanan parkir valet aman di area parkir privat klub.
                  </span>
                </li>
              </ul>

              <div className={styles.hotlineBox}>
                <span className={styles.hotlineTitle}>Butuh Bantuan Langsung?</span>
                <span className={styles.hotlinePhone}>0851-5195-1806</span>
                <span style={{ fontSize: "0.8125rem", color: "var(--color-muted)" }}>
                  Hubungi staf concierge kami melalui WhatsApp untuk konsultasi pemilihan meja &amp; permintaan khusus.
                </span>
                <a
                  href={settings.whatsappLink || "https://wa.me/6285151951806"}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "#25d366",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    marginTop: "4px",
                  }}
                >
                  <Icon name="whatsapp" size={16} />
                  <span>Chat WhatsApp Sekarang ↗</span>
                </a>
              </div>
            </div>
          </aside>
        </Reveal>
      </div>
    </div>
  );
}
