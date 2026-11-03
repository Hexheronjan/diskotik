import type { Metadata } from "next";
import { DjCard } from "@/components/public/Cards";
import { Reveal } from "@/components/ui/Reveal";
import { EmptyState, SectionHeading } from "@/components/ui/SectionHeading";
import { getDjs } from "@/lib/queries";
import styles from "@/components/public/Page.module.css";

export const metadata: Metadata = {
  title: "DJ & Lineup Diskotik",
  description: "Kenali para resident dan guest DJ yang menggetarkan lantai dansa Prajalinks.",
};

export default async function DjsPage() {
  const djs = await getDjs();
  return (
    <div className="container">
      <Reveal direction="up" delay={50}>
        <div className={styles.pageHeader}>
          <SectionHeading as="h1" eyebrow="Line-up Spektakuler" title="DJ & Artis Diskotik" description="Para kurator nada dan maestro panggung yang menghidupkan dentuman malam Anda." />
        </div>
      </Reveal>
      {djs.length === 0 ? (
        <EmptyState title="Belum ada DJ" message="Profil DJ akan segera ditambahkan." />
      ) : (
        <div className={styles.grid3}>
          {djs.map((dj, index) => {
            const direction = index % 3 === 0 ? "left" : index % 3 === 1 ? "up" : "right";
            const delay = 100 + (index % 3) * 120;
            return (
              <Reveal key={dj.id} direction={direction} delay={delay}>
                <DjCard dj={dj} />
              </Reveal>
            );
          })}
        </div>
      )}
    </div>
  );
}
