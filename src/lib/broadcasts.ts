import type { Broadcast } from "@/types/broadcast";
import { slugify } from "@/lib/slug";
import broadcastsData from "@/data/broadcasts.json";

function withSlugs(shows: Broadcast[]): Broadcast[] {
  return shows.map((b) => ({
    ...b,
    slug: b.slug?.length ? b.slug : slugify(b.showname),
  }));
}

const STATIC = withSlugs(broadcastsData as Broadcast[]);

/**
 * Show archive data. Edit `src/data/broadcasts.json` or replace this module to load from your own API / DB.
 */
export async function getBroadcasts(): Promise<Broadcast[]> {
  return STATIC;
}

export async function getBroadcastBySlug(slug: string): Promise<Broadcast | null> {
  const shows = await getBroadcasts();
  return shows.find((s) => (s.slug ?? slugify(s.showname)) === slug) ?? null;
}
