import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EventStatusBadge } from "@/components/public/Cards";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Icon } from "@/components/ui/Icon";
import { Media } from "@/components/ui/Media";
import { Reveal } from "@/components/ui/Reveal";
import { EmptyState } from "@/components/ui/SectionHeading";
import { formatDate, formatDateTime, formatRupiah, formatTime } from "@/lib/format";
import { getEventBySlug } from "@/lib/queries";
import styles from "@/components/public/Page.module.css";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: "Acara tidak ditemukan" };
  return { title: event.title, description: event.description.slice(0, 160) };
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const lineup = event.djs.map((d) => d.dj).filter((d) => d.isActive);

  return (
    <div className="container">
      <div className={styles.pageHeader}>
        <Link href="/acara" className={`${styles.back} ${styles.muted}`}>
          ← Semua acara
        </Link>
        <div className={styles.split}>
          <Reveal direction="left" delay={100}>
            <div className={styles.poster}>
              <Media src={event.posterUrl} name={event.title} ratio="4 / 5" />
            </div>
          </Reveal>
          <Reveal direction="right" delay={180}>
            <div className={styles.stack}>
              <div>
                <EventStatusBadge status={event.status} />
              </div>
              <h1 style={{ fontSize: "var(--text-h2)" }}>{event.title}</h1>
              <ul className={styles.facts}>
                <li className={styles.fact}>
                  <Icon name="calendar" size={22} />
                  <span>
                    <strong>{formatDate(event.startsAt)}</strong>
                  </span>
                </li>
                <li className={styles.fact}>
                  <Icon name="clock" size={22} />
                  <span>
                    {formatTime(event.startsAt)}
                    {event.endsAt ? ` — selesai ${formatDateTime(event.endsAt)}` : ""}
                  </span>
                </li>
                {event.guestStars ? (
                  <li className={styles.fact}>
                    <Icon name="star" size={22} />
                    <span>{event.guestStars}</span>
                  </li>
                ) : null}
              </ul>
              <p className={styles.prose}>{event.description}</p>
            </div>
          </Reveal>
        </div>
      </div>

      <section className={styles.pageSection} aria-labelledby="lineup">
        <Reveal direction="up" delay={100}>
          <GlassPanel>
            <h2 id="lineup" className={styles.subtitle}>
              Lineup DJ
            </h2>
            {lineup.length === 0 ? (
              <p className={styles.muted}>Lineup akan segera diumumkan.</p>
            ) : (
              <ul className={styles.lineup}>
                {lineup.map((dj) => (
                  <li key={dj.slug}>
                    <Link href={`/dj/${dj.slug}`} className={styles.lineupItem}>
                      <span className={styles.lineupThumb}>
                        <Media src={dj.photoUrl} name={dj.name} ratio="1 / 1" />
                      </span>
                      <span>
                        <strong>{dj.name}</strong>
                        <br />
                        <span className={styles.muted}>{dj.genre}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </GlassPanel>
        </Reveal>
      </section>

      <section className={styles.pageSection} aria-labelledby="harga-tiket">
        <Reveal direction="up" delay={150}>
          <GlassPanel>
            <h2 id="harga-tiket" className={styles.subtitle}>
              Harga Tiket
            </h2>
            {event.tickets.length === 0 ? (
              <EmptyState title="Harga belum tersedia" message="Informasi harga tiket akan diumumkan." />
            ) : (
              <div>
                {event.tickets.map((t) => (
                  <div key={t.id} className={styles.priceRow}>
                    <span>{t.name}</span>
                    <strong>{formatRupiah(t.price)}</strong>
                  </div>
                ))}
                <div style={{ marginTop: "var(--space-4)", display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                  <Link href="/reservasi" className={styles.chip} style={{ background: "var(--color-burgundy)", borderColor: "var(--color-burgundy)", color: "#fff", fontWeight: 600 }}>
                    <span>Reservasi Meja VIP untuk Acara Ini</span>
                  </Link>
                  <a
                    href={`https://wa.me/6285151951806?text=${encodeURIComponent(`Halo Prajalinks Ponorogo, saya ingin memesan tiket untuk acara ${event.title}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.chip}
                    style={{ background: "rgba(37, 211, 102, 0.15)", borderColor: "rgba(37, 211, 102, 0.4)", color: "#25d366", fontWeight: 600 }}
                  >
                    <span>Pesan via WhatsApp (0851-5195-1806)</span>
                  </a>
                </div>
              </div>
            )}
          </GlassPanel>
        </Reveal>
      </section>
    </div>
  );
}
