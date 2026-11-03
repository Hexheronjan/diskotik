import { Hero } from "@/components/hero/Hero";
import { DjCard, EventCard, FeaturedEventCard, VipCard } from "@/components/public/Cards";
import { Location, OpeningHours } from "@/components/public/Sections";
import { ButtonLink } from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Reveal } from "@/components/ui/Reveal";
import { EmptyState, SectionHeading } from "@/components/ui/SectionHeading";
import { getDjs, getSettings, getUpcomingPreview, getVipPackages } from "@/lib/queries";
import styles from "@/components/public/Page.module.css";

export default async function HomePage() {
  const [settings, events, djs, vipPackages] = await Promise.all([
    getSettings(),
    getUpcomingPreview(3),
    getDjs(3),
    getVipPackages(),
  ]);

  const [headliner, ...otherEvents] = events;

  return (
    <>
      <Hero siteName={settings.siteName} />

      {/* Section: The Signature Diskotik Experience */}
      <section className={`container ${styles.section}`} aria-labelledby="tentang-singkat">
        <Reveal direction="up" delay={80}>
          <div className={styles.experienceHeader}>
            <div className={styles.eyebrowBadge}>
              <span className={styles.liveDot} />
              <span>THE PREMIER NIGHTLIFE DESTINATION</span>
            </div>
            <h2 id="tentang-singkat" className={styles.experienceTitle}>
              Sensasi Pesta Diskotik &amp; Kemewahan VIP di Ponorogo
            </h2>
            <p className={styles.experienceSubtitle}>
              {settings.aboutIntro ||
                "Prajalinks menghadirkan standar baru hiburan malam kelas atas di Jawa Timur. Panggung audio visual spektakuler, tata suara arena 50.000W, kurasi resident DJ terbaik, serta kenyamanan sofa VVIP eksklusif."}
            </p>
          </div>
        </Reveal>

        {/* 4 Visual Experience Pillar Cards */}
        <div className={styles.experienceGrid}>
          <Reveal direction="left" delay={120}>
            <div className={styles.pillarCard}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=700&q=80"
                alt="50.000W Arena Sound System"
                className={styles.pillarImg}
              />
              <div className={styles.pillarOverlay} />
              <div className={styles.pillarContent}>
                <span className={styles.pillarBadge}>Tata Suara Arena</span>
                <h3 className={styles.pillarTitle}>50.000W Sound System</h3>
                <p className={styles.pillarDesc}>
                  Line-array audio system kelas konser dengan dentuman bass berfrekuensi rendah yang memacu lantai dansa.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal direction="left" delay={200}>
            <div className={styles.pillarCard}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=700&q=80"
                alt="Smart Moving Laser Light Show"
                className={styles.pillarImg}
              />
              <div className={styles.pillarOverlay} />
              <div className={styles.pillarContent}>
                <span className={styles.pillarBadge}>Visual &amp; Lighting</span>
                <h3 className={styles.pillarTitle}>Smart Moving Lasers</h3>
                <p className={styles.pillarDesc}>
                  Atraksi beam laser panggung bergerak dan haze effects spektakuler yang sinkron dengan alunan musik.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal direction="right" delay={280}>
            <div className={styles.pillarCard}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=700&q=80"
                alt="Exclusive VIP Sofa Suites"
                className={styles.pillarImg}
              />
              <div className={styles.pillarOverlay} />
              <div className={styles.pillarContent}>
                <span className={styles.pillarBadge}>VIP &amp; VVIP Lounge</span>
                <h3 className={styles.pillarTitle}>Private Butler Service</h3>
                <p className={styles.pillarDesc}>
                  Kenyamanan sofa privat dengan pemandangan langsung ke panggung DJ, botol minuman premium, dan personal host.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal direction="right" delay={360}>
            <div className={styles.pillarCard}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=700&q=80"
                alt="Craft Mixology & Bites"
                className={styles.pillarImg}
              />
              <div className={styles.pillarOverlay} />
              <div className={styles.pillarContent}>
                <span className={styles.pillarBadge}>Bar &amp; Kitchen</span>
                <h3 className={styles.pillarTitle}>Craft Mixology &amp; Bites</h3>
                <p className={styles.pillarDesc}>
                  Kurasi mocktail segar, sajian tapas istimewa, dan ragam signature drinks racikan bartender profesional.
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Operating Hours & Fast Action Console */}
        <Reveal direction="up" delay={250}>
          <div style={{ marginTop: "var(--space-8)" }}>
            <OpeningHours settings={settings} />
          </div>
        </Reveal>
      </section>

      {/* Section: Jadwal Pesta Diskotik / Acara Spektakuler Mendatang */}
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

      {/* Section: Resonansi Irama & DJ */}
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

      {/* Section: Paket VIP Showcase */}
      {vipPackages.length > 0 ? (
        <section className={`container ${styles.section}`}>
          <Reveal direction="up" delay={50}>
            <SectionHeading
              eyebrow="Pengalaman VIP Eksklusif"
              title="Paket Meja Sofa &amp; Lounge VIP"
              description="Pilih zona sofa privat favorit Anda dengan sudut pandang terbaik ke panggung DJ, fasilitas butler, dan minuman premium."
              action={
                <ButtonLink href="/vip" variant="ghost" icon="arrow">
                  Semua paket VIP
                </ButtonLink>
              }
            />
          </Reveal>
          <div className={styles.grid3}>
            {vipPackages.slice(0, 3).map((pkg, index) => {
              const direction = index === 0 ? "left" : index === 1 ? "up" : "right";
              const delay = 100 + index * 120;
              return (
                <Reveal key={pkg.id} direction={direction} delay={delay}>
                  <VipCard pkg={pkg} />
                </Reveal>
              );
            })}
          </div>
        </section>
      ) : null}

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

      {/* Section: Kunjungi Diskotik Kami (Strictly Maps, WA, IG) */}
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
