import { Icon } from "@/components/ui/Icon";
import styles from "./WhatsAppButton.module.css";

/** Floating WhatsApp button. Renders nothing when no number is configured. */
export function WhatsAppButton({ link, siteName }: { link: string; siteName: string }) {
  if (!link) return null;
  const message = encodeURIComponent(`Halo ${siteName}, saya ingin bertanya.`);
  return (
    <a
      href={`${link}?text=${message}`}
      className={styles.fab}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hubungi kami lewat WhatsApp (tab baru)"
    >
      <Icon name="whatsapp" size={28} />
    </a>
  );
}
