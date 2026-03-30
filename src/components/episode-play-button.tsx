"use client";

import type { BroadcastEpisode } from "@/types/broadcast";
import { usePlayer } from "@/context/player-context";

type Props = {
  episode: BroadcastEpisode;
  showName: string;
  showSlug: string;
};

export function EpisodePlayButton({ episode, showName, showSlug }: Props) {
  const { play, nowPlaying, isPlaying, toggle } = usePlayer();
  const currentId = nowPlaying?.episode.id;
  const thisTrack = currentId === episode.id;

  return (
    <button
      type="button"
      onClick={() => {
        if (thisTrack) {
          toggle();
        } else {
          play(episode, { showName, showSlug });
        }
      }}
      className="inline-flex items-center border border-[var(--lime)] bg-black px-3 py-1 font-mono text-xs uppercase tracking-wide text-[var(--lime)] hover:bg-[var(--lime)] hover:text-black"
    >
      {thisTrack ? (isPlaying ? "Pause" : "Play") : "Listen"}
    </button>
  );
}
