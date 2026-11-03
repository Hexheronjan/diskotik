// High-energy Diskotik & Premium Nightclub Hero section with smooth slide animations.
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
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
            <span className={styles.eyebrow}>High-Energy Diskotik &amp; VIP Club</span>
            <span className={styles.equalizerMini}>
              <span className={styles.eqBar} style={{ animationDelay: "0s" }} />
              <span className={styles.eqBar} style={{ animationDelay: "0.2s" }} />
              <span className={styles.eqBar} style={{ animationDelay: "0.4s" }} />
            </span>
          </div>
        </Reveal>

        <Reveal direction="left" delay={220}>
          <h1 id="judul-hero" className={styles.title}>
            Dentuman Bass &amp; Pesta Diskotik Spektakuler di {siteName}.
          </h1>
        </Reveal>

        <Reveal direction="up" delay={340}>
          <p className={styles.tagline}>
            Destinasi hiburan malam dan lantai dansa paling bergengsi di Ponorogo, Jawa Timur. Rasakan
            hentakan musik DJ kelas dunia, pertunjukan laser lighting imersif, dan layanan sofa VIP
            eksklusif.
          </p>
        </Reveal>

        <Reveal direction="up" delay={450}>
          <div className={styles.actions}>
            <ButtonLink href="/acara" variant="primary" size="lg" icon="arrow">
              Jadwal Pesta Diskotik
            </ButtonLink>
            <ButtonLink href="/reservasi" variant="gold" size="lg" icon="crown">
              Reservasi Meja VIP
            </ButtonLink>
          </div>
        </Reveal>

        <Reveal direction="up" delay={550}>
          <div className={styles.highlights}>
            <div className={styles.highlightItem}>
              <Icon name="music" size={16} />
              <span>Arena Sound System</span>
            </div>
            <span className={styles.dot} />
            <div className={styles.highlightItem}>
              <Icon name="sparkle" size={16} />
              <span>Laser &amp; Strobe Show</span>
            </div>
            <span className={styles.dot} />
            <div className={styles.highlightItem}>
              <Icon name="crown" size={16} />
              <span>Dedicated Butler VIP</span>
            </div>
            <span className={styles.dot} />
            <div className={styles.highlightItem}>
              <Icon name="glass" size={16} />
              <span>Artisan Cocktails &amp; Mocktails</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
