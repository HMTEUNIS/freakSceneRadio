import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { SiteBackground } from "@/components/site-background";

export const metadata: Metadata = {
  title: "Freakscene Radio",
  description: "Independent radio — archives, shows, and episodes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-[var(--background)] text-[var(--foreground)] antialiased">
        <SiteBackground />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
