import type { MetadataRoute } from "next";

const SITE = "https://cityactivations.com";

// Public pages only — /admin and /api are excluded (see robots.ts)
const ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/lake-austin-lights", priority: 0.9, changeFrequency: "weekly" },
  { path: "/live", priority: 0.8, changeFrequency: "weekly" },
  { path: "/events/urban-slide", priority: 0.8, changeFrequency: "monthly" },
  { path: "/services", priority: 0.7, changeFrequency: "monthly" },
  { path: "/events", priority: 0.6, changeFrequency: "monthly" },
  { path: "/seasonal", priority: 0.6, changeFrequency: "monthly" },
  { path: "/permanent", priority: 0.6, changeFrequency: "monthly" },
  ...["5k-marathons", "color-runs", "conventions", "fundraisers", "mud-runs", "trade-shows", "triathlons"].map(s => ({ path: `/events/${s}`, priority: 0.5, changeFrequency: "monthly" as const })),
  ...["crawfish-festival", "light-shows", "movies-on-the-lake"].map(s => ({ path: `/seasonal/${s}`, priority: 0.5, changeFrequency: "monthly" as const })),
  ...["boat-rentals", "donut-boat-rentals", "paddle-boards", "things-to-do-austin"].map(s => ({ path: `/permanent/${s}`, priority: 0.5, changeFrequency: "monthly" as const })),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map(r => ({ url: `${SITE}${r.path}`, lastModified: now, changeFrequency: r.changeFrequency, priority: r.priority }));
}
