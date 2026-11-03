import type { Metadata } from "next";
import { OpeningHours } from "@/components/public/Sections";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Icon } from "@/components/ui/Icon";
import { Media } from "@/components/ui/Media";
import { Reveal } from "@/components/ui/Reveal";
import { EmptyState, SectionHeading } from "@/components/ui/SectionHeading";
import { getGalleryPreview, getSettings } from "@/lib/queries";
import styles from "@/components/public/Page.module.css";

export const metadata: Metadata = {
  title: "Tentang Prajalinks Diskotik",
  description: "Kenali sejarah, konsep diskotik kelas dunia, dan fasilitas lengkap Prajalinks Jakarta.",
};

export default async function AboutPage() {
  const [settings, gallery] = await Promise.all([getSettings(), getGalleryPreview()]);

  return (
    <div className="container">
      <Reveal direction="up" delay={50}>
        <div className={styles.pageHeader}>
          <SectionHeading as="h1" eyebrow="Mengenal Kami" title="Tentang Prajalinks" description={settings.aboutIntro} />
        </div>
      </Reveal>

      <section className={styles.split} aria-label="Sejarah dan konsep">
        <Reveal direction="left" delay={100}>
          <GlassPanel>
            <h2 className={styles.subtitle}>Sejarah Kami</h2>
            <p className={styles.prose}>{settings.aboutHistory}</p>
          </GlassPanel>
        </Reveal>
        <Reveal direction="right" delay={180}>
          <GlassPanel>
            <h2 className={styles.subtitle}>Konsep Diskotik</h2>
            <p className={styles.prose}>{settings.aboutConcept}</p>
          </GlassPanel>
        </Reveal>
      </section>

      <section className={styles.section}>
        <Reveal direction="up" delay={50}>
          <SectionHeading eyebrow="Kenyamanan &amp; Kemewahan" title="Fasilitas Unggulan" />
        </Reveal>
        {settings.facilities.length === 0 ? (
          <EmptyState title="Fasilitas belum tersedia" message="Daftar fasilitas akan ditampilkan di sini." />
        ) : (
          <ul className={styles.grid3}>
            {settings.facilities.map((f, index) => {
              const direction = index % 3 === 0 ? "left" : index % 3 === 1 ? "up" : "right";
              const delay = 80 + (index % 3) * 100;
              return (
                <Reveal key={f} as="li" direction={direction} delay={delay}>
                  <GlassPanel className={styles.fact}>
                    <Icon name="sparkle" size={22} />
                    <span>{f}</span>
                  </GlassPanel>
                </Reveal>
              );
            })}
          </ul>
        )}
      </section>

      <section className={styles.split} style={{ paddingTop: "var(--space-16)" }}>
        <Reveal direction="left" delay={100}>
          <div>
            <SectionHeading eyebrow="Waktu pesta dansa" title="Jam Operasional" />
            <OpeningHours settings={settings} />
          </div>
        </Reveal>
      </section>

      <section className={styles.section} aria-labelledby="foto-tempat">
        <Reveal direction="up" delay={50}>
          <SectionHeading eyebrow="Atmosfer Diskotik" title="Suasana &amp; Panggung" />
        </Reveal>
        <h2 id="foto-tempat" className="sr-only">
          Foto tempat
        </h2>
        {gallery.length === 0 ? (
          <EmptyState title="Belum ada foto" message="Foto suasana tempat kami akan segera ditambahkan." />
        ) : (
          <ul className={styles.grid3}>
            {gallery.map((g, index) => {
              const direction = index % 3 === 0 ? "left" : index % 3 === 1 ? "up" : "right";
              const delay = 80 + (index % 3) * 100;
              return (
                <Reveal key={g.id} as="li" direction={direction} delay={delay}>
                  <Media src={g.imageUrl} name={g.title} ratio="4 / 3" />
                </Reveal>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
