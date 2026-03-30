import Link from "next/link";
import { getBroadcasts } from "@/lib/broadcasts";
import { slugify } from "@/lib/slug";

export default async function Home() {
  const shows = await getBroadcasts();

  return (
    <div className="space-y-10">
      <section className="retro-box max-w-2xl p-6">
        <h1 className="retro-heading mb-3 text-2xl sm:text-3xl">Freakscene Radio</h1>
        <p className="text-zinc-300">
          An independent signal: show archives, episode picks, and a player that sticks with
          you while you click around. Tune from the dock below.
        </p>
        <p className="mt-4 font-mono text-xs uppercase tracking-widest text-[var(--lime-muted)]">
          black · lime · white — add your textures when ready
        </p>
      </section>

      <section>
        <h2 className="retro-heading mb-4 text-lg">On air (archives)</h2>
        <ul className="space-y-3">
          {shows.map((show) => {
            const slug = show.slug ?? slugify(show.showname);
            return (
              <li key={slug} className="retro-box border-zinc-700 p-4 transition-colors hover:border-[var(--lime)]">
                <Link href={`/shows/${slug}`} className="block group">
                  <span className="text-lg font-bold text-white group-hover:text-[var(--lime)]">
                    {show.showname}
                  </span>
                  <span className="mt-1 block font-mono text-xs text-zinc-500">
                    host: {show.host.name}
                    {show.host.tagline ? ` — ${show.host.tagline}` : ""}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="mt-6">
          <Link
            href="/archive"
            className="font-mono text-sm uppercase tracking-wider text-[var(--lime)] underline decoration-2 underline-offset-4 hover:text-white"
          >
            full archive →
          </Link>
        </p>
      </section>
    </div>
  );
}
