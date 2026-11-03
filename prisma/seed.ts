// Seed script: roles, permissions, super admin (from env), sample settings, DJs, events, VIP packages and menu.
// Upgraded with authentic luxury photography URLs from Unsplash.
import { PrismaClient, EventStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  ALL_PERMISSIONS,
  ROLE_DESCRIPTIONS,
  ROLE_NAMES,
  ROLE_PERMISSIONS,
} from "../src/lib/permissions";

const prisma = new PrismaClient();

const DAY = 24 * 60 * 60 * 1000;

/** Builds a Date at a given Jakarta (UTC+7) local hour, `offsetDays` from today. */
function jakartaDate(offsetDays: number, hour: number): Date {
  const now = new Date();
  const jakartaNow = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  const base = Date.UTC(jakartaNow.getUTCFullYear(), jakartaNow.getUTCMonth(), jakartaNow.getUTCDate());
  return new Date(base + offsetDays * DAY + (hour - 7) * 60 * 60 * 1000);
}

async function seedAccess() {
  for (const code of ALL_PERMISSIONS) {
    await prisma.permission.upsert({ where: { code }, update: {}, create: { code, description: code } });
  }
  for (const name of ROLE_NAMES) {
    const role = await prisma.role.upsert({
      where: { name },
      update: { description: ROLE_DESCRIPTIONS[name] },
      create: { name, description: ROLE_DESCRIPTIONS[name] },
    });
    for (const code of ROLE_PERMISSIONS[name]) {
      const permission = await prisma.permission.findUniqueOrThrow({ where: { code } });
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: permission.id } },
        update: {},
        create: { roleId: role.id, permissionId: permission.id },
      });
    }
  }
}

async function seedSuperAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env before seeding.");
  }
  if (password.length < 10) {
    throw new Error("ADMIN_PASSWORD must be at least 10 characters.");
  }
  const role = await prisma.role.findUniqueOrThrow({ where: { name: "SUPER_ADMIN" } });
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, roleId: role.id, isActive: true },
    create: { name: "Super Admin", email, passwordHash, roleId: role.id },
  });
}

async function seedSettings() {
  const settings: Record<string, string> = {
    site_name: "Prajalinks",
    whatsapp_number: "6285151951806",
    address: "Jl. HOS Cokroaminoto No. 88, Ponorogo, Jawa Timur 63411",
    opening_hours: JSON.stringify([
      { day: "Senin - Kamis", hours: "18.00 - 01.00 WIB" },
      { day: "Jumat - Sabtu", hours: "19.00 - 03.00 WIB" },
      { day: "Minggu", hours: "18.00 - 00.00 WIB" },
    ]),
    instagram_url: "https://instagram.com/prajalinks",
    facebook_url: "",
    tiktok_url: "",
    youtube_url: "",
    maps_embed_url: "https://www.google.com/maps?q=Ponorogo,+Jawa+Timur,+Indonesia&output=embed",
    about_intro:
      "Prajalinks merupakan destinasi diskotik & premium nightlife lounge terdepan di Ponorogo, Jawa Timur. Menggabungkan kemegahan tata suara arena, sorotan lampu panggung spektakuler, serta kurasi DJ dan perayaan malam tak tertandingi.",
    about_history:
      "Didirikan untuk menghidupkan kembali euforia pesta dansa sejati dengan standar modern kelas dunia di Ponorogo, Prajalinks hadir sebagai pusat hiburan malam paling dinamis di kawasan Jawa Timur. Sejak dentuman bass pertamanya, Prajalinks menjadi magnet bagi para pecinta musik elektronik, pesta berkelas, dan perayaan eksklusif.",
    about_concept:
      "Dengan konsep High-Energy Diskotik & VIP Lounge, Prajalinks memadukan lantai dansa bergemuruh dengan zona sofa VIP yang nyaman dan eksklusif di jantung kota Ponorogo. Diperkuat teknologi lighting cerdas, visual panggung imersif, dan tata suara kustom bertaraf internasional.",
    facilities: JSON.stringify([
      "Tata suara berkekuatan tinggi berstandar arena konser dunia",
      "Sofa VIP privat dengan layanan Dedicated Host & Butler",
      "Lounge santai berpendingin udara dan bebas asap rokok",
      "Layanan parkir valet aman dan area parkir privat luas",
      "Sistem keamanan profesional dan staf berstandar hospitality",
      "Kurasi menu gastronomi malam dan mocktail artisan",
    ]),
  };
  for (const [key, value] of Object.entries(settings)) {
    await prisma.websiteSetting.upsert({ where: { key }, update: { value }, create: { key, value } });
  }
}

async function seedDjs() {
  const djs = [
    {
      slug: "dj-aurora",
      name: "DJ Aurora",
      genre: "Progressive House, Melodic Techno",
      biography:
        "Dikenal dengan set melodik yang membangun atmosfer mendalam dan emosional, DJ Aurora telah tampil di berbagai panggung festival musik prestisius Asia Tenggara.",
      photoUrl:
        "https://images.unsplash.com/photo-1563841930606-67e2bce48b78?auto=format&fit=crop&w=900&q=80",
      instagram: "https://instagram.com/prajalinks",
      spotify: "https://open.spotify.com/",
    },
    {
      slug: "dj-kobra",
      name: "DJ Kobra",
      genre: "Peak Time Techno, Big Room",
      biography:
        "Menyuguhkan dentuman bass bertenaga dan transisi dinamis, DJ Kobra menguasai panggung malam puncak dengan energi yang memukau lantai dansa.",
      photoUrl:
        "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?auto=format&fit=crop&w=900&q=80",
      instagram: "https://instagram.com/prajalinks",
      youtube: "https://youtube.com/@prajalinks",
    },
    {
      slug: "dj-senja",
      name: "DJ Senja",
      genre: "Nu-Disco, Deep House, Afro House",
      biography:
        "Meramu elemen disko klasik dengan ritme kontemporer yang hangat, set DJ Senja adalah pengantar sempurna menuju malam yang elegan.",
      photoUrl:
        "https://images.unsplash.com/photo-1516873240891-4bf014598ab4?auto=format&fit=crop&w=900&q=80",
      instagram: "https://instagram.com/prajalinks",
      spotify: "https://open.spotify.com/",
    },
  ];
  for (const dj of djs) {
    await prisma.dj.upsert({ where: { slug: dj.slug }, update: dj, create: dj });
  }
}

async function seedEvents() {
  const events = [
    {
      slug: "malam-neon-disko",
      title: "Velvet Midnight: Symphony of Beats",
      description:
        "Malam perayaan utama akhir pekan dengan tata pencahayaan panggung elegan, visual atmosferik, dan penampilan kolaborasi dari dua DJ unggulan.",
      posterUrl:
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
      status: EventStatus.UPCOMING,
      startsAt: jakartaDate(7, 21),
      endsAt: jakartaDate(8, 3),
      guestStars: "Special Live Vocalist: Trio Gemintang",
      djs: ["dj-senja", "dj-aurora"],
      tickets: [
        { name: "General Admission", price: 200000, quota: 300 },
        { name: "Early Bird", price: 150000, quota: 100 },
      ],
    },
    {
      slug: "electric-friday",
      title: "Prajalinks Friday: Electric Resonance",
      description:
        "Jumat malam spektakuler dengan hentakan melodic house dan peak-time techno yang imersif di lantai dansa diskotik utama.",
      posterUrl:
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
      status: EventStatus.UPCOMING,
      startsAt: jakartaDate(14, 21),
      endsAt: jakartaDate(15, 3),
      guestStars: null,
      djs: ["dj-kobra", "dj-aurora"],
      tickets: [
        { name: "General Admission", price: 250000, quota: 400 },
        { name: "Fast Track Access", price: 350000, quota: 80 },
      ],
    },
    {
      slug: "sabtu-sinar-bulan",
      title: "Saturday Prestige: Golden Hour Session",
      description:
        "Sesi istimewa malam ini yang menghadirkan seleksi lagu disko dan house terbaik, ditemani minuman mocktail artisan dan atmosfer lounge eksklusif.",
      posterUrl:
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
      status: EventStatus.ONGOING,
      startsAt: jakartaDate(0, 20),
      endsAt: jakartaDate(1, 3),
      guestStars: "Special Guest Saxophonist",
      djs: ["dj-kobra", "dj-senja"],
      tickets: [{ name: "General Admission", price: 250000, quota: 350 }],
    },
    {
      slug: "retro-night-vol-1",
      title: "Retro Reverie: Classic Era Archive",
      description:
        "Arsip dokumentasi perayaan malam retro dengan koleksi piringan hitam klasik dan nuansa hangat masa keemasan disko.",
      posterUrl:
        "https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&w=1200&q=80",
      status: EventStatus.COMPLETED,
      startsAt: jakartaDate(-21, 21),
      endsAt: jakartaDate(-20, 2),
      guestStars: null,
      djs: ["dj-senja"],
      tickets: [{ name: "General Admission", price: 175000, quota: 250 }],
    },
  ];

  for (const { djs, tickets, ...data } of events) {
    const event = await prisma.event.upsert({
      where: { slug: data.slug },
      update: data,
      create: data,
    });
    for (const [index, slug] of djs.entries()) {
      const dj = await prisma.dj.findUniqueOrThrow({ where: { slug } });
      await prisma.eventDj.upsert({
        where: { eventId_djId: { eventId: event.id, djId: dj.id } },
        update: { sortOrder: index },
        create: { eventId: event.id, djId: dj.id, sortOrder: index },
      });
    }
    await prisma.ticketCategory.deleteMany({ where: { eventId: event.id, bookings: { none: {} } } });
    for (const t of tickets) {
      const exists = await prisma.ticketCategory.findFirst({ where: { eventId: event.id, name: t.name } });
      if (!exists) await prisma.ticketCategory.create({ data: { ...t, eventId: event.id } });
    }
  }
}

async function seedVip() {
  const packages = [
    {
      slug: "vip-silver",
      name: "Silver Lounge Suite",
      description:
        "Sofa semi-privat nyaman dengan sudut pandang langsung ke lantai dansa, ideal untuk pertemuan intim atau perayaan lingkaran dekat.",
      facilities: [
        "Meja lounge privat berkapasitas 6 tamu",
        "2 botol premium non-alcoholic sparkling",
        "Pilihan finger food & truffle platter",
        "Dedicated Host & layanan meja khusus",
        "Priority VIP entrance & valet parking",
      ],
      maxCapacity: 6,
      price: 3500000,
      photoUrl:
        "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1000&q=80",
      sortOrder: 1,
    },
    {
      slug: "vip-gold",
      name: "Gold Royal Booth",
      description:
        "Bilik sofa velvet eksklusif di area terdepan panggung dengan privasi tinggi, kenyamanan paripurna, dan layanan concierge khusus.",
      facilities: [
        "Sofa U-shape luas berkapasitas 10 tamu",
        "4 botol artisan mocktail & botanical infusions",
        "Gourmet culinary sharing platter",
        "Dedicated Personal Butler sepanjang malam",
        "Akses jalur cepat VIP tanpa antrean & 2 tiket valet",
        "Pengaturan dekorasi personal atas permintaan",
      ],
      maxCapacity: 10,
      price: 6500000,
      photoUrl:
        "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=1000&q=80",
      sortOrder: 2,
    },
    {
      slug: "vip-diamond",
      name: "The Presidential Diamond Suite",
      description:
        "Kemewahan ruang paling bergengsi di Prajalinks. Ruang perjamuan privat di lantai mezanin dengan balkon khusus menghadap panggung DJ dan lantai dansa.",
      facilities: [
        "Private VIP Suite mezanin berkapasitas 16 tamu",
        "8 botol signature artisan beverages & sparkling",
        "Full-course gourmet dining menu oleh Chef Eksekutif",
        "2 Dedicated Butler privat & Head Sommelier",
        "Pintu masuk privat eksklusif dengan lift khusus",
        "Kamar rias privat & fasilitas kamar mandi mewah",
      ],
      maxCapacity: 16,
      price: 15000000,
      photoUrl:
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80",
      sortOrder: 3,
    },
  ];
  for (const p of packages) {
    await prisma.vipPackage.upsert({ where: { slug: p.slug }, update: p, create: p });
  }
}

async function seedMenu() {
  const categories = [
    {
      slug: "makanan",
      name: "Gastronomi Malam",
      sortOrder: 1,
      items: [
        {
          name: "Wagyu Beef Sliders",
          description: "Tiga burger mini dengan patty wagyu MB7, caramelized onions, smoked cheddar, dan brioche panggang.",
          price: 110000,
          photoUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
        },
        {
          name: "Crispy Calamari & Truffle Aioli",
          description: "Cumi goreng tepung renyah dengan bumbu lada garam togarashi dan saus aioli truffle hitam.",
          price: 85000,
          photoUrl: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80",
        },
        {
          name: "Parmesan Truffle Fries",
          description: "Kentang goreng potongan ganda dengan minyak truffle murni, taburan keju parmigiano reggiano, dan peterseli segar.",
          price: 65000,
          photoUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        },
      ],
    },
    {
      slug: "minuman-non-alkohol",
      name: "Artisan Mocktails & Botanicals",
      sortOrder: 2,
      items: [
        {
          name: "Velvet Burgundy Spritz",
          description: "Red grape reduction, sirup delima organik, air mawar, dan sparkling water berkarbonasi lembut.",
          price: 58000,
          photoUrl: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80",
        },
        {
          name: "Champagne Gold Elixir",
          description: "Seduhan teh putih jarum perak, sari persik putih, lemon meyer, dan hiasan edible gold leaf 24k.",
          price: 65000,
          photoUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80",
        },
        {
          name: "Smoked Yuzu Highball",
          description: "Jus yuzu Jepang, sirup agave panggang, sentuhan rosemary asap, dan soda premium.",
          price: 55000,
          isAvailable: true,
          photoUrl: "https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80",
        },
      ],
    },
  ];
  for (const { items, ...cat } of categories) {
    const category = await prisma.menuCategory.upsert({ where: { slug: cat.slug }, update: cat, create: cat });
    for (const [index, item] of items.entries()) {
      const existing = await prisma.menuItem.findFirst({ where: { categoryId: category.id, name: item.name } });
      const data = { ...item, categoryId: category.id, sortOrder: index };
      if (existing) await prisma.menuItem.update({ where: { id: existing.id }, data });
      else await prisma.menuItem.create({ data });
    }
  }
}

async function seedGallery() {
  const photos = [
    {
      title: "Main Dancefloor & Acoustics",
      imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
      sortOrder: 1,
    },
    {
      title: "VIP Velvet Booths",
      imageUrl: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=1200&q=80",
      sortOrder: 2,
    },
    {
      title: "Cocktail & Lounge Bar",
      imageUrl: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80",
      sortOrder: 3,
    },
    {
      title: "DJ Stage Lighting & Atmosphere",
      imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
      sortOrder: 4,
    },
    {
      title: "Private Mezzanine Balcony",
      imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80",
      sortOrder: 5,
    },
    {
      title: "Signature Gastronomy",
      imageUrl: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=80",
      sortOrder: 6,
    },
  ];

  for (const photo of photos) {
    const existing = await prisma.gallery.findFirst({ where: { title: photo.title } });
    if (existing) {
      await prisma.gallery.update({ where: { id: existing.id }, data: photo });
    } else {
      await prisma.gallery.create({ data: { ...photo, isPublished: true } });
    }
  }
}

async function seedActivity() {
  const count = await prisma.activityLog.count({ where: { action: "SEED" } });
  if (count === 0) {
    await prisma.activityLog.create({
      data: { action: "SEED", entity: "System", detail: "Data awal berhasil dibuat" },
    });
  }
}

async function main() {
  await seedAccess();
  await seedSuperAdmin();
  await seedSettings();
  await seedDjs();
  await seedEvents();
  await seedVip();
  await seedMenu();
  await seedGallery();
  await seedActivity();
  console.log("Seed selesai.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
