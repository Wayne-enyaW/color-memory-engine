import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Color Memory Engine", template: "%s · Color Memory Engine" },
  description: "A self-hostable engine for deterministic visual color-memory games.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Color Memory Engine",
    description: "Deterministic rounds, perceptual scoring, and licensed content packs.",
    type: "website",
    url: "/",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <Link className="brand" href="/" aria-label="Color Memory Engine home">
            <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
            <span>Color Memory Engine</span>
          </Link>
          <nav aria-label="Primary navigation">
            <Link href="/#play">Play</Link>
            <Link href="/#packs">Content packs</Link>
            <Link href="/#docs">Docs</Link>
            <a href="https://github.com/Wayne-enyaW/color-memory-engine">GitHub ↗</a>
          </nav>
        </header>
        {children}
        <footer className="site-footer">
          <p>Open source under MIT. Content licenses are documented per pack.</p>
          <div><a href="https://github.com/Wayne-enyaW/color-memory-engine/blob/main/SECURITY.md">Security</a><a href="https://github.com/Wayne-enyaW/color-memory-engine/blob/main/CONTRIBUTING.md">Contributing</a></div>
        </footer>
      </body>
    </html>
  );
}
