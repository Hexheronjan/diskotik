"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import styles from "./Navbar.module.css";

interface NavLinkItem {
  href: string;
  label: string;
  icon: IconName;
  desc: string;
}

const LINKS: NavLinkItem[] = [
  { href: "/", label: "Beranda", icon: "sparkle", desc: "Suasana & Highlight Pesta" },
  { href: "/acara", label: "Jadwal Acara", icon: "calendar", desc: "Pesta & Event Mendatang" },
  { href: "/dj", label: "Lineup DJ", icon: "disc", desc: "Resident & Guest DJ" },
  { href: "/menu", label: "Menu Minuman", icon: "glass", desc: "Cocktail & Bottle Packages" },
  { href: "/vip", label: "Paket VIP", icon: "crown", desc: "Sofa Suite & Eksklusif Service" },
  { href: "/reservasi", label: "Reservasi Meja", icon: "star", desc: "Booking Meja VIP Cepat" },
  { href: "/tentang-kami", label: "Tentang Kami", icon: "pin", desc: "Lokasi & Aturan Masuk" },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar({ siteName }: { siteName: string }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const drawerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setIsOpen(false), []);

  // Close drawer whenever route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll and handle keyboard accessibility (Esc closes)
  useEffect(() => {
    if (!isOpen) return;

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
  }, [isOpen, close]);

  return (
    <header className={styles.header}>
      <nav className={`container ${styles.nav}`} aria-label="Navigasi utama">
        {/* Brand */}
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

        {/* Desktop Navigation Links */}
        <ul className={styles.links}>
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={styles.link} aria-current={isActive(pathname, l.href) ? "page" : undefined}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Nav Action & Mobile Hamburger */}
        <div className={styles.navRight}>
          <ButtonLink href="/reservasi" variant="primary" size="md" className={styles.ctaButton} icon="crown">
            Reservasi Meja
          </ButtonLink>

          {/* Mobile Menu Button with clear hamburger & text */}
          <button
            ref={toggleRef}
            type="button"
            className={styles.mobileToggle}
            aria-label={isOpen ? "Tutup menu" : "Buka menu navigasi"}
            aria-expanded={isOpen}
            aria-controls="mobile-sidebar"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <span className={styles.hamburger}>
              <span className={`${styles.line} ${isOpen ? styles.lineOpen1 : ""}`} />
              <span className={`${styles.line} ${isOpen ? styles.lineOpen2 : ""}`} />
              <span className={`${styles.line} ${isOpen ? styles.lineOpen3 : ""}`} />
            </span>
            <span className={styles.mobileToggleText}>{isOpen ? "TUTUP" : "MENU"}</span>
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar Navigation Drawer */}
      <div
        className={`${styles.sidebarBackdrop} ${isOpen ? styles.backdropActive : ""}`}
        onClick={close}
        aria-hidden={!isOpen}
      >
        <aside
          id="mobile-sidebar"
          ref={drawerRef}
          className={`${styles.sidebarDrawer} ${isOpen ? styles.drawerOpen : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi diskotik"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header of Sidebar */}
          <div className={styles.sidebarHeader}>
            <div className={styles.sidebarBrand}>
              <span className={styles.brandLogo}>
                <span className={styles.brandEqualizer} aria-hidden="true">
                  <span className={styles.eqBar} style={{ animationDelay: "0s" }} />
                  <span className={styles.eqBar} style={{ animationDelay: "0.2s" }} />
                  <span className={styles.eqBar} style={{ animationDelay: "0.4s" }} />
                </span>
              </span>
              <div>
                <p className={styles.sidebarBrandTitle}>{siteName}</p>
                <p className={styles.sidebarBrandSubtitle}>Diskotik &amp; VIP Club</p>
              </div>
            </div>

            <button
              type="button"
              className={styles.sidebarCloseBtn}
              onClick={close}
              aria-label="Tutup navigasi"
            >
              <Icon name="close" size={20} />
            </button>
          </div>

          {/* Live Status indicator */}
          <div className={styles.sidebarStatusBadge}>
            <span className={styles.liveDot} />
            <span>BUKA MALAM INI • 18:00 - 03:00 WIB</span>
          </div>

          {/* Scrollable Nav Items */}
          <nav className={styles.sidebarNav}>
            <ul className={styles.sidebarList}>
              {LINKS.map((l) => {
                const active = isActive(pathname, l.href);
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className={`${styles.sidebarLink} ${active ? styles.linkActive : ""}`}
                      onClick={close}
                    >
                      <div className={styles.sidebarLinkLeft}>
                        <span className={`${styles.sidebarIconWrap} ${active ? styles.iconWrapActive : ""}`}>
                          <Icon name={l.icon} size={18} />
                        </span>
                        <div>
                          <span className={styles.sidebarLinkLabel}>{l.label}</span>
                          <span className={styles.sidebarLinkDesc}>{l.desc}</span>
                        </div>
                      </div>
                      <Icon name="arrow" size={15} className={styles.sidebarArrow} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Sidebar Bottom Actions */}
          <div className={styles.sidebarFooter}>
            <ButtonLink
              href="/reservasi"
              variant="primary"
              size="lg"
              className={styles.sidebarCta}
              onClick={close}
              icon="crown"
            >
              Reservasi Meja VIP
            </ButtonLink>

            <a
              href="https://wa.me/6285151951806?text=Halo%20Prajalinks,%20saya%20ingin%20info%20reservasi%20meja%20VIP"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.sidebarWa}
            >
              <Icon name="whatsapp" size={18} />
              <span>WhatsApp: 0851-5195-1806</span>
            </a>

            <div className={styles.sidebarMeta}>
              <a
                href="https://instagram.com/prajalinks"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.sidebarSocial}
              >
                <Icon name="instagram" size={15} />
                <span>@prajalinks</span>
              </a>
              <span className={styles.sidebarLocation}>Ponorogo, Jawa Timur</span>
            </div>
          </div>
        </aside>
      </div>
    </header>
  );
}
