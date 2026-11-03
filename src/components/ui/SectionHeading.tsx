import type { ReactNode } from "react";
import styles from "./SectionHeading.module.css";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  as?: "h1" | "h2";
}

export function SectionHeading({ eyebrow, title, description, action, as: Tag = "h2" }: SectionHeadingProps) {
  return (
    <div className={styles.wrap}>
      <div className={styles.text}>
        {eyebrow ? (
          <div className={styles.eyebrowWrap}>
            <span className={styles.eyebrowDot} />
            <span className={styles.eyebrow}>{eyebrow}</span>
          </div>
        ) : null}
        <Tag className={Tag === "h1" ? styles.pageTitle : styles.title}>{title}</Tag>
        {description ? <p className={styles.description}>{description}</p> : null}
      </div>
      {action ? <div className={styles.actionWrap}>{action}</div> : null}
    </div>
  );
}

export function EmptyState({ title, message, children }: { title: string; message: string; children?: ReactNode }) {
  return (
    <div className={styles.empty}>
      <div className={styles.emptyGlow} />
      <h3 className={styles.emptyTitle}>{title}</h3>
      <p className={styles.emptyMessage}>{message}</p>
      {children}
    </div>
  );
}

export function StatusBadge({ tone, children }: { tone: "live" | "soon" | "done" | "ok" | "off"; children: ReactNode }) {
  return (
    <span className={`${styles.badge} ${styles[tone]}`}>
      <span className={styles.statusDot} />
      <span>{children}</span>
    </span>
  );
}
