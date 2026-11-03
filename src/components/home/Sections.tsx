// Homepage showpiece sections: ticker marquee, animated stats, gallery mosaic and cinematic CTA.
import { ButtonLink } from "@/components/ui/Button";
import { ClubImage } from "@/components/ui/ClubImage";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "./CountUp";
import styles from "./Home.module.css";

const MARQUEE_ITEMS = [
  "Live DJ Set",
  "VIP Lounge",
  "50.000W Sound",
  "Laser Show",
  "Craft Cocktails",
  "Ponorogo After Dark",
];

export function Marquee() {
  const row = (hidden: boolean) => (
    <div className={styles.marqueeRow} aria-hidden={hidden || undefined}>
      {MARQUEE_ITEMS.map((item) => (
        <span key={item} className={styles.marqueeItem}>
          {item}
          <span className={styles.marqueeDiamond} />
        </span>
      ))}
    </div>
  );

  return (
    <div className={styles.marquee} role="presentation">
      <div className={styles.marqueeTrack}>
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

const STATS: { value: number; suffix: string; label: string }[] = [
  { value: 50000, suffix: "W", label: "Tata Suara Arena" },
  { value: 12, suffix: "", label: "Sofa Suite VIP" },
  { value: 500, suffix: "+", label: "Kapasitas Tamu" },
  { value: 7, suffix: "", label: "Malam Buka Tiap Pekan" },
];

export function StatsBand() {
  return (
    <section className={`container ${styles.statsSection}`} aria-label="Angka-angka Prajalinks">
      <div className={styles.statsBand}>
        {STATS.map((s, i) => (
          <Reveal key={s.label} direction="up" delay={i * 90}>
            <div className={styles.stat}>
              <span className={styles.statValue}>
                <CountUp value={s.value} suffix={s.suffix} />
              </span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export interface MosaicItem {
  id: number;
  title: string;
  imageUrl: string;
}

export function GalleryMosaic({ items }: { items: MosaicItem[] }) {
  if (items.length === 0) return null;
  return (
    <div className={styles.mosaic}>
      {items.slice(0, 6).map((item, i) => (
        <Reveal key={item.id} direction={i % 2 === 0 ? "left" : "right"} delay={60 + i * 70} className={styles.mosaicCell}>
          <figure className={styles.mosaicItem}>
            <ClubImage src={item.imageUrl} alt={item.title} loading="lazy" className={styles.mosaicImg} />
            <div className={styles.mosaicShade} />
            <figcaption className={styles.mosaicCaption}>
              <span className={styles.mosaicIndex}>{String(i + 1).padStart(2, "0")}</span>
              <span className={styles.mosaicTitle}>{item.title}</span>
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </div>
  );
}

export function CtaBanner() {
  return (
    <Reveal direction="up" delay={100}>
      <div className={styles.cta}>
        <ClubImage
          src="https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=2000&q=80"
          alt=""
          className={styles.ctaImg}
          loading="lazy"
        />
        <div className={styles.ctaShade} />
        <div className={styles.ctaBody}>
          <span className={styles.ctaEyebrow}>VIP &amp; VVIP Experience</span>
          <h2 className={styles.ctaTitle}>Amankan Meja Sofa Terbaik Malam Ini</h2>
          <p className={styles.ctaText}>
            Pemandangan langsung ke panggung DJ, botol minuman premium pendamping, dan layanan butler pribadi
            untuk malam yang tak terlupakan.
          </p>
          <div className={styles.ctaActions}>
            <ButtonLink href="/reservasi" variant="primary" size="lg" icon="crown">
              Reservasi Meja VIP
            </ButtonLink>
            <ButtonLink
              href="https://wa.me/6285151951806?text=Halo%20Prajalinks,%20saya%20ingin%20reservasi%20meja%20VIP"
              variant="gold"
              size="lg"
              external
            >
              <Icon name="whatsapp" size={16} />
              0851-5195-1806
            </ButtonLink>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
