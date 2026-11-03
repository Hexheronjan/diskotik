"use client";

// Sticky glass navbar with an accessible mobile drawer (Esc closes, focus is trapped and restored).
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import styles from "./Navbar.module.css";

const LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/acara", label: "Acara" },
  { href: "/dj", label: "DJ" },
  { href: "/menu", label: "Menu" },
  { href: "/vip", label: "Paket VIP" },
  { href: "/reservasi", label: "Reservasi" },
  { href: "/tentang-kami", label: "Tentang Kami" },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar({ siteName }: { siteName: string }) {
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const drawerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpenPath(null), []);

  useEffect(() => {
    if (!open) return;
    const drawer = drawerRef.current;
    const toggle = toggleRef.current;
    const focusables = () => Array.from(drawer?.querySelectorAll<HTMLElement>("a[href], button") ?? []);
    focusables()[0]?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      toggle?.focus();
    };
  }, [open, close]);

  return (
    <header className={styles.header}>
      <nav className={`container ${styles.nav}`} aria-label="Navigasi utama">
        <Link href="/" className={styles.brand} aria-label={`${siteName} — Beranda`}>
          <span className={styles.brandLogo}>
            <span className={styles.brandEqualizer} aria-hidden="true">
              <span className={styles.eqBar} style={{ animationDelay: "0s" }} />
              <span className={styles.eqBar} style={{ animationDelay: "0.2s" }} />
              <span className={styles.eqBar} style={{ animationDelay: "0.4s" }} />
            </span>
          </span>
          <span className={styles.brandText}>{siteName}</span>
        </Link>

        <ul className={styles.links}>
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={styles.link} aria-current={isActive(pathname, l.href) ? "page" : undefined}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.navRight}>
          <ButtonLink href="/reservasi" variant="primary" size="md" className={styles.ctaButton} icon="crown">
            Reservasi Meja
          </ButtonLink>

          <button
            ref={toggleRef}
            type="button"
            className={styles.toggle}
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            aria-controls="menu-seluler"
            onClick={() => setOpenPath(open ? null : pathname)}
          >
            <Icon name={open ? "close" : "menu"} size={22} />
          </button>
        </div>
      </nav>

      {open ? (
        <div className={styles.backdrop} onMouseDown={(e) => e.target === e.currentTarget && close()}>
          <div id="menu-seluler" ref={drawerRef} className={styles.drawer} role="dialog" aria-modal="true" aria-label="Menu navigasi">
            <ul className={styles.drawerList}>
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={styles.drawerLink}
                    aria-current={isActive(pathname, l.href) ? "page" : undefined}
                    onClick={close}
                  >
                    <span>{l.label}</span>
                    <Icon name="arrow" size={16} />
                  </Link>
                </li>
              ))}
            </ul>
            <div className={styles.drawerFooter}>
              <ButtonLink href="/reservasi" variant="primary" size="lg" className={styles.drawerCta} onClick={close} icon="crown">
                Reservasi Meja VIP
              </ButtonLink>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
