/** Host record joined or embedded from your DB */
export type BroadcastHost = {
  id?: string;
  name: string;
  /** optional blurb or image URL for show pages */
  tagline?: string;
  avatarUrl?: string;
};

/** One playable episode; `file` is the path/filename on the VPS if it differs from id */
export type BroadcastEpisode = {
  id: string;
  title: string;
  /** Relative path under AUDIO_FILES_BASE_URL, e.g. `holly/s01e02.mp3` */
  file?: string;
};

/** Row shape you described from the broadcasts table / API */
export type Broadcast = {
  showname: string;
  /** If your API provides a stable slug, use it; otherwise we derive from showname */
  slug?: string;
  host: BroadcastHost;
  episodes: BroadcastEpisode[];
};
