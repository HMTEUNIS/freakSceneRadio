import Link from "next/link";
import { notFound } from "next/navigation";
import { getBroadcastBySlug, getBroadcasts } from "@/lib/broadcasts";
import { EpisodePlayButton } from "@/components/episode-play-button";
import { slugify } from "@/lib/slug";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const shows = await getBroadcasts();
  return shows.map((s) => ({ slug: s.slug ?? slugify(s.showname) }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const show = await getBroadcastBySlug(slug);
  if (!show) return { title: "Show not found" };
  return { title: `${show.showname} · Freakscene Radio` };
}

export default async function ShowPage({ params }: Props) {
  const { slug } = await params;
  const show = await getBroadcastBySlug(slug);
  if (!show) notFound();

  const resolvedSlug = show.slug ?? slugify(show.showname);

  return (
    <div className="space-y-8">
      <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">
        <Link href="/archive" className="text-[var(--lime)] hover:underline">
          archive
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-400">{show.showname}</span>
      </p>

      <header className="retro-box max-w-2xl p-6">
        <h1 className="retro-heading text-2xl">{show.showname}</h1>
        <div className="mt-4 border-t border-zinc-800 pt-4">
          <p className="font-mono text-sm text-[var(--lime)]">Host</p>
          <p className="text-lg font-bold text-white">{show.host.name}</p>
          {show.host.tagline ? (
            <p className="mt-1 text-sm text-zinc-400">{show.host.tagline}</p>
          ) : null}
        </div>
      </header>

      <section>
        <h2 className="retro-heading mb-4 text-lg">Episodes</h2>
        <ol className="space-y-2">
          {show.episodes.map((ep, i) => (
            <li
              key={ep.id}
              className="flex flex-wrap items-center justify-between gap-3 border border-zinc-800 bg-black/50 px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <span className="font-mono text-xs text-zinc-600">{String(i + 1).padStart(2, "0")}</span>
                <span className="ml-2 font-bold text-zinc-100">{ep.title}</span>
                <span className="mt-1 block font-mono text-[10px] uppercase tracking-wide text-zinc-600">
                  id: {ep.id}
                </span>
              </div>
              <EpisodePlayButton
                episode={ep}
                showName={show.showname}
                showSlug={resolvedSlug}
              />
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
