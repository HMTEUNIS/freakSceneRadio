"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { BroadcastEpisode } from "@/types/broadcast";
import { streamUrlForEpisode } from "@/lib/audio-path";

export type NowPlaying = {
  episode: BroadcastEpisode;
  showName: string;
  showSlug: string;
  src: string;
};

type PlayerContextValue = {
  nowPlaying: NowPlaying | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  play: (
    episode: BroadcastEpisode,
    meta: { showName: string; showSlug: string },
  ) => void;
  toggle: () => void;
  pause: () => void;
  seek: (seconds: number) => void;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const play = useCallback(
    (episode: BroadcastEpisode, meta: { showName: string; showSlug: string }) => {
      const src = streamUrlForEpisode(episode);
      setNowPlaying({ episode, showName: meta.showName, showSlug: meta.showSlug, src });
    },
    [],
  );

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !nowPlaying) return;
    el.src = nowPlaying.src;
    el.play().catch(() => setIsPlaying(false));
  }, [nowPlaying]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const toggle = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, []);

  const seek = useCallback((seconds: number) => {
    const el = audioRef.current;
    if (!el) return;
    const max = Number.isFinite(el.duration) ? el.duration : seconds;
    el.currentTime = Math.max(0, Math.min(seconds, max));
  }, []);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTime = () => setCurrentTime(el.currentTime);
    const onDur = () => setDuration(el.duration || 0);
    const onEnded = () => setIsPlaying(false);

    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("durationchange", onDur);
    el.addEventListener("loadedmetadata", onDur);
    el.addEventListener("ended", onEnded);

    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("durationchange", onDur);
      el.removeEventListener("loadedmetadata", onDur);
      el.removeEventListener("ended", onEnded);
    };
  }, []);

  const value: PlayerContextValue = {
    nowPlaying,
    isPlaying,
    currentTime,
    duration,
    play,
    toggle,
    pause,
    seek,
  };

  return (
    <PlayerContext.Provider value={value}>
      <audio ref={audioRef} className="hidden" preload="metadata" />
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer(): PlayerContextValue {
  const ctx = useContext(PlayerContext);
  if (!ctx) {
    throw new Error("usePlayer must be used within PlayerProvider");
  }
  return ctx;
}
