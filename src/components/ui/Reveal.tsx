"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import styles from "./Reveal.module.css";

export type RevealDirection = "left" | "right" | "up";

interface RevealProps {
  children: ReactNode;
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  className?: string;
  style?: CSSProperties;
  as?: "div" | "article" | "section" | "aside" | "header" | "li";
}

export function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration,
  className = "",
  style = {},
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      const fallbackTimer = setTimeout(() => setIsVisible(true), 0);
      return () => clearTimeout(fallbackTimer);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  const dirClass =
    direction === "left" ? styles.left : direction === "right" ? styles.right : styles.up;

  const dynamicStyle: CSSProperties = {
    ...style,
    transitionDelay: `${delay}ms`,
    ...(duration ? ({ "--reveal-duration": `${duration}s` } as CSSProperties) : {}),
  };

  const Component = Tag as "div";

  return (
    <Component
      ref={ref}
      className={`${styles.reveal} ${dirClass} ${isVisible ? styles.visible : ""} ${className}`}
      style={dynamicStyle}
    >
      {children}
    </Component>
  );
}
