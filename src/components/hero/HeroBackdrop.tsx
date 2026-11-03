"use client";

// High-performance diskotik hero backdrop with atmospheric club photography
// and clean dark gradient overlay for optimal text readability.
import styles from "./Hero.module.css";

export function HeroBackdrop() {
  return (
    <div className={styles.backdrop} aria-hidden="true">
      {/* High-quality diskotik stage & lighting backdrop */}
      <div className={styles.photoBackdrop}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1920&q=80"
          alt=""
          className={styles.photoImg}
        />
        <div className={styles.photoOverlay} />
      </div>
      <div className={styles.vignette} />
    </div>
  );
}
