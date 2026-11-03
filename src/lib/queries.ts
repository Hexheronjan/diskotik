// Server-side data access for public pages. Only public-safe fields are selected: never emails or customer data.
import { cache } from "react";
import { db } from "@/lib/db";

export interface OpeningHour {
  day: string;
  hours: string;
}

export interface SiteSettings {
  siteName: string;
  whatsappNumber: string;
  address: string;
  openingHours: OpeningHour[];
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
  youtubeUrl: string;
  mapsEmbedUrl: string;
  aboutIntro: string;
  aboutHistory: string;
  aboutConcept: string;
  facilities: string[];
  whatsappLink: string;
}

function parseJsonArray<T>(value: string | undefined, fallback: T[]): T[] {
  if (!value) return fallback;
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
}

/** Only https URLs are used for links and embeds. */
function safeHttpsUrl(value: string | undefined): string {
  if (!value) return "";
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : "";
  } catch {
    return "";
  }
}

/** Only Google Maps embeds are allowed inside the iframe. */
function safeMapsUrl(value: string | undefined): string {
  const url = safeHttpsUrl(value);
  if (!url) return "";
  const host = new URL(url).hostname;
  return host === "www.google.com" || host === "maps.google.com" ? url : "";
}

export const getSettings = cache(async (): Promise<SiteSettings> => {
  const rows = await db.websiteSetting.findMany();
  const map = new Map(rows.map((r) => [r.key, r.value]));
  const digits = (map.get("whatsapp_number") ?? "").replace(/\D/g, "");
  return {
    siteName: map.get("site_name") ?? "Klub Malam",
    whatsappNumber: digits,
    address: map.get("address") ?? "",
    openingHours: parseJsonArray<OpeningHour>(map.get("opening_hours"), []),
    instagramUrl: safeHttpsUrl(map.get("instagram_url")),
    facebookUrl: safeHttpsUrl(map.get("facebook_url")),
    tiktokUrl: safeHttpsUrl(map.get("tiktok_url")),
    youtubeUrl: safeHttpsUrl(map.get("youtube_url")),
    mapsEmbedUrl: safeMapsUrl(map.get("maps_embed_url")),
    aboutIntro: map.get("about_intro") ?? "",
    aboutHistory: map.get("about_history") ?? "",
    aboutConcept: map.get("about_concept") ?? "",
    facilities: parseJsonArray<string>(map.get("facilities"), []),
    whatsappLink: digits ? `https://wa.me/${digits}` : "",
  };
});

const eventCard = {
  id: true,
  slug: true,
  title: true,
  posterUrl: true,
  startsAt: true,
  status: true,
  guestStars: true,
} as const;

export const getEventsByStatus = cache(async () => {
  const where = { isPublished: true };
  const [upcoming, ongoing, completed] = await Promise.all([
    db.event.findMany({ where: { ...where, status: "UPCOMING" }, orderBy: { startsAt: "asc" }, select: eventCard }),
    db.event.findMany({ where: { ...where, status: "ONGOING" }, orderBy: { startsAt: "asc" }, select: eventCard }),
    db.event.findMany({ where: { ...where, status: "COMPLETED" }, orderBy: { startsAt: "desc" }, select: eventCard }),
  ]);
  return { upcoming, ongoing, completed };
});

export const getUpcomingPreview = cache((take: number) =>
  db.event.findMany({
    where: { isPublished: true, status: { in: ["UPCOMING", "ONGOING"] } },
    orderBy: [{ status: "desc" }, { startsAt: "asc" }],
    take,
    select: {
      ...eventCard,
      description: true,
      endsAt: true,
      djs: {
        orderBy: { sortOrder: "asc" },
        select: {
          dj: {
            select: {
              slug: true,
              name: true,
              photoUrl: true,
            },
          },
        },
      },
      tickets: {
        where: { isActive: true },
        orderBy: { price: "asc" },
        take: 1,
        select: { price: true },
      },
    },
  }),
);

export type UpcomingEventItem = Awaited<ReturnType<typeof getUpcomingPreview>>[number];

export const getEventBySlug = cache((slug: string) =>
  db.event.findFirst({
    where: { slug, isPublished: true },
    select: {
      ...eventCard,
      description: true,
      endsAt: true,
      djs: {
        orderBy: { sortOrder: "asc" },
        select: { dj: { select: { slug: true, name: true, genre: true, photoUrl: true, isActive: true } } },
      },
      tickets: {
        where: { isActive: true },
        orderBy: { price: "asc" },
        select: { id: true, name: true, price: true },
      },
    },
  }),
);

const djCard = {
  id: true,
  slug: true,
  name: true,
  genre: true,
  photoUrl: true,
  biography: true,
  instagram: true,
  spotify: true,
} as const;

export type DjItem = Awaited<ReturnType<typeof getDjs>>[number];

export const getDjs = cache((take?: number) =>
  db.dj.findMany({ where: { isActive: true }, orderBy: { name: "asc" }, take, select: djCard }),
);

export const getDjBySlug = cache((slug: string) =>
  db.dj.findFirst({
    where: { slug, isActive: true },
    select: {
      ...djCard,
      biography: true,
      instagram: true,
      spotify: true,
      youtube: true,
      events: {
        where: { event: { isPublished: true, status: { in: ["UPCOMING", "ONGOING"] } } },
        orderBy: { event: { startsAt: "asc" } },
        select: { event: { select: { slug: true, title: true, startsAt: true, status: true } } },
      },
    },
  }),
);

export const getMenu = cache(() =>
  db.menuCategory.findMany({
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      name: true,
      items: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        select: { id: true, name: true, description: true, price: true, photoUrl: true, isAvailable: true },
      },
    },
  }),
);

export const getVipPackages = cache(async () => {
  const rows = await db.vipPackage.findMany({
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      facilities: true,
      maxCapacity: true,
      price: true,
      photoUrl: true,
      isAvailable: true,
    },
  });
  return rows.map((r) => ({
    ...r,
    facilities: Array.isArray(r.facilities) ? r.facilities.filter((f): f is string => typeof f === "string") : [],
  }));
});

export const getGalleryPreview = cache(() =>
  db.gallery.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
    take: 9,
    select: { id: true, title: true, imageUrl: true },
  }),
);
