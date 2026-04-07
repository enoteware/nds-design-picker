"use client";

import { useState } from "react";
import { getStyles } from "@/lib/styles";
import { StyleCard } from "@/components/StyleCard";

const styles = getStyles();

export default function Home() {
  const [search, setSearch] = useState("");

  const filtered = styles.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Fixed blurred navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2.5">
            <div className="h-5 w-5 rounded-sm bg-foreground" />
            <span className="text-sm font-semibold tracking-tight text-foreground">
              noteware.dev
            </span>
          </div>
          <a
            href="https://noteware.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            noteware.dev &rarr;
          </a>
        </div>
      </nav>

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 pb-20 pt-14">
        {/* Hero */}
        <div className="flex flex-col items-center justify-center text-center py-24 sm:py-32">
          <div className="animate-fade-in-up inline-flex items-center rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground mb-8 shadow-sm">
            <span className="flex h-1.5 w-1.5 rounded-full bg-accent mr-2 animate-pulse" />
            AI Color Extraction
          </div>
          <h1 className="animate-fade-in-up delay-100 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground max-w-4xl mb-6 leading-[1.08]">
            The foundation for your next great website.
          </h1>
          <p className="animate-fade-in-up delay-200 text-base sm:text-lg text-muted-foreground max-w-xl mb-12 leading-relaxed">
            Select a foundational design system inspired by the world&apos;s best
            tech companies. Upload your logo and we&apos;ll extract your brand
            colors automatically.
          </p>
          <div className="animate-fade-in-up delay-300 flex items-center gap-3">
            <button
              onClick={() => {
                document
                  .getElementById("gallery")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="rounded-full bg-foreground text-background px-7 py-3 text-sm font-medium hover:bg-foreground/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
            >
              Browse Gallery
            </button>
            <a
              href="https://noteware.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-border bg-card px-7 py-3 text-sm font-medium text-foreground transition-all hover:bg-muted hover:shadow-sm cursor-pointer"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Gallery */}
        <div id="gallery" className="scroll-mt-20">
          <div className="animate-fade-in delay-400 flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Design Gallery
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {filtered.length} foundational{" "}
                {filtered.length === 1 ? "style" : "styles"} available
              </p>
            </div>
            <input
              type="text"
              placeholder="Search styles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-56 rounded-lg border border-border bg-card px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 shadow-sm transition-shadow focus:shadow-md"
            />
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((style, i) => (
              <StyleCard key={style.slug} style={style} index={i} />
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="py-20 text-center text-muted-foreground">
              No styles match &ldquo;{search}&rdquo;
            </p>
          )}
        </div>
      </main>

      {/* Minimal footer */}
      <footer className="border-t border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-6 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} noteware.dev
          </span>
          <a
            href="https://noteware.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            noteware.dev
          </a>
        </div>
      </footer>
    </>
  );
}
