// Glassmorphism surface.
import type { HTMLAttributes, ReactNode } from "react";
import styles from "./GlassPanel.module.css";

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  as?: "div" | "section" | "article" | "aside";
  padded?: boolean;
  children?: ReactNode;
}

export function GlassPanel({ as: Tag = "div", padded = true, className, children, ...rest }: GlassPanelProps) {
  const classes = [styles.panel, padded ? styles.padded : "", className ?? ""].filter(Boolean).join(" ");
  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
}
