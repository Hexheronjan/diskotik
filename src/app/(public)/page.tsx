import { Hero } from "@/components/hero/Hero";
import { DjCard, EventCard, FeaturedEventCard } from "@/components/public/Cards";
import { Location, OpeningHours } from "@/components/public/Sections";
import { ButtonLink } from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Reveal } from "@/components/ui/Reveal";
import { EmptyState, SectionHeading } from "@/components/ui/SectionHeading";
import { getDjs, getSettings, getUpcomingPreview } from "@/lib/queries";
import styles from "@/components/public/Page.module.css";

export default async function HomePage() {
  const [settings, events, djs] = await Promise.all([getSettings(), getUpcomingPreview(3), getDjs(3)]);

  const [headliner, ...otherEvents] = events;

  return (
    <>
      <Hero siteName={settings.siteName} />

      {/* Section: Selamat Datang di Diskotik Prajalinks Ponorogo & Jam Buka */}
      <section className={`container ${styles.section}`} aria-labelledby="tentang-singkat">
        <div className={styles.split}>
          <Reveal direction="left" delay={100}>
            <div className={styles.stack}>
              <SectionHeading eyebrow="Sensasi Diskotik Ponorogo" title={`Malam Pesta Tanpa Batas di ${settings.siteName}`} />
              <div className={styles.prose} id="tentang-singkat">
                <p>{settings.aboutIntro}</p>
              </div>
              <div>
                <ButtonLink href="/tentang-kami" icon="arrow">
                  Kenali Kami Lebih Dek
                </ButtonLink>
              </div>
            </div>
          </Reveal>

          <Reveal direction="right" delay={200}>
            <OpeningHours settings={settings} />
          </Reveal>
        </div>
      </section>

      {/* Section: Jadwal Pesta Diskotik / Acara Spektakuler Mendatang (Tata Letak Unik: Headline + Lineup) */}
      <section className={`container ${styles.section}`} aria-labelledby="acara-mendatang">
        <Reveal direction="up" delay={50}>
          <SectionHeading
            eyebrow="Jadwal Pesta Diskotik"
            title="Acara Spektakuler Mendatang"
            description="Deretan pesta dansa terbaik dengan DJ papan atas dan visual laser panggung spektakuler di Ponorogo."
            action={
              <ButtonLink href="/acara" variant="ghost" icon="arrow">
                Semua acara
              </ButtonLink>
            }
          />
        </Reveal>
        <h2 id="acara-mendatang" className="sr-only">
          Daftar acara mendatang
        </h2>
        {events.length === 0 ? (
          <EmptyState title="Belum ada acara" message="Acara berikutnya akan segera diumumkan." />
        ) : (
          <div>
            {/* Headline Showcase Card */}
            {headliner ? (
              <Reveal direction="up" delay={100}>
                <FeaturedEventCard event={headliner} />
              </Reveal>
            ) : null}

            {/* Next Up Events Row */}
            {otherEvents.length > 0 ? (
              <div className={styles.grid2} style={{ marginTop: "var(--space-6)" }}>
                {otherEvents.map((e, index) => {
                  const direction = index === 0 ? "left" : "right";
                  const delay = 150 + index * 120;
                  return (
                    <Reveal key={e.id} direction={direction} delay={delay}>
                      <EventCard event={e} />
                    </Reveal>
                  );
                })}
              </div>
            ) : null}
          </div>
        )}
      </section>

      {/* Section: Resonansi Irama & DJ (Tata Letak Unik: DJ Console & Deck Roster) */}
      <section className={`container ${styles.section}`}>
        <Reveal direction="up" delay={50}>
          <SectionHeading
            eyebrow="Resonansi Irama & DJ"
            title="Resident &amp; Guest DJ Unggulan"
            description="Para maestro audio dan penguasa panggung yang memacu detak lantai dansa Prajalinks Ponorogo."
            action={
              <ButtonLink href="/dj" variant="ghost" icon="arrow">
                Semua DJ
              </ButtonLink>
            }
          />
        </Reveal>
        {djs.length === 0 ? (
          <EmptyState title="Belum ada DJ" message="Profil DJ akan ditampilkan di sini." />
        ) : (
          <div className={styles.grid3}>
            {djs.map((dj, index) => {
              const direction = index === 0 ? "left" : index === 1 ? "up" : "right";
              const delay = 100 + index * 120;
              return (
                <Reveal key={dj.id} direction={direction} delay={delay}>
                  <DjCard dj={dj} />
                </Reveal>
              );
            })}
          </div>
        )}
      </section>

      {/* Section: VIP Lounge CTA Banner */}
      <section className={`container ${styles.section}`}>
        <Reveal direction="up" delay={150}>
          <GlassPanel>
            <div className={styles.cta}>
              <div className={styles.ctaBadge}>
                <span>VIP &amp; VVIP Experience</span>
              </div>
              <h2 className={styles.ctaTitle}>Kemewahan Sofa VIP di Tengah Euforia Diskotik Ponorogo</h2>
              <p className={styles.ctaText}>
                Nikmati kenyamanan meja sofa privat dengan pemandangan terbaik ke panggung DJ, botol minuman premium pendamping,
                dan layanan butler pribadi eksklusif untuk malam istimewa Anda.
              </p>
              <ButtonLink href="/reservasi" variant="primary" size="lg" icon="crown">
                Reservasi Meja VIP Sekarang
              </ButtonLink>
            </div>
          </GlassPanel>
        </Reveal>
      </section>

      {/* Section: Kunjungi Diskotik Kami / Lokasi & Akses Mudah (Ponorogo Hub + WhatsApp + Instagram) */}
      <section className={`container ${styles.section}`}>
        <Reveal direction="up" delay={50}>
          <SectionHeading
            eyebrow="Kunjungi Diskotik Kami"
            title="Lokasi &amp; Akses Mudah"
            description="Temukan kami di pusat kota Ponorogo, Jawa Timur. Hubungi WhatsApp atau kunjungi Instagram resmi kami untuk update jadwal pesta dan reservasi."
          />
        </Reveal>
        <Location settings={settings} />
      </section>
    </>
  );
}
