"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PlayerProvider } from "@/context/player-context";
import { PersistentPlayer } from "@/components/persistent-player";

const links = [
  { href: "/", label: "Home" },
  { href: "/archive", label: "Archive" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <PlayerProvider>
      <div className="relative z-10 flex min-h-full flex-col pb-28">
        <header className="border-b-2 border-[var(--lime)] bg-black px-4 py-3">
          <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4">
            <Link
              href="/"
              className="block shrink-0 outline-offset-4 hover:opacity-90 focus-visible:opacity-90"
            >
              <Image
                src="/shit_logo.png"
                alt="Freakscene"
                width={200}
                height={50}
                className="h-8 w-auto sm:h-10"
                priority
                style={{ imageRendering: "pixelated" }}
              />
              <span className="font-mono text-lg font-bold uppercase tracking-[0.18em] text-[var(--lime)] hover:underline">(((((( RADIO ))))))</span>
            </Link>
            <NavLinks />
          </div>
        </header>
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">{children}</main>
      </div>
      <PersistentPlayer />
    </PlayerProvider>
  );
}

function NavLinks() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-6 font-mono text-sm uppercase tracking-wider">
      {links.map(({ href, label }) => {
        const active = pathname === href || (href !== "/" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className={
              active
                ? "text-white underline decoration-[var(--lime)] decoration-2 underline-offset-4"
                : "text-zinc-400 hover:text-[var(--lime)]"
            }
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
