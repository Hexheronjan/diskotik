"use server";

import { z } from "zod";
import { db } from "@/lib/db";

const reservationActionSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(3, "Nama minimal 3 karakter.")
    .max(120, "Nama terlalu panjang."),
  customerPhone: z
    .string()
    .trim()
    .min(9, "Nomor telepon minimal 9 digit.")
    .max(20, "Nomor telepon maksimal 20 digit."),
  customerEmail: z
    .string()
    .trim()
    .email("Format email tidak valid.")
    .optional()
    .or(z.literal("")),
  guestCount: z.coerce
    .number()
    .min(1, "Minimal 1 tamu.")
    .max(50, "Maksimal 50 tamu."),
  reservedFor: z
    .string()
    .min(1, "Tanggal kunjungan wajib dipilih."),
  packageSlug: z.string().optional(),
  notes: z.string().max(500, "Catatan maksimal 500 karakter.").optional(),
});

export type ReservationActionResult =
  | {
      success: true;
      code: string;
      customerName: string;
      reservedFor: string;
      guestCount: number;
      packageName: string | null;
      whatsappUrl: string;
    }
  | {
      success: false;
      error: string;
      fieldErrors?: Record<string, string>;
    };

export async function createReservationAction(formData: FormData): Promise<ReservationActionResult> {
  const raw = {
    customerName: formData.get("customerName"),
    customerPhone: formData.get("customerPhone"),
    customerEmail: formData.get("customerEmail") || undefined,
    guestCount: formData.get("guestCount"),
    reservedFor: formData.get("reservedFor"),
    packageSlug: formData.get("packageSlug") || undefined,
    notes: formData.get("notes") || undefined,
  };

  const parsed = reservationActionSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0]?.toString() || "form";
      fieldErrors[field] = issue.message;
    }
    return {
      success: false,
      error: "Data yang dimasukkan belum lengkap atau tidak valid.",
      fieldErrors,
    };
  }

  const { customerName, customerPhone, customerEmail, guestCount, reservedFor, packageSlug, notes } = parsed.data;

  // Generate unique booking reference code e.g. PRJ-VIP-7492
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const code = `PRJ-VIP-${randomSuffix}`;

  try {
    let tableId: number | undefined;
    let packageName: string | null = null;

    if (packageSlug) {
      const vipPkg = await db.vipPackage.findUnique({
        where: { slug: packageSlug },
        include: { tables: { where: { isActive: true }, take: 1 } },
      });
      if (vipPkg) {
        packageName = vipPkg.name;
        if (vipPkg.tables.length > 0) {
          tableId = vipPkg.tables[0].id;
        }
      }
    }

    const reservationDate = new Date(reservedFor);

    await db.reservation.create({
      data: {
        code,
        customerName,
        customerPhone,
        customerEmail: customerEmail || null,
        guestCount,
        reservedFor: reservationDate,
        notes: notes || null,
        tableId: tableId ?? null,
        status: "PENDING",
      },
    });

    const dateFormatted = reservationDate.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const message = encodeURIComponent(
      `Halo Prajalinks Ponorogo, saya telah mengirim reservasi meja online melalui website:\n\n` +
        `• Kode Booking: *${code}*\n` +
        `• Nama: *${customerName}*\n` +
        `• Tanggal: *${dateFormatted}*\n` +
        `• Jumlah Tamu: *${guestCount} Orang*\n` +
        (packageName ? `• Pilihan Paket: *${packageName}*\n` : "") +
        `\nMohon konfirmasi ketersediaan meja VIP untuk kunjungan kami. Terima kasih!`,
    );

    const whatsappUrl = `https://wa.me/6285151951806?text=${message}`;

    return {
      success: true,
      code,
      customerName,
      reservedFor: dateFormatted,
      guestCount,
      packageName,
      whatsappUrl,
    };
  } catch (err) {
    console.error("Gagal membuat reservasi:", err);
    return {
      success: false,
      error: "Terjadi gangguan saat memproses reservasi. Silakan coba lagi atau hubungi langsung via WhatsApp.",
    };
  }
}
