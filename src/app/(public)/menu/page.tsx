import type { Metadata } from "next";
import { MenuItemCard } from "@/components/public/Cards";
import { Reveal } from "@/components/ui/Reveal";
import { EmptyState, SectionHeading } from "@/components/ui/SectionHeading";
import { getMenu } from "@/lib/queries";
import styles from "@/components/public/Page.module.css";

export const metadata: Metadata = {
  title: "Menu & Minuman",
  description: "Menu kuliner malam, signature mocktail artisan, dan minuman non-alkohol di Prajalinks.",
};

export default async function MenuPage() {
  const categories = (await getMenu()).filter((c) => c.items.length > 0);
  return (
    <div className="container">
      <Reveal direction="up" delay={50}>
        <div className={styles.pageHeader}>
          <SectionHeading as="h1" eyebrow="Kurasi Gastronomi" title="Menu &amp; Minuman" description="Sajian hidangan malam dan racikan mocktail segar pendamping pesta dansa Anda." />
        </div>
      </Reveal>
      {categories.length === 0 ? (
        <EmptyState title="Menu belum tersedia" message="Daftar menu akan segera ditambahkan." />
      ) : (
        categories.map((c) => (
          <section key={c.id} className={styles.pageSection} aria-labelledby={`kategori-${c.id}`}>
            <Reveal direction="up" delay={50}>
              <h2 id={`kategori-${c.id}`} style={{ marginBottom: "var(--space-6)", fontSize: "var(--text-h3)" }}>
                {c.name}
              </h2>
            </Reveal>
            <div className={styles.grid2}>
              {c.items.map((item, index) => {
                const direction = index % 2 === 0 ? "left" : "right";
                const delay = 80 + (index % 4) * 100;
                return (
                  <Reveal key={item.id} direction={direction} delay={delay}>
                    <MenuItemCard item={item} />
                  </Reveal>
                );
              })}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
