import { NextRequest, NextResponse } from "next/server";

function resolveUpstream(relativePath: string):
  | { ok: true; url: string }
  | { ok: false; reason: "no_base" | "bad_path" } {
  const base = process.env.AUDIO_FILES_BASE_URL?.replace(/\/$/, "");
  if (!base) return { ok: false, reason: "no_base" };
  const normalized = relativePath.replace(/^\/+/, "").replace(/\0/g, "");
  if (!normalized || normalized.includes("..")) {
    return { ok: false, reason: "bad_path" };
  }
  return { ok: true, url: `${base}/${normalized}` };
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  const { path } = await ctx.params;
  const relative = path.map((segment) => decodeURIComponent(segment)).join("/");
  const resolved = resolveUpstream(relative);

  if (!resolved.ok) {
    const status = resolved.reason === "no_base" ? 503 : 400;
    const error =
      resolved.reason === "no_base"
        ? "AUDIO_FILES_BASE_URL is not set"
        : "Invalid audio path";
    return NextResponse.json({ error }, { status });
  }
  const target = resolved.url;

  const range = req.headers.get("range");
  const upstreamHeaders: HeadersInit = {
    Accept: "audio/*,*/*;q=0.9",
  };
  if (range) {
    upstreamHeaders.Range = range;
  }

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      headers: upstreamHeaders,
      redirect: "follow",
      cache: "no-store",
    });
  } catch (e) {
    console.error("audio proxy fetch error", e);
    return NextResponse.json({ error: "Upstream unreachable" }, { status: 502 });
  }

  if (upstream.status === 404) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!upstream.ok && upstream.status !== 206) {
    return NextResponse.json(
      { error: `Upstream ${upstream.status}` },
      { status: upstream.status >= 500 ? 502 : upstream.status },
    );
  }

  const outHeaders = new Headers();
  const passthrough = [
    "content-type",
    "content-length",
    "content-range",
    "accept-ranges",
    "etag",
    "last-modified",
  ] as const;

  for (const key of passthrough) {
    const v = upstream.headers.get(key);
    if (v) outHeaders.set(key, v);
  }
  if (!outHeaders.has("content-type")) {
    outHeaders.set("content-type", "audio/mpeg");
  }
  if (!outHeaders.has("accept-ranges")) {
    outHeaders.set("accept-ranges", "bytes");
  }

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: outHeaders,
  });
}
