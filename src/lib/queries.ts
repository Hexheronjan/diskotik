// Server-side data access for public pages.
// Includes transparent fallback to static club data when DATABASE_URL is unreachable (e.g. Vercel deployment without MySQL).
import { cache } from "react";
import { db } from "@/lib/db";
import mockData from "@/lib/mockData.json";

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
  let rows: { key: string; value: string }[] = [];
  try {
    rows = await db.websiteSetting.findMany();
  } catch (err) {
    console.warn("DB offline, using mockData for settings:", (err as Error).message);
    rows = mockData.settings;
  }

  const map = new Map(rows.map((r) => [r.key, r.value]));
  const digits = (map.get("whatsapp_number") ?? "").replace(/\D/g, "");
  return {
    siteName: map.get("site_name") ?? "Prajalinks",
    whatsappNumber: digits,
    address: map.get("address") ?? "Jl. HOS Cokroaminoto No. 88, Ponorogo, Jawa Timur 63411",
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
    whatsappLink: digits ? `https://wa.me/${digits}` : "https://wa.me/6285151951806",
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
  try {
    const where = { isPublished: true };
    const [upcoming, ongoing, completed] = await Promise.all([
      db.event.findMany({ where: { ...where, status: "UPCOMING" }, orderBy: { startsAt: "asc" }, select: eventCard }),
      db.event.findMany({ where: { ...where, status: "ONGOING" }, orderBy: { startsAt: "asc" }, select: eventCard }),
      db.event.findMany({ where: { ...where, status: "COMPLETED" }, orderBy: { startsAt: "desc" }, select: eventCard }),
    ]);
    return { upcoming, ongoing, completed };
  } catch {
    const events = mockData.events.map((e) => ({
      ...e,
      startsAt: new Date(e.startsAt),
      status: e.status as "UPCOMING" | "ONGOING" | "COMPLETED",
    }));
    return {
      upcoming: events.filter((e) => e.status === "UPCOMING"),
      ongoing: events.filter((e) => e.status === "ONGOING"),
      completed: events.filter((e) => e.status === "COMPLETED"),
    };
  }
});

export const getUpcomingPreview = cache(async (take: number) => {
  try {
    return await db.event.findMany({
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
    });
  } catch {
    return mockData.events
      .filter((e) => e.status === "UPCOMING" || e.status === "ONGOING")
      .slice(0, take)
      .map((e) => ({
        id: e.id,
        slug: e.slug,
        title: e.title,
        posterUrl: e.posterUrl,
        startsAt: new Date(e.startsAt),
        status: e.status as "UPCOMING" | "ONGOING" | "COMPLETED",
        guestStars: e.guestStars,
        description: e.description,
        endsAt: e.endsAt ? new Date(e.endsAt) : null,
        djs: e.djs.map((d) => ({
          dj: {
            slug: d.dj.slug,
            name: d.dj.name,
            photoUrl: d.dj.photoUrl,
          },
        })),
        tickets: e.tickets.slice(0, 1).map((t) => ({ price: t.price })),
      }));
  }
});

export type UpcomingEventItem = Awaited<ReturnType<typeof getUpcomingPreview>>[number];

export const getEventBySlug = cache(async (slug: string) => {
  try {
    return await db.event.findFirst({
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
    });
  } catch {
    const found = mockData.events.find((e) => e.slug === slug);
    if (!found) return null;
    return {
      id: found.id,
      slug: found.slug,
      title: found.title,
      posterUrl: found.posterUrl,
      startsAt: new Date(found.startsAt),
      status: found.status as "UPCOMING" | "ONGOING" | "COMPLETED",
      guestStars: found.guestStars,
      description: found.description,
      endsAt: found.endsAt ? new Date(found.endsAt) : null,
      djs: found.djs.map((d) => ({
        dj: {
          slug: d.dj.slug,
          name: d.dj.name,
          genre: d.dj.genre,
          photoUrl: d.dj.photoUrl,
          isActive: d.dj.isActive,
        },
      })),
      tickets: found.tickets.map((t) => ({
        id: t.id,
        name: t.name,
        price: t.price,
      })),
    };
  }
});

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

export const getDjs = cache(async (take?: number) => {
  try {
    return await db.dj.findMany({ where: { isActive: true }, orderBy: { name: "asc" }, take, select: djCard });
  } catch {
    const list = mockData.djs.map((d) => ({
      id: d.id,
      slug: d.slug,
      name: d.name,
      genre: d.genre,
      photoUrl: d.photoUrl,
      biography: d.biography,
      instagram: d.instagram,
      spotify: d.spotify,
    }));
    return typeof take === "number" ? list.slice(0, take) : list;
  }
});

export const getDjBySlug = cache(async (slug: string) => {
  try {
    return await db.dj.findFirst({
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
    });
  } catch {
    const found = mockData.djs.find((d) => d.slug === slug);
    if (!found) return null;
    return {
      id: found.id,
      slug: found.slug,
      name: found.name,
      genre: found.genre,
      photoUrl: found.photoUrl,
      biography: found.biography,
      instagram: found.instagram,
      spotify: found.spotify,
      youtube: (found as { youtube?: string | null }).youtube ?? null,
      events: (found.events || []).map((e) => ({
        event: {
          slug: e.event.slug,
          title: e.event.title,
          startsAt: new Date(e.event.startsAt),
          status: e.event.status,
        },
      })),
    };
  }
});

export const getMenu = cache(async () => {
  try {
    return await db.menuCategory.findMany({
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
    });
  } catch {
    return mockData.categories.map((c) => ({
      id: c.id,
      name: c.name,
      items: c.items.map((i) => ({
        id: i.id,
        name: i.name,
        description: i.description,
        price: i.price,
        photoUrl: i.photoUrl,
        isAvailable: i.isAvailable,
      })),
    }));
  }
});

export const getVipPackages = cache(async () => {
  try {
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
  } catch {
    return mockData.vips.map((v) => ({
      id: v.id,
      slug: v.slug,
      name: v.name,
      description: v.description,
      facilities: Array.isArray(v.facilities) ? v.facilities.filter((f): f is string => typeof f === "string") : [],
      maxCapacity: v.maxCapacity,
      price: v.price,
      photoUrl: v.photoUrl,
      isAvailable: v.isAvailable,
    }));
  }
});

export const getGalleryPreview = cache(async () => {
  try {
    return await db.gallery.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: "asc" },
      take: 9,
      select: { id: true, title: true, imageUrl: true },
    });
  } catch {
    return mockData.gallery.slice(0, 9).map((g) => ({
      id: g.id,
      title: g.title,
      imageUrl: g.imageUrl,
    }));
  }
});
