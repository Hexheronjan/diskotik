"use client";

import { useEffect, useState } from "react";
import styles from "./Preloader.module.css";

const BRAND_LETTERS = "prajalinks".split("");
const EQUALIZER_BARS = [0.4, 0.9, 0.6, 1.0, 0.7, 0.3, 0.85, 0.5, 0.95, 0.4, 0.75, 0.6, 0.8];

export function Preloader() {
  const [progress, setProgress] = useState(15);
  const [isExiting, setIsExiting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Check if user has already visited during this browser session
    try {
      const hasVisited = window.sessionStorage.getItem("prajalinks_loaded");
      if (hasVisited) {
        const skipTimer = setTimeout(() => setIsDone(true), 0);
        return () => clearTimeout(skipTimer);
      }
    } catch {
      // ignore
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Progress increments to simulate sound engine & atmosphere setup
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const step = Math.floor(Math.random() * 25) + 15;
        return Math.min(prev + step, 100);
      });
    }, 180);

    // Trigger exit animation after ~1.1s
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
      try {
        window.sessionStorage.setItem("prajalinks_loaded", "1");
      } catch {
        // storage disabled fallback
      }
    }, 1100);

    // Complete removal after transition ends
    const doneTimer = setTimeout(() => {
      setIsDone(true);
      document.body.style.overflow = prevOverflow;
    }, 1600);

    return () => {
      clearInterval(interval);
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
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className={styles.ambientLights} aria-hidden="true">
        <div className={styles.glowMagenta} />
        <div className={styles.glowCyan} />
        <div className={styles.laserLine} />
      </div>

      <div className={styles.content}>
        <div className={styles.brandBadge}>
          <span className={styles.dot} />
          <span>Diskotik &amp; Club</span>
        </div>

        <div className={styles.brandTitle} aria-label="prajalinks">
          {BRAND_LETTERS.map((letter, i) => (
            <span
              key={i}
              className={styles.letter}
              style={{ animationDelay: `${i * 0.05}s` }}
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
                animationDelay: `${(i % 5) * 0.12}s`,
                animationDuration: `${0.6 + (i % 4) * 0.15}s`,
              }}
            />
          ))}
        </div>

        <div className={styles.tagline}>Ponorogo Nightlife Experience</div>

        <div className={styles.progressTrack} aria-hidden="true">
          <div className={styles.progressBar} style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}
