import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Coffee Orders ☕",
  description: "Submit and track coffee orders with your friends",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-foam">
        <header className="sticky top-0 z-50 bg-milk border-b border-cream">
          <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link
              href="/"
              className="text-espresso font-bold text-lg tracking-tight hover:text-roast transition-colors"
            >
              ☕ Coffee
            </Link>
            <nav className="flex items-center gap-1">
              <Link
                href="/"
                className="px-4 py-1.5 rounded-full text-sm font-medium text-coffee hover:bg-cream hover:text-espresso transition-colors"
              >
                Order
              </Link>
              <Link
                href="/orders"
                className="px-4 py-1.5 rounded-full text-sm font-medium text-coffee hover:bg-cream hover:text-espresso transition-colors"
              >
                Board
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
