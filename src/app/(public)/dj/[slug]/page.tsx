import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Icon } from "@/components/ui/Icon";
import { Media } from "@/components/ui/Media";
import { Reveal } from "@/components/ui/Reveal";
import { StatusBadge } from "@/components/ui/SectionHeading";
import { formatDateTime } from "@/lib/format";
import { getDjBySlug } from "@/lib/queries";
import styles from "@/components/public/Page.module.css";

type Props = { params: Promise<{ slug: string }> };

/** Keeps only https links so stored data can never inject other schemes. */
function httpsOnly(value: string | null): string | null {
  if (!value) return null;
  try {
    return new URL(value).protocol === "https:" ? value : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dj = await getDjBySlug(slug);
  if (!dj) return { title: "DJ tidak ditemukan" };
  return { title: dj.name, description: dj.biography.slice(0, 160) };
}

export default async function DjDetailPage({ params }: Props) {
  const { slug } = await params;
  const dj = await getDjBySlug(slug);
  if (!dj) notFound();

  const socials = [
    { href: httpsOnly(dj.instagram), label: "Instagram", icon: "instagram" as const },
    { href: httpsOnly(dj.spotify), label: "Spotify", icon: "spotify" as const },
  ].filter((s) => s.href);

  return (
    <div className="container">
      <div className={styles.pageHeader}>
        <Link href="/dj" className={`${styles.back} ${styles.muted}`}>
          ← Semua DJ
        </Link>
        <div className={styles.split}>
          <Reveal direction="left" delay={100}>
            <div className={styles.poster}>
              <Media src={dj.photoUrl} name={dj.name} ratio="1 / 1" />
            </div>
          </Reveal>
          <Reveal direction="right" delay={180}>
            <div className={styles.stack}>
              <h1 style={{ fontSize: "var(--text-h2)" }}>{dj.name}</h1>
              <p className={styles.fact}>
                <Icon name="music" size={22} />
                <span>{dj.genre}</span>
              </p>
              <p className={styles.prose}>{dj.biography}</p>
              {socials.length > 0 ? (
                <div className={styles.links}>
                  {socials.map((s) => (
                    <ButtonLink key={s.label} href={s.href as string} external icon={s.icon}>
                      {s.label}
                    </ButtonLink>
                  ))}
                </div>
              ) : null}
            </div>
          </Reveal>
        </div>
      </div>

      <section className={styles.pageSection} aria-labelledby="jadwal-dj">
        <Reveal direction="up" delay={100}>
          <GlassPanel>
            <h2 id="jadwal-dj" className={styles.subtitle}>
              Penampilan Mendatang
            </h2>
            {dj.events.length === 0 ? (
              <p className={styles.muted}>Belum ada penampilan terjadwal.</p>
            ) : (
              <ul className={styles.lineup}>
                {dj.events.map(({ event }) => (
                  <li key={event.slug}>
                    <Link href={`/acara/${event.slug}`} className={styles.lineupItem}>
                      <span style={{ flex: 1 }}>
                        <strong>{event.title}</strong>
                        <br />
                        <span className={styles.muted}>{formatDateTime(event.startsAt)}</span>
                      </span>
                      {event.status === "ONGOING" ? <StatusBadge tone="live">Berlangsung</StatusBadge> : null}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </GlassPanel>
        </Reveal>
      </section>
    </div>
  );
}
