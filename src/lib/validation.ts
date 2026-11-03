import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ error: "Email wajib diisi." })
    .trim()
    .min(1, "Email wajib diisi.")
    .max(190, "Email terlalu panjang.")
    .email("Format email tidak valid."),
  password: z
    .string({ error: "Kata sandi wajib diisi." })
    .min(1, "Kata sandi wajib diisi.")
    .max(200, "Kata sandi terlalu panjang."),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const reservationSchema = z.object({
  customerName: z
    .string({ error: "Nama lengkap wajib diisi." })
    .trim()
    .min(3, "Nama minimal 3 karakter.")
    .max(120, "Nama terlalu panjang."),
  customerPhone: z
    .string({ error: "Nomor WhatsApp wajib diisi." })
    .trim()
    .min(9, "Nomor telepon minimal 9 digit.")
    .max(20, "Nomor telepon maksimal 20 digit.")
    .regex(/^[0-9+() -]+$/, "Format nomor telepon tidak valid."),
  customerEmail: z
    .string()
    .trim()
    .email("Format email tidak valid.")
    .optional()
    .or(z.literal("")),
  guestCount: z.coerce
    .number({ error: "Jumlah tamu wajib diisi." })
    .min(1, "Minimal 1 tamu.")
    .max(50, "Maksimal 50 tamu."),
  reservedFor: z
    .string({ error: "Tanggal kunjungan wajib dipilih." })
    .min(1, "Tanggal kunjungan wajib dipilih."),
  packageSlug: z.string().optional(),
  notes: z.string().max(500, "Catatan maksimal 500 karakter.").optional(),
});

export type ReservationInput = z.infer<typeof reservationSchema>;
