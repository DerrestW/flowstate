// Single source of truth for Lake Austin Lights details (used by the SEO page).
// Source: lakeaustinlights.com (pulled Oct 5, 2026).
// Photos are copies stored in our own Supabase "media" bucket (lakeaustinlights.com blocks hotlinking).

export const LAKE_AUSTIN_LIGHTS = {
  slug: "lake-austin-lights",
  name: "Lake Austin Lights",
  tagline: "A Texas holiday tradition on the water.",
  datesLabel: "Nov 20, 2026 – Jan 3, 2027",
  startDate: "2026-11-20",
  endDate: "2027-01-03",
  onSale: "Tickets go on sale Tuesday, October 6 at 6 a.m. CT.",
  duration: "45-minute cruise",
  arrive: "Please arrive at least 20 minutes before your cruise.",
  venue: "Hula Hut",
  street: "3825 Lake Austin Blvd",
  city: "Austin",
  region: "TX",
  postal: "78703",
  phone: "(512) 893-3131",
  email: "lakeaustinlights@gmail.com",
  website: "https://lakeaustinlights.com/",
  ticketsUrl: "https://fareharbor.com/embeds/book/lakeaustinlights/items/757985/?ref=Website&flow=1700945&full-items=yes",
  privateUrl: "https://fareharbor.com/embeds/book/lakeaustinlights/items/758042/?ref=Website&flow=1700945&full-items=yes",
  description:
    "Board at Hula Hut on Lake Austin for a 45-minute holiday boat cruise through two 80-foot floating tunnels of lights, past spectacular 3D LED holiday displays, and watch a synchronized dance of 20 illuminated boats — with unlimited hot cocoa and cozy blankets on board.",
  included: [
    "Cruise through two 80-foot floating tunnels of lights",
    "Spectacular 3D LED holiday displays",
    "A synchronized dance of 20 illuminated boats",
    "Unlimited hot cocoa",
    "Cozy blankets on board",
  ],
  tickets: [
    { name: "Adults (ages 14+)", price: "$34.95", amount: 34.95 },
    { name: "Children (ages 4–13)", price: "$19.95", amount: 19.95 },
    { name: "Ages 0–3", price: "Free", amount: 0 },
  ],
  privateBoats: [
    { name: "Up to 14 guests", price: "$400", amount: 400 },
    { name: "Up to 16 guests", price: "$450", amount: 450 },
    { name: "Up to 22 guests", price: "$650", amount: 650 },
    { name: "Up to 25 guests", price: "$700", amount: 700 },
  ],
  heroImage: "https://fmwbvekforzsfgyzfaau.supabase.co/storage/v1/object/public/media/1791238900620-lake-austin-lights-hero.jpg",
  gallery: [
    { src: "https://fmwbvekforzsfgyzfaau.supabase.co/storage/v1/object/public/media/1791238905498-lake-austin-lights-signed-tunnel.jpg", alt: "Illuminated Lake Austin Lights tunnel with a holiday boat and colorful reflections" },
    { src: "https://fmwbvekforzsfgyzfaau.supabase.co/storage/v1/object/public/media/1791238908577-lake-austin-lights-tunnel-perspective.jpg", alt: "The floating light tunnel viewed straight on, its colors reflected in Lake Austin" },
    { src: "https://fmwbvekforzsfgyzfaau.supabase.co/storage/v1/object/public/media/1791238912034-lake-austin-lights-keep-austin-weird.jpg", alt: "Illuminated Texas musician and armadillo display reflected in the lake" },
    { src: "https://fmwbvekforzsfgyzfaau.supabase.co/storage/v1/object/public/media/1791238888932-lake-austin-lights-polar-bear.jpg", alt: "Glowing polar bear holiday display reflected on dark water" },
  ],
};
