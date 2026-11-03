"use client";

// Cinematic hero backdrop: crossfading club photography with a slow zoom,
// a dark scrim for legibility and a soft vignette. No neon, no particles.
import { useEffect, useState } from "react";
import styles from "./Hero.module.css";

const SLIDES = [
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=2000&q=85",
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=2000&q=85",
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=2000&q=85",
  "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=2000&q=85",
];

const SLIDE_MS = 6500;

export function HeroBackdrop() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const timer = setInterval(() => setActive((i) => (i + 1) % SLIDES.length), SLIDE_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.backdrop} aria-hidden="true">
      <div className={styles.photoBackdrop}>
        {SLIDES.map((src, i) => (
          <div key={src} className={`${styles.slide} ${i === active ? styles.slideActive : ""}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className={styles.photoImg} loading={i === 0 ? "eager" : "lazy"} />
          </div>
        ))}
        <div className={styles.photoOverlay} />
      </div>
      <div className={styles.vignette} />
      <div className={styles.pager}>
        {SLIDES.map((src, i) => (
          <span key={src} className={`${styles.pagerBar} ${i === active ? styles.pagerBarActive : ""}`} />
        ))}
      </div>
    </div>
  );
}
