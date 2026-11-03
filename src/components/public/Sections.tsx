// Reusable public sections: opening hours and the interactive Ponorogo venue & contact hub.
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import type { SiteSettings } from "@/lib/queries";
import styles from "./Page.module.css";

export function OpeningHours({ settings }: { settings: SiteSettings }) {
  return (
    <GlassPanel>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-4)", flexWrap: "wrap", gap: "8px" }}>
        <h3 className={styles.subtitle} style={{ margin: 0 }}>Jam Operasional Klub</h3>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", fontWeight: 700, padding: "3px 10px", borderRadius: "999px", background: "rgba(255, 255, 255, 0.1)", color: "#ffffff", border: "1px solid rgba(255, 255, 255, 0.25)" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ffffff", boxShadow: "0 0 8px #ffffff" }} />
          Buka Malam Ini
        </span>
      </div>

      {settings.openingHours.length === 0 ? (
        <p className={styles.muted}>Jam buka belum tersedia.</p>
      ) : (
        <ul className={styles.hours}>
          {settings.openingHours.map((h) => (
            <li key={h.day}>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Icon name="clock" size={14} style={{ color: "#ffffff" }} />
                <span>{h.day}</span>
              </span>
              <span style={{ color: "#fff", fontWeight: 600 }}>{h.hours}</span>
            </li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: "var(--space-4)", paddingTop: "var(--space-3)", borderTop: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
        <span style={{ fontSize: "0.8125rem", color: "#ffffff", opacity: 0.9 }}>Reservasi meja sofa disarankan sebelum pukul 21.00 WIB</span>
        <a href="/reservasi" style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--color-gold)", textDecoration: "none" }}>
          Pesan Meja Sekarang →
        </a>
      </div>
    </GlassPanel>
  );
}

export function Location({ settings }: { settings: SiteSettings }) {
  const address = settings.address || "Jl. HOS Cokroaminoto No. 88, Ponorogo, Jawa Timur 63411";
  const displayPhone = "0851-5195-1806";
  const whatsappUrl = "https://wa.me/6285151951806?text=Halo%20Prajalinks%20Ponorogo,%20saya%20ingin%20info%20reservasi%20meja%20VIP%20/%20jadwal%20event";
  const instagramUrl = settings.instagramUrl || "https://instagram.com/prajalinks";
  const mapEmbedUrl =
    settings.mapsEmbedUrl || "https://www.google.com/maps?q=Ponorogo,+Jawa+Timur,+Indonesia&output=embed";
  const googleMapsSearchUrl = "https://www.google.com/maps/search/?api=1&query=Ponorogo,+Jawa+Timur";

  return (
    <div className={styles.venueHub}>
      {/* Kolom Kiri: Kartu Kontak & Alamat Lengkap */}
      <Reveal direction="left" delay={100}>
        <div className={styles.contactCardsStack}>
          {/* Card 1: Alamat Venue Ponorogo */}
          <div className={styles.contactCard}>
            <div className={styles.contactLeft}>
              <div className={styles.contactIconCircle} style={{ color: "#ffffff", borderColor: "rgba(255, 255, 255, 0.25)" }}>
                <Icon name="pin" size={24} />
              </div>
              <div className={styles.contactText}>
                <span className={styles.contactLabel}>Alamat Venue Diskotik</span>
                <span className={styles.contactValue}>{address}</span>
                <span className={styles.contactSubtext}>Pusat kota Ponorogo, akses jalan protokol utama</span>
              </div>
            </div>
            <a
              href={googleMapsSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactBtn}
              aria-label="Buka petunjuk arah ke Ponorogo di Google Maps (tab baru)"
            >
              <span>Petunjuk Arah</span>
              <Icon name="arrow" size={14} />
            </a>
          </div>

          {/* Card 2: Hotline & No. HP / WhatsApp */}
          <div className={styles.contactCard}>
            <div className={styles.contactLeft}>
              <div
                className={styles.contactIconCircle}
                style={{
                  color: "#25D366",
                  borderColor: "rgba(37, 211, 102, 0.35)",
                  background: "rgba(37, 211, 102, 0.08)",
                }}
              >
                <Icon name="whatsapp" size={24} />
              </div>
              <div className={styles.contactText}>
                <span className={styles.contactLabel} style={{ color: "#ffffff" }}>
                  Hotline &amp; WhatsApp Resmi
                </span>
                <span className={styles.contactValue}>{displayPhone}</span>
                <span className={styles.contactSubtext}>Reservasi Meja Sofa VIP, Guestlist &amp; Info Tiket</span>
              </div>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactBtn}
              style={{
                background: "rgba(37, 211, 102, 0.15)",
                borderColor: "rgba(37, 211, 102, 0.4)",
                color: "#25D366",
              }}
              aria-label={`Chat WhatsApp ke nomor ${displayPhone} (tab baru)`}
            >
              <span>Chat WhatsApp</span>
              <Icon name="whatsapp" size={14} />
            </a>
          </div>

          {/* Card 3: Instagram Resmi */}
          <div className={styles.contactCard}>
            <div className={styles.contactLeft}>
              <div
                className={styles.contactIconCircle}
                style={{
                  color: "#ff659c",
                  borderColor: "rgba(224, 36, 114, 0.35)",
                  background: "rgba(224, 36, 114, 0.08)",
                }}
              >
                <Icon name="instagram" size={24} />
              </div>
              <div className={styles.contactText}>
                <span className={styles.contactLabel} style={{ color: "#ffffff" }}>
                  Instagram Resmi
                </span>
                <span className={styles.contactValue}>@prajalinks</span>
                <span className={styles.contactSubtext}>Update jadwal DJ harian, teaser acara &amp; video pesta</span>
              </div>
            </div>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactBtn}
              style={{
                background: "rgba(224, 36, 114, 0.15)",
                borderColor: "rgba(224, 36, 114, 0.4)",
                color: "#ff659c",
              }}
              aria-label="Kunjungi profil Instagram prajalinks (tab baru)"
            >
              <span>Buka @prajalinks</span>
              <Icon name="arrow" size={14} />
            </a>
          </div>

          {/* Badge Fasilitas & Akses */}
          <div className={styles.venueGuidelines}>
            <Icon name="sparkle" size={16} />
            <span>18+ Wajib KTP</span>
            <span>•</span>
            <span>Valet Parking Luas</span>
            <span>•</span>
            <span>Dresscode: Smart &amp; Glam Party Casual</span>
          </div>
        </div>
      </Reveal>

      {/* Kolom Kanan: Framed Ponorogo Google Map */}
      <Reveal direction="right" delay={200}>
        <div className={styles.mapCard}>
          <div className={styles.mapHeader}>
            <div className={styles.mapCityTag}>
              <span className={styles.mapLiveDot} />
              <span>Prajalinks Diskotik — Ponorogo</span>
            </div>
            <span className={styles.mapHoursTag}>18.00 - 03.00 WIB</span>
          </div>

          <div className={styles.mapIframeWrap}>
            <iframe
              className={styles.mapIframe}
              src={mapEmbedUrl}
              title={`Peta Lokasi ${settings.siteName} Ponorogo`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>

          <div className={styles.mapFooterOverlay}>
            <span className={styles.mapFooterText}>📍 Kawasan Pusat Hiburan Ponorogo, Jawa Timur</span>
            <a
              href={googleMapsSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mapNavBtn}
              aria-label="Buka peta navigasi Ponorogo (tab baru)"
            >
              <span>Navigasi Peta</span>
              <Icon name="arrow" size={12} />
            </a>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
