"use client";

import Link from "next/link";
import { usePlayer } from "@/context/player-context";

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function PersistentPlayer() {
  const {
    nowPlaying,
    isPlaying,
    currentTime,
    duration,
    toggle,
    seek,
  } = usePlayer();

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t-2 border-[var(--lime)] bg-black/95 px-3 py-2 text-white shadow-[0_-4px_0_0_var(--lime)]"
      role="region"
      aria-label="Now playing"
    >
      {!nowPlaying ? (
        <p className="font-mono text-xs tracking-wide text-[var(--lime-muted)]">
          select an episode — audio stays on while you browse
        </p>
      ) : (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <div className="min-w-0 flex-1">
            <p className="truncate font-mono text-xs uppercase tracking-[0.2em] text-[var(--lime)]">
              now playing
            </p>
            <p className="truncate text-sm font-bold">{nowPlaying.episode.title}</p>
            <p className="truncate font-mono text-xs text-zinc-400">
              {nowPlaying.showName}
              {" · "}
              <Link
                href={`/shows/${nowPlaying.showSlug}`}
                className="underline decoration-[var(--lime)] underline-offset-2 hover:text-[var(--lime)]"
              >
                show page
              </Link>
            </p>
          </div>
          <div className="flex flex-1 flex-col gap-1 sm:max-w-md">
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.01}
              value={Math.min(currentTime, duration || 0)}
              onChange={(e) => seek(Number(e.target.value))}
              className="accent-[var(--lime)]"
              aria-label="Seek"
            />
            <div className="flex justify-between font-mono text-[10px] text-zinc-500">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={toggle}
            className="shrink-0 border-2 border-[var(--lime)] bg-black px-4 py-2 font-mono text-sm font-bold uppercase tracking-wider text-[var(--lime)] hover:bg-[var(--lime)] hover:text-black"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
        </div>
      )}
    </div>
  );
}
