import type { BroadcastEpisode } from "@/types/broadcast";

function audioExtension(): string {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_AUDIO_FILE_EXTENSION ?? ".mp3";
  }
  return (
    process.env.AUDIO_FILE_EXTENSION ??
    process.env.NEXT_PUBLIC_AUDIO_FILE_EXTENSION ??
    ".mp3"
  );
}

export function episodeStoragePath(episode: BroadcastEpisode): string {
  const ext = audioExtension();
  if (episode.file?.length) {
    return episode.file.replace(/^\//, "");
  }
  const id = episode.id.trim();
  return id.endsWith(ext) || /\.[a-z0-9]+$/i.test(id) ? id : `${id}${ext}`;
}

export function streamUrlForEpisode(episode: BroadcastEpisode): string {
  const path = episodeStoragePath(episode);
  return `/api/audio/${path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/")}`;
}
