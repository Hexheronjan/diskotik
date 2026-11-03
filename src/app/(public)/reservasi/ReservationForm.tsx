"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { formatRupiah } from "@/lib/format";
import { createReservationAction, type ReservationActionResult } from "./actions";
import styles from "./reservasi.module.css";

interface PackageOption {
  slug: string;
  name: string;
  maxCapacity: number;
  price: number;
}

interface ReservationFormProps {
  packages: PackageOption[];
  defaultPackageSlug?: string;
}

export function ReservationForm({ packages, defaultPackageSlug }: ReservationFormProps) {
  const [selectedPkg, setSelectedPkg] = useState<string>(defaultPackageSlug || packages[0]?.slug || "");
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ReservationActionResult | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Minimum date is today in YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});
    setGlobalError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const res = await createReservationAction(formData);
      if (!res.success) {
        setGlobalError(res.error);
        if (res.fieldErrors) {
          setFieldErrors(res.fieldErrors);
        }
      } else {
        setResult(res);
      }
    });
  };

  // If successfully submitted, show the confirmation screen
  if (result && result.success) {
    return (
      <div className={styles.successCard}>
        <div className={styles.successIconCircle}>
          <Icon name="check" size={32} />
        </div>

        <h2 className={styles.successTitle}>Permintaan Reservasi Terkirim!</h2>
        <p style={{ color: "var(--color-muted)", maxWidth: "46ch", lineHeight: 1.6 }}>
          Terima kasih, <strong>{result.customerName}</strong>. Reservasi meja VIP Anda telah terdaftar di sistem Prajalinks Ponorogo.
        </p>

        <div className={styles.codeBanner}>
          <span className={styles.codeLabel}>Kode Booking Referensi</span>
          <span className={styles.codeValue}>{result.code}</span>
        </div>

        <div className={styles.summaryBox}>
          <div className={styles.summaryRow}>
            <span className={styles.summaryKey}>Tanggal Pesta:</span>
            <span className={styles.summaryVal}>{result.reservedFor}</span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryKey}>Jumlah Tamu:</span>
            <span className={styles.summaryVal}>{result.guestCount} Orang</span>
          </div>
          {result.packageName ? (
            <div className={styles.summaryRow}>
              <span className={styles.summaryKey}>Pilihan Paket:</span>
              <span className={styles.summaryVal} style={{ color: "var(--color-gold)" }}>
                {result.packageName}
              </span>
            </div>
          ) : null}
          <div className={styles.summaryRow}>
            <span className={styles.summaryKey}>Status Meja:</span>
            <span className={styles.summaryVal} style={{ color: "#c5a46d" }}>
              Menunggu Verifikasi Staf
            </span>
          </div>
        </div>

        <p style={{ fontSize: "0.875rem", color: "var(--color-muted)", margin: "4px 0" }}>
          Klik tombol di bawah untuk mengirim konfirmasi langsung ke WhatsApp Concierge kami:
        </p>

        <a
          href={result.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.whatsappConfirmBtn}
        >
          <Icon name="whatsapp" size={20} />
          <span>Konfirmasi ke WhatsApp (0851-5195-1806)</span>
        </a>

        <div style={{ display: "flex", gap: "16px", marginTop: "var(--space-2)" }}>
          <button
            type="button"
            onClick={() => setResult(null)}
            style={{ background: "none", border: "none", color: "var(--color-muted)", cursor: "pointer", textDecoration: "underline", fontSize: "0.875rem" }}
          >
            Buat Reservasi Baru
          </button>
          <Link href="/" style={{ color: "var(--color-gold)", fontSize: "0.875rem" }}>
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.formCard}>
      <h2 className={styles.formTitle}>Formulir Reservasi Meja VIP</h2>
      <p className={styles.formSubtitle}>
        Lengkapi data kunjungan Anda. Staf VIP Concierge Prajalinks akan memverifikasi ketersediaan sofa &amp; meja pesta Anda.
      </p>

      {globalError ? <div className={styles.globalError}>{globalError}</div> : null}

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Pilihan Paket VIP */}
        <div className={styles.field}>
          <label className={styles.label}>
            <span>Pilihan Paket / Meja VIP</span>
            <span className={styles.required}>*</span>
          </label>
          <div className={styles.packagesGrid}>
            {packages.map((pkg) => {
              const isSelected = selectedPkg === pkg.slug;
              return (
                <div
                  key={pkg.slug}
                  className={`${styles.packageOption} ${isSelected ? styles.packageSelected : ""}`}
                  onClick={() => setSelectedPkg(pkg.slug)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setSelectedPkg(pkg.slug);
                  }}
                >
                  <span className={styles.packageName}>{pkg.name}</span>
                  <span className={styles.packageMeta}>Kapasitas s/d {pkg.maxCapacity} Orang</span>
                  <span className={styles.packagePrice}>{formatRupiah(pkg.price)}</span>
                </div>
              );
            })}
          </div>
          <input type="hidden" name="packageSlug" value={selectedPkg} />
        </div>

        {/* Tanggal & Jumlah Tamu */}
        <div className={styles.row2}>
          <div className={styles.field}>
            <label htmlFor="reservedFor" className={styles.label}>
              <span>Tanggal Kunjungan</span>
              <span className={styles.required}>*</span>
            </label>
            <input
              type="date"
              id="reservedFor"
              name="reservedFor"
              min={today}
              required
              className={styles.input}
            />
            {fieldErrors.reservedFor ? (
              <span className={styles.errorText}>{fieldErrors.reservedFor}</span>
            ) : null}
          </div>

          <div className={styles.field}>
            <label htmlFor="guestCount" className={styles.label}>
              <span>Jumlah Tamu (Pax)</span>
              <span className={styles.required}>*</span>
            </label>
            <input
              type="number"
              id="guestCount"
              name="guestCount"
              min={1}
              max={30}
              defaultValue={4}
              required
              className={styles.input}
            />
            {fieldErrors.guestCount ? (
              <span className={styles.errorText}>{fieldErrors.guestCount}</span>
            ) : null}
          </div>
        </div>

        {/* Nama Pemesan & No HP / WhatsApp */}
        <div className={styles.row2}>
          <div className={styles.field}>
            <label htmlFor="customerName" className={styles.label}>
              <span>Nama Lengkap Pemesan</span>
              <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              placeholder="Contoh: Alex Pratama"
              required
              className={styles.input}
            />
            {fieldErrors.customerName ? (
              <span className={styles.errorText}>{fieldErrors.customerName}</span>
            ) : null}
          </div>

          <div className={styles.field}>
            <label htmlFor="customerPhone" className={styles.label}>
              <span>Nomor WhatsApp Aktif</span>
              <span className={styles.required}>*</span>
            </label>
            <input
              type="tel"
              id="customerPhone"
              name="customerPhone"
              placeholder="Contoh: 085151951806"
              required
              className={styles.input}
            />
            {fieldErrors.customerPhone ? (
              <span className={styles.errorText}>{fieldErrors.customerPhone}</span>
            ) : null}
          </div>
        </div>

        {/* Email (Opsional) */}
        <div className={styles.field}>
          <label htmlFor="customerEmail" className={styles.label}>
            <span>Alamat Email (Opsional)</span>
          </label>
          <input
            type="email"
            id="customerEmail"
            name="customerEmail"
            placeholder="nama@email.com"
            className={styles.input}
          />
          {fieldErrors.customerEmail ? (
            <span className={styles.errorText}>{fieldErrors.customerEmail}</span>
          ) : null}
        </div>

        {/* Catatan Tambahan */}
        <div className={styles.field}>
          <label htmlFor="notes" className={styles.label}>
            <span>Catatan / Permintaan Khusus</span>
          </label>
          <textarea
            id="notes"
            name="notes"
            placeholder="Contoh: Perayaan ulang tahun, preferensi botol minuman, atau request meja dekat DJ booth."
            className={styles.textarea}
          />
        </div>

        <button type="submit" disabled={isPending} className={styles.submitBtn}>
          {isPending ? (
            <span>Memproses Reservasi...</span>
          ) : (
            <>
              <span>Kirim Reservasi Meja VIP</span>
              <Icon name="arrow" size={18} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
