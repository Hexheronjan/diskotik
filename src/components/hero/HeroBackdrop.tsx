"use client";

// High-performance diskotik hero backdrop with atmospheric club photography,
// dynamic laser light effects, dark scrim overlay, and smooth ambient 3D mirror ball scene.
import dynamic from "next/dynamic";
import styles from "./Hero.module.css";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

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
        {/* Diskotik dynamic laser sweeps */}
        <div className={styles.laserLeft} />
        <div className={styles.laserRight} />
      </div>

      <HeroScene />
      <div className={styles.vignette} />
    </div>
  );
}
