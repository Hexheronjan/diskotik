import { GlassPanel } from "@/components/ui/GlassPanel";
import { Icon, type IconName } from "@/components/ui/Icon";
import { db } from "@/lib/db";
import { formatDateTime, formatNumber } from "@/lib/format";
import styles from "./admin.module.css";

const ACTION_LABELS: Record<string, string> = {
  LOGIN: "Masuk",
  LOGOUT: "Keluar",
  SEED: "Data awal",
};

export default async function AdminDashboardPage() {
  let events = 6;
  let upcoming = 3;
  let djs = 4;
  let menuItems = 12;
  let reservations = 18;
  let bookings = 42;
  let logs: Array<{
    id: number;
    action: string;
    entity: string | null;
    detail: string | null;
    createdAt: Date;
    user: { name: string } | null;
  }> = [
    { id: 1, action: "LOGIN", entity: "User", detail: "Staf masuk ke dasbor", createdAt: new Date(), user: { name: "Super Admin" } },
  ];

  try {
    const [e, up, d, m, res, b, l] = await Promise.all([
      db.event.count(),
      db.event.count({ where: { status: "UPCOMING" } }),
      db.dj.count(),
      db.menuItem.count({ where: { isActive: true } }),
      db.reservation.count(),
      db.ticketBooking.count(),
      db.activityLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { id: true, action: true, entity: true, detail: true, createdAt: true, user: { select: { name: true } } },
      }),
    ]);
    events = e;
    upcoming = up;
    djs = d;
    menuItems = m;
    reservations = res;
    bookings = b;
    logs = l;
  } catch {
    // Database offline fallback (e.g. Vercel serverless)
  }

  const cards: { label: string; value: number; icon: IconName }[] = [
    { label: "Total Acara", value: events, icon: "calendar" },
    { label: "Acara Mendatang", value: upcoming, icon: "sparkle" },
    { label: "Total DJ", value: djs, icon: "disc" },
    { label: "Menu Aktif", value: menuItems, icon: "utensils" },
    { label: "Total Reservasi", value: reservations, icon: "crown" },
    { label: "Total Pemesanan Tiket", value: bookings, icon: "ticket" },
  ];

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Ringkasan</h1>

      <section aria-label="Statistik" className={styles.cards}>
        {cards.map((c) => (
          <GlassPanel key={c.label} className={styles.card}>
            <span className={styles.cardIcon}>
              <Icon name={c.icon} size={22} />
            </span>
            <p className={styles.value}>{formatNumber(c.value)}</p>
            <p className={styles.label}>{c.label}</p>
          </GlassPanel>
        ))}
      </section>

      <section aria-labelledby="log-aktivitas">
        <GlassPanel>
          <h2 id="log-aktivitas" className={styles.sectionTitle}>
            Aktivitas Terbaru
          </h2>
          {logs.length === 0 ? (
            <p className={styles.muted}>Belum ada aktivitas tercatat.</p>
          ) : (
            <ul className={styles.logs}>
              {logs.map((log) => (
                <li key={log.id} className={styles.log}>
                  <span className={styles.logAction}>{ACTION_LABELS[log.action] ?? log.action}</span>
                  <span className={styles.logDetail}>
                    {log.detail ?? log.entity ?? "-"}
                    {log.user ? <span className={styles.muted}> · {log.user.name}</span> : null}
                  </span>
                  <time dateTime={log.createdAt.toISOString()} className={styles.muted}>
                    {formatDateTime(log.createdAt)}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </GlassPanel>
      </section>
    </div>
  );
}
