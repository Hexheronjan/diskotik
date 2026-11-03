"use client";

// High-performance diskotik hero backdrop with atmospheric club photography,
// dynamic ambient light sweeps, and clean vignette.
import styles from "./Hero.module.css";

export function HeroBackdrop() {
  return (
    <div className={styles.backdrop} aria-hidden="true">
      {/* High-quality diskotik stage & lighting backdrop */}
      <div className={styles.photoBackdrop}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=2000&q=85"
          alt=""
          className={styles.photoImg}
        />
        <div className={styles.photoOverlay} />
        {/* Dynamic laser stage glow sweeps */}
        <div className={styles.laserLeft} />
        <div className={styles.laserRight} />
      </div>
      <div className={styles.vignette} />
    </div>
  );
}
