import Link from "next/link";
import { getBroadcasts } from "@/lib/broadcasts";
import { slugify } from "@/lib/slug";

export const metadata = {
  title: "Archive · Freakscene Radio",
};

export default async function ArchivePage() {
  const shows = await getBroadcasts();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="retro-heading text-2xl">Show archive</h1>
        <p className="mt-2 max-w-xl text-zinc-400">
          Pick a program to see every episode we have behind the glass. Playback stays live in
          the persistent player.
        </p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2">
        {shows.map((show) => {
          const slug = show.slug ?? slugify(show.showname);
          return (
            <li key={slug}>
              <Link
                href={`/shows/${slug}`}
                className="retro-box block h-full p-5 transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
              >
                <span className="block text-lg font-bold text-white">{show.showname}</span>
                <span className="mt-2 block font-mono text-sm text-[var(--lime)]">
                  {show.episodes.length} episode{show.episodes.length === 1 ? "" : "s"}
                </span>
                <span className="mt-1 block font-mono text-xs text-zinc-500">
                  {show.host.name}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
