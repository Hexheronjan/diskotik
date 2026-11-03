// Image container with natural aspect ratio and subtle dark overlay.
import { Icon } from "./Icon";
import styles from "./Media.module.css";

interface MediaProps {
  src?: string | null;
  name: string;
  /** CSS aspect ratio, e.g. "4 / 5". */
  ratio?: string;
  className?: string;
}

export function Media({ src, name, ratio = "4 / 3", className }: MediaProps) {
  return (
    <div className={`${styles.media} ${className ?? ""}`} style={{ aspectRatio: ratio }}>
      {src ? (
        <div className={styles.imageWrap}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={name} loading="lazy" decoding="async" className={styles.image} />
          <div className={styles.overlay} />
        </div>
      ) : (
        <div className={styles.empty} role="img" aria-label={`Pratinjau untuk ${name}`}>
          <div className={styles.emptyContent}>
            <div className={styles.iconCircle}>
              <Icon name="glass" size={18} />
            </div>
            <p className={styles.emptyLabel}>Prajalinks Club</p>
            <h4 className={styles.name}>{name}</h4>
          </div>
        </div>
      )}
    </div>
  );
}
