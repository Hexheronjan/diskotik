import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/Icon";
import type { SiteSettings } from "@/lib/queries";
import styles from "./Footer.module.css";

export function SocialLinks({ settings }: { settings: SiteSettings }) {
  const items: { href: string; label: string; icon: IconName }[] = [
    { href: settings.instagramUrl, label: "Instagram", icon: "instagram" as const },
    { href: settings.facebookUrl, label: "Facebook", icon: "facebook" as const },
    { href: settings.tiktokUrl, label: "TikTok", icon: "tiktok" as const },
    { href: settings.youtubeUrl, label: "YouTube", icon: "youtube" as const },
  ].filter((i) => i.href);
  if (items.length === 0) return null;
  return (
    <ul className={styles.social}>
      {items.map((i) => (
        <li key={i.label}>
          <a href={i.href} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label={`${i.label} (tab baru)`}>
            <Icon name={i.icon} size={20} />
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <p className={styles.logo}>{settings.siteName}</p>
          <p className={styles.muted}>Musik, cahaya, dan malam yang tak terlupakan.</p>
          <SocialLinks settings={settings} />
        </div>
        <nav aria-label="Tautan footer">
          <h2 className={styles.heading}>Jelajahi</h2>
          <ul className={styles.list}>
            <li><Link href="/acara" className={styles.footLink}>Acara</Link></li>
            <li><Link href="/dj" className={styles.footLink}>DJ</Link></li>
            <li><Link href="/menu" className={styles.footLink}>Menu</Link></li>
            <li><Link href="/vip" className={styles.footLink}>Paket VIP</Link></li>
            <li><Link href="/tentang-kami" className={styles.footLink}>Tentang Kami</Link></li>
          </ul>
        </nav>
        <div>
          <h2 className={styles.heading}>Kunjungi Kami</h2>
          {settings.address ? <p className={styles.muted}>{settings.address}</p> : null}
          <p className={styles.muted} style={{ marginTop: "6px", fontSize: "0.875rem" }}>
            WhatsApp:{" "}
            <a href={settings.whatsappLink || "https://wa.me/6285151951806"} style={{ color: "#00f0ff", fontWeight: 600 }}>
              0851-5195-1806
            </a>
          </p>
          <p className={styles.muted} style={{ marginTop: "2px", fontSize: "0.875rem" }}>
            Instagram:{" "}
            <a
              href="https://instagram.com/prajalinks"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#ff659c", fontWeight: 600 }}
            >
              @prajalinks
            </a>
          </p>
          <p className={styles.notice}>Khusus pengunjung berusia 18 tahun ke atas. Mohon bawa kartu identitas.</p>
        </div>
      </div>
      <div className={`container ${styles.bottom}`}>
        <p>© {settings.siteName}. Seluruh hak cipta dilindungi.</p>
        <Link href="/masuk" className={styles.footLink}>Masuk Staf</Link>
      </div>
    </footer>
  );
}
