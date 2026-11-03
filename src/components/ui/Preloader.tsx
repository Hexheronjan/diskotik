"use client";

import { useEffect, useState } from "react";
import styles from "./Preloader.module.css";

const BRAND_LETTERS = "prajalinks".split("");
const EQUALIZER_BARS = [0.4, 0.9, 0.6, 1.0, 0.7, 0.3, 0.85, 0.5, 0.95, 0.4, 0.75, 0.6, 0.8];

export function Preloader() {
  const [isExiting, setIsExiting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Check if user has already visited during this browser session
    try {
      const hasVisited = window.sessionStorage.getItem("prajalinks_loaded");
      if (hasVisited) {
        setIsDone(true);
        return;
      }
    } catch {
      // ignore
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Fast & ultra-smooth exit timing (0.95s active, then 0.35s fadeout)
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
      try {
        window.sessionStorage.setItem("prajalinks_loaded", "1");
      } catch {
        // storage disabled fallback
      }
    }, 950);

    const doneTimer = setTimeout(() => {
      setIsDone(true);
      document.body.style.overflow = prevOverflow;
    }, 1350);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  if (isDone) return null;

  return (
    <div
      className={`${styles.preloader} ${isExiting ? styles.exiting : ""}`}
      role="progressbar"
      aria-label="Memuat Prajalinks Diskotik"
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className={styles.ambientLights} aria-hidden="true">
        <div className={styles.glowMagenta} />
        <div className={styles.glowGold} />
      </div>

      <div className={styles.content}>
        <div className={styles.brandBadge}>
          <span className={styles.dot} />
          <span>Diskotik &amp; VIP Club</span>
        </div>

        <div className={styles.brandTitle} aria-label="prajalinks">
          {BRAND_LETTERS.map((letter, i) => (
            <span
              key={i}
              className={styles.letter}
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              {letter}
            </span>
          ))}
        </div>

        {/* Audio Equalizer */}
        <div className={styles.equalizer} aria-hidden="true">
          {EQUALIZER_BARS.map((height, i) => (
            <span
              key={i}
              className={styles.bar}
              style={{
                height: `${height * 100}%`,
                animationDelay: `${(i % 5) * 0.1}s`,
                animationDuration: `${0.6 + (i % 4) * 0.12}s`,
              }}
            />
          ))}
        </div>

        <div className={styles.tagline}>Ponorogo Nightlife Experience</div>

        <div className={styles.progressTrack} aria-hidden="true">
          <div className={styles.progressBar} />
        </div>
      </div>
    </div>
  );
}
