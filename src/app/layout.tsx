
import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Toolio — Useful tools, without the extra steps",
  description:
    "Free online tools for PDFs, images, text and everyday tasks. Simple tools that work in your browser.",
  other: {
  "google-adsense-account": "ca-pub-9283188151940862",
  "google-site-verification": "rXaFnUoB_jrXbnKvvwArVFMOn74-m_evFqC6ZuCM-aM",
},
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="container header-inner">
            <Link href="/" className="brand">
              toolio<span>.</span>
            </Link>
            <nav className="nav" aria-label="Main navigation">
              <Link href="/#tools">All tools</Link>
              <Link href="/#how-it-works">How it works</Link>
            </nav>
          </div>
        </header>

        {children}

        <footer className="footer">
          <div
            className="container"
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <span>© {new Date().getFullYear()} Toolio</span>
            <span>
              Useful tools. Files stay on your device where supported.
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
