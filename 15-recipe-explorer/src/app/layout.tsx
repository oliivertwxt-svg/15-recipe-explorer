import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import HeaderSearch from "@/components/header-search";
import RandomRecipeButton from "@/components/random-recipe-button";
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
  title: "Recipe Explorer",
  description: "Browse recipes by category with TheMealDB.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-3">
            <Link
              href="/"
              className="text-lg font-bold text-zinc-950 hover:text-amber-700"
            >
              Recipe Explorer
            </Link>
            <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
              <HeaderSearch />
              <Link
                href="/favourites"
                className="whitespace-nowrap rounded-xl px-2 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-rose-50 hover:text-rose-700"
              >
                Favourites
              </Link>
              <RandomRecipeButton />
            </div>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
