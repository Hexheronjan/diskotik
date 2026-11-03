# Nocturne Club — Situs Web Klub Malam & Hiburan (Tahap 1)

Situs web bisnis hiburan malam & klub malam profesional yang dibangun menggunakan Next.js (App Router), TypeScript (strict mode), Prisma ORM, MySQL, Three.js, dan Auth.js (NextAuth v5).

---

## Cakupan Tahap 1 (Stage 1 Scope)

### Fitur yang Dibangun
- **Basis Data Lengkap (Prisma ORM & MySQL)**: Skema lengkap 20 model untuk seluruh tahapan agar tahapan selanjutnya hanya menambahkan kode tanpa migrasi destruktif.
- **Data Awal (Seeding)**: Hak akses (roles & permissions), akun Super Admin dari variabel lingkungan, pengaturan situs contoh, 3 DJ, 4 acara (upcoming, ongoing, completed), 3 paket VIP, dan menu makanan serta minuman non-alkohol.
- **Halaman Publik**:
  - `/` (Beranda): Hero 3D (Three.js), deskripsi singkat, jam buka, pratinjau acara, DJ unggulan, bagian VIP, dan peta lokasi Google Maps.
  - `/tentang-kami`: Pengenalan, sejarah, konsep, daftar fasilitas, jam buka, dan galeri foto tempat (kondisi kosong).
  - `/acara`: Daftar acara dikelompokkan berdasarkan status (Sedang Berlangsung, Akan Datang, Telah Selesai).
  - `/acara/[slug]`: Detail acara, poster, tanggal & waktu, bintang tamu, lineup DJ terhubung ke profil DJ, dan daftar harga tiket (hanya tampilan).
  - `/dj`: Daftar seluruh DJ.
  - `/dj/[slug]`: Profil DJ, biografi, genre, tautan media sosial resmi, dan jadwal penampilan mendatang.
  - `/menu`: Kategori dan produk makanan serta minuman non-alkohol dengan harga Rupiah dan badge ketersediaan.
  - `/vip`: Paket VIP dengan fasilitas, kapasitas maksimal, harga, dan ketersediaan.
- **Navigasi & Tata Letak**: Navbar kaca lengket (sticky glass), laci navigasi seluler yang dapat ditutup dengan tombol Esc, footer dengan tautan media sosial, serta tombol melayang WhatsApp (wa.me) dinamis.
- **Autentikasi & Keamanan Staf**:
  - `/masuk`: Formulir masuk khusus staf dengan validasi Zod dan pembatasan percobaan gagal (rate limiting: 5 kali per 15 menit).
  - Sesi berbasis JWT dengan hashing bcryptjs.
  - Proteksi rute `/admin` pada lapisan routing request (Next.js proxy / middleware) dan verifikasi ulang di server layout.
- **Dasbor Admin**:
  - `/admin`: Ringkasan metrik waktu nyata (total acara, acara mendatang, total DJ, menu aktif, total reservasi, total tiket) dan log aktivitas staf terbaru.
  - Fitur keluar (logout).

### Hal yang Belum Dibangun di Tahap 1
- Reservasi meja online & pemilihan denah meja.
- Pembelian & pembayaran tiket online, barcode/QR code tiket.
- Manajemen CRUD galeri, promosi, dan pengaturan lewat UI admin.
- Tidak ada tombol palsu untuk fitur yang belum diimplementasikan.

---

## Asumsi (Assumptions)
1. **Rate Limiting**: Pembatasan percobaan login gagal disimpan di dalam memori proses server (`in-memory`). Status pembatasan akan tereset ketika server di-restart dan tidak dibagikan antar instans multi-server.
2. **Koneksi MySQL**: MySQL 8.0 berjalan secara lokal atau melalui penyedia cloud yang dapat diakses dengan connection string `DATABASE_URL`.
3. **Produk & Legalitas**: Seluruh data contoh menu hanya mencakup makanan dan minuman non-alkohol.
4. **Keamanan URL Eksternal**: Tautan media sosial dan sematan Google Maps diverifikasi hanya mengizinkan protokol HTTPS dan domain Google Maps resmi.

---

## Persyaratan Sistem
- **Node.js**: Versi 20 atau yang lebih baru (disarankan v22+).
- **MySQL**: Versi 8.0 atau MariaDB 10.5+.

---

## Langkah Instalasi & Menjalankan

### 1. Salin Berkas Variabel Lingkungan
Salin berkas `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Isi nilai di dalam `.env`:
- `DATABASE_URL`: URL koneksi MySQL (contoh: `mysql://root:password@localhost:3306/nightclub`).
- `AUTH_SECRET`: Kunci acak untuk enkripsi sesi (bisa dihasilkan via `npx auth secret` atau string acak panjang).
- `ADMIN_EMAIL`: Alamat email Super Admin pertama (misal: `admin@nocturne.club`).
- `ADMIN_PASSWORD`: Kata sandi Super Admin (minimal 10 karakter).
- `NEXT_PUBLIC_SITE_URL`: URL situs web (default: `http://localhost:3000`).

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Validasi & Migrasi Basis Data
Pastikan MySQL sudah berjalan dan database telah dibuat, lalu jalankan:
```bash
npx prisma validate
npx prisma migrate dev --name init
```

### 4. Pengisian Data Awal (Seeding)
```bash
npx prisma db seed
```

### 5. Pemeriksaan Kualitas Kode
```bash
npm run lint
npm run typecheck
npm run build
```

### 6. Menjalankan Server Pengembangan
```bash
npm run dev
```
Buka peramban di [http://localhost:3000](http://localhost:3000). Untuk masuk ke panel staf, kunjungi [http://localhost:3000/masuk](http://localhost:3000/masuk) menggunakan kredensial yang Anda tetapkan pada `.env`.
