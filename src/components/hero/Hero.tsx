// High-energy Diskotik & Premium Nightclub Hero section with smooth slide animations.
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { HeroBackdrop } from "./HeroBackdrop";
import styles from "./Hero.module.css";

export function Hero({ siteName }: { siteName: string }) {
  return (
    <section className={styles.hero} aria-labelledby="judul-hero">
      <HeroBackdrop />
      <div className={`container ${styles.content}`}>
        <Reveal direction="left" delay={100}>
          <div className={styles.pretitle}>
            <span className={styles.pulseDot} />
            <span className={styles.eyebrow}>Live Tonight • High-Energy Diskotik &amp; VIP Club</span>
            <span className={styles.equalizerMini} aria-hidden="true">
              <span className={styles.eqBar} style={{ animationDelay: "0s" }} />
              <span className={styles.eqBar} style={{ animationDelay: "0.2s" }} />
              <span className={styles.eqBar} style={{ animationDelay: "0.4s" }} />
            </span>
          </div>
        </Reveal>

        <Reveal direction="left" delay={220}>
          <h1 id="judul-hero" className={styles.title}>
            Diskotik &amp; VIP Lounge Paling Bergengsi di{" "}
            <span className={styles.titleAccent}>{siteName} Ponorogo</span>.
          </h1>
        </Reveal>

        <Reveal direction="up" delay={340}>
          <p className={styles.tagline}>
            Pusat hiburan malam spektakuler di Ponorogo, Jawa Timur. Rasakan dentuman tata suara
            arena 50.000 Watt, pertunjukan laser moving beam berstandar konser, kurasi resident DJ
            terbaik, serta kemewahan sofa privat dengan layanan VIP butler.
          </p>
        </Reveal>

        <Reveal direction="up" delay={450}>
          <div className={styles.actions}>
            <ButtonLink href="/reservasi" variant="primary" size="lg" icon="crown">
              Reservasi Meja VIP
            </ButtonLink>
            <ButtonLink href="/acara" variant="gold" size="lg" icon="arrow">
              Jadwal Pesta &amp; DJ
            </ButtonLink>
          </div>
        </Reveal>

        <Reveal direction="up" delay={550}>
          <div className={styles.statsRibbon}>
            <div className={styles.statMetric}>
              <span className={styles.statNumber}>50.000W</span>
              <span className={styles.statLabel}>Sound Arena</span>
            </div>
            <span className={styles.statDivider} />
            <div className={styles.statMetric}>
              <span className={styles.statNumber}>12+ VIP</span>
              <span className={styles.statLabel}>Sofa Suites</span>
            </div>
            <span className={styles.statDivider} />
            <div className={styles.statMetric}>
              <span className={styles.statNumber}>Top DJ</span>
              <span className={styles.statLabel}>Resident &amp; Guest</span>
            </div>
            <span className={styles.statDivider} />
            <div className={styles.statMetric}>
              <span className={styles.statNumber}>18:00 - 03:00</span>
              <span className={styles.statLabel}>Buka Tiap Malam</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
