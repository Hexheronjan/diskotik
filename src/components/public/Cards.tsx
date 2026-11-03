// Public cards for events, DJs, menu items and VIP packages.
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Media } from "@/components/ui/Media";
import { StatusBadge } from "@/components/ui/SectionHeading";
import { formatDay, formatMonth, formatRupiah, formatTime } from "@/lib/format";
import styles from "./Cards.module.css";

type EventStatus = "UPCOMING" | "ONGOING" | "COMPLETED";

export function EventStatusBadge({ status }: { status: EventStatus }) {
  if (status === "ONGOING") return <StatusBadge tone="live">Sedang berlangsung</StatusBadge>;
  if (status === "UPCOMING") return <StatusBadge tone="soon">Akan datang</StatusBadge>;
  return <StatusBadge tone="done">Selesai</StatusBadge>;
}

export interface CardEventItem {
  slug: string;
  title: string;
  posterUrl: string | null;
  startsAt: Date;
  status: EventStatus;
  guestStars: string | null;
  description?: string | null;
  endsAt?: Date | null;
  tickets?: { price: number }[];
  djs?: { dj: { name: string; photoUrl: string | null; slug?: string } }[];
}

/** Featured Headline Event Card (Widescreen Showcase) */
export function FeaturedEventCard({ event }: { event: CardEventItem }) {
  const minPrice = event.tickets && event.tickets.length > 0 ? event.tickets[0].price : null;

  return (
    <article className={styles.featuredCard}>
      <div className={styles.featuredPosterWrap}>
        <Media src={event.posterUrl} name={event.title} ratio="16 / 10" />
        <div className={styles.dateChip} aria-hidden="true">
          <span className={styles.day}>{formatDay(event.startsAt)}</span>
          <span className={styles.month}>{formatMonth(event.startsAt)}</span>
        </div>
      </div>

      <div className={styles.featuredContent}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <span className={styles.stageBadge}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff2a6d", boxShadow: "0 0 8px #ff2a6d" }} />
            Headliner Party
          </span>
          <EventStatusBadge status={event.status} />
        </div>

        <h3 className={styles.featuredTitle}>
          <Link href={`/acara/${event.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
            {event.title}
          </Link>
        </h3>

        {event.description ? <p className={styles.featuredDesc}>{event.description}</p> : null}

        <div className={styles.featuredMetaRow}>
          <p className={styles.meta}>
            <Icon name="clock" size={16} /> {formatTime(event.startsAt)}
            {event.endsAt ? ` - ${formatTime(event.endsAt)} WIB` : " WIB - Selesai"}
          </p>
          {minPrice ? (
            <span className={styles.ticketChip}>
              <Icon name="ticket" size={14} /> Mulai {formatRupiah(minPrice)}
            </span>
          ) : null}
        </div>

        {event.djs && event.djs.length > 0 ? (
          <div className={styles.djsLineupWrap}>
            <span style={{ fontSize: "0.8rem", color: "var(--color-muted)", fontWeight: 500 }}>Lineup:</span>
            {event.djs.map((d) => (
              <span key={d.dj.name} className={styles.djChip}>
                {d.dj.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={d.dj.photoUrl} alt="" className={styles.djChipAvatar} />
                ) : (
                  <Icon name="music" size={12} />
                )}
                <span>{d.dj.name}</span>
              </span>
            ))}
          </div>
        ) : event.guestStars ? (
          <p className={styles.meta}>
            <Icon name="star" size={16} /> {event.guestStars}
          </p>
        ) : null}

        <div style={{ marginTop: "var(--space-2)" }}>
          <Link href={`/acara/${event.slug}`} className={styles.djProfileBtn}>
            <span>Detail Acara &amp; Tiket</span>
            <Icon name="arrow" size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}

/** Standard Event Card with diskotik enhancements */
export function EventCard({ event }: { event: CardEventItem }) {
  const minPrice = event.tickets && event.tickets.length > 0 ? event.tickets[0].price : null;

  return (
    <article className={styles.card}>
      <Link href={`/acara/${event.slug}`} className={styles.cardLink} aria-label={`${event.title}, lihat detail acara`}>
        <div className={styles.mediaWrap}>
          <Media src={event.posterUrl} name={event.title} ratio="4 / 5" />
          <div className={styles.dateChip} aria-hidden="true">
            <span className={styles.day}>{formatDay(event.startsAt)}</span>
            <span className={styles.month}>{formatMonth(event.startsAt)}</span>
          </div>
        </div>
        <div className={styles.body}>
          <EventStatusBadge status={event.status} />
          <h3 className={styles.title}>{event.title}</h3>
          <p className={styles.meta}>
            <Icon name="clock" size={16} /> {formatTime(event.startsAt)} WIB
          </p>
          {event.guestStars ? <p className={styles.meta}>{event.guestStars}</p> : null}
          {minPrice ? (
            <div style={{ marginTop: "auto", paddingTop: "var(--space-2)" }}>
              <span className={styles.ticketChip}>
                <Icon name="ticket" size={14} /> Mulai {formatRupiah(minPrice)}
              </span>
            </div>
          ) : null}
        </div>
      </Link>
    </article>
  );
}

export interface CardDjItem {
  slug: string;
  name: string;
  genre: string;
  photoUrl: string | null;
  biography?: string | null;
  instagram?: string | null;
  spotify?: string | null;
}

/** Unique DJ Console Deck Card */
export function DjCard({ dj }: { dj: CardDjItem }) {
  const isResident = dj.slug.includes("kobra") || dj.slug.includes("aurora");
  const bioExcerpt = dj.biography
    ? dj.biography.length > 95
      ? `${dj.biography.slice(0, 95)}...`
      : dj.biography
    : "Maestro panggung yang mengalirkan energi tak terbatas di lantai dansa Prajalinks.";

  return (
    <article className={styles.djDeckCard}>
      <div className={styles.djAvatarFrame}>
        <div className={styles.djVinylHalo} aria-hidden="true" />
        {dj.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={dj.photoUrl} alt={dj.name} className={styles.djAvatarImg} />
        ) : (
          <div className={styles.djAvatarImg} style={{ background: "#221c2e" }} />
        )}
        <span className={styles.djRoleTag}>{isResident ? "Resident DJ" : "Special Guest"}</span>
      </div>

      <span className={styles.djGenreBadge}>
        <Icon name="disc" size={14} />
        <span>{dj.genre.split(",")[0]}</span>
      </span>

      <h3 className={styles.djNameHeading}>{dj.name}</h3>

      <p className={styles.djBioSnippet}>{bioExcerpt}</p>

      <div className={styles.djActionsRow}>
        {dj.instagram ? (
          <a
            href={dj.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.djSocialBtn}
            aria-label={`Instagram ${dj.name} (tab baru)`}
          >
            <Icon name="instagram" size={16} />
          </a>
        ) : null}

        {dj.spotify ? (
          <a
            href={dj.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.djSocialBtn}
            aria-label={`Spotify ${dj.name} (tab baru)`}
          >
            <Icon name="spotify" size={16} />
          </a>
        ) : null}

        <Link href={`/dj/${dj.slug}`} className={styles.djProfileBtn}>
          <span>Profil DJ</span>
          <Icon name="arrow" size={14} />
        </Link>
      </div>
    </article>
  );
}

export function MenuItemCard({
  item,
}: {
  item: { name: string; description: string | null; price: number; photoUrl: string | null; isAvailable: boolean };
}) {
  return (
    <article className={`${styles.card} ${styles.row}`}>
      <div className={styles.thumb}>
        <Media src={item.photoUrl} name={item.name} ratio="1 / 1" />
      </div>
      <div className={styles.body}>
        <div className={styles.rowHead}>
          <h3 className={styles.title}>{item.name}</h3>
          {item.isAvailable ? <StatusBadge tone="ok">Tersedia</StatusBadge> : <StatusBadge tone="off">Habis</StatusBadge>}
        </div>
        {item.description ? <p className={styles.desc}>{item.description}</p> : null}
        <p className={styles.price}>{formatRupiah(item.price)}</p>
      </div>
    </article>
  );
}

export function VipCard({
  pkg,
}: {
  pkg: { slug?: string; name: string; description: string; facilities: string[]; maxCapacity: number; price: number; photoUrl: string | null; isAvailable: boolean };
}) {
  return (
    <article className={styles.card}>
      <Media src={pkg.photoUrl} name={pkg.name} ratio="16 / 10" />
      <div className={styles.body}>
        <div className={styles.rowHead}>
          <h3 className={styles.title}>{pkg.name}</h3>
          {pkg.isAvailable ? <StatusBadge tone="ok">Tersedia</StatusBadge> : <StatusBadge tone="off">Penuh</StatusBadge>}
        </div>
        <p className={styles.desc}>{pkg.description}</p>
        <p className={styles.meta}>
          <Icon name="users" size={16} /> Maksimal {pkg.maxCapacity} orang
        </p>
        <ul className={styles.facilities}>
          {pkg.facilities.map((f) => (
            <li key={f}>
              <Icon name="check" size={16} />
              <span>{f}</span>
            </li>
          ))}
        </ul>
        <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", paddingTop: "var(--space-2)" }}>
          <p className={styles.price} style={{ margin: 0, padding: 0 }}>
            {formatRupiah(pkg.price)} <span className={styles.priceUnit}>/ malam</span>
          </p>
          <Link
            href={pkg.slug ? `/reservasi?paket=${pkg.slug}` : "/reservasi"}
            className={styles.djProfileBtn}
            style={{ padding: "6px 14px", fontSize: "0.8125rem" }}
          >
            <span>Pesan Meja</span>
            <Icon name="arrow" size={12} />
          </Link>
        </div>
      </div>
    </article>
  );
}
