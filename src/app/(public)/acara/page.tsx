import type { Metadata } from "next";
import { EventCard } from "@/components/public/Cards";
import { Reveal } from "@/components/ui/Reveal";
import { EmptyState, SectionHeading } from "@/components/ui/SectionHeading";
import { getEventsByStatus } from "@/lib/queries";
import styles from "@/components/public/Page.module.css";

export const metadata: Metadata = {
  title: "Jadwal Acara Diskotik",
  description: "Jadwal acara diskotik mendatang, pesta malam ini, dan arsip acara spektakuler Prajalinks.",
};

export default async function EventsPage() {
  const { upcoming, ongoing, completed } = await getEventsByStatus();
  const sections = [
    { id: "berlangsung", title: "Sedang Berlangsung", eyebrow: "Malam ini", items: ongoing, empty: "Tidak ada acara yang sedang berlangsung." },
    { id: "mendatang", title: "Akan Datang", eyebrow: "Segera hadir", items: upcoming, empty: "Belum ada acara mendatang. Pantau terus jadwal kami." },
    { id: "selesai", title: "Telah Selesai", eyebrow: "Arsip pesta", items: completed, empty: "Belum ada acara yang selesai." },
  ];

  return (
    <div className="container">
      <Reveal direction="up" delay={50}>
        <div className={styles.pageHeader}>
          <SectionHeading as="h1" eyebrow="Kalender Malam" title="Jadwal Acara Diskotik" description="Temukan malam pesta dan dentuman musik yang paling berkesan untuk Anda." />
        </div>
      </Reveal>
      {sections.map((s) => (
        <section key={s.id} className={styles.pageSection} aria-labelledby={`judul-${s.id}`}>
          <Reveal direction="up" delay={50}>
            <SectionHeading eyebrow={s.eyebrow} title={s.title} />
          </Reveal>
          <span id={`judul-${s.id}`} className="sr-only">
            {s.title}
          </span>
          {s.items.length === 0 ? (
            <EmptyState title="Kosong" message={s.empty} />
          ) : (
            <div className={styles.grid3}>
              {s.items.map((e, index) => {
                const direction = index % 3 === 0 ? "left" : index % 3 === 1 ? "up" : "right";
                const delay = 100 + (index % 3) * 120;
                return (
                  <Reveal key={e.id} direction={direction} delay={delay}>
                    <EventCard event={e} />
                  </Reveal>
                );
              })}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
