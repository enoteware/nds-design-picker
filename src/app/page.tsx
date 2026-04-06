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
      <nav className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-foreground" />
            <span className="font-bold tracking-tight text-foreground">NDS Design</span>
          </div>
          <a href="https://noteware.dev" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            noteware.dev &rarr;
          </a>
        </div>
      </nav>

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 pb-16">
        {/* Framer-style Hero */}
        <div className="flex flex-col items-center justify-center text-center py-24 sm:py-32">
          <div className="inline-flex items-center rounded-full border border-border bg-muted/50 px-3 py-1 text-sm font-medium mb-8">
            <span className="flex h-2 w-2 rounded-full bg-accent mr-2 animate-pulse"></span>
            Now with AI Color Extraction
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground max-w-4xl mb-6">
            The foundation for your next great website.
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            Select a foundational design system inspired by the world&apos;s best tech companies. 
            Upload your logo, and we&apos;ll automatically extract your brand colors and customize the UI to match.
          </p>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="rounded-full bg-foreground text-background px-8 py-3.5 text-base font-semibold hover:bg-foreground/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
            >
              Browse Gallery
            </button>
          </div>
        </div>

        {/* Gallery Section */}
        <div id="gallery" className="scroll-mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Design Gallery
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {filtered.length} foundational {filtered.length === 1 ? "style" : "styles"} available
              </p>
            </div>
            <input
              type="text"
              placeholder="Search styles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring shadow-sm"
            />
          </div>

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((style) => (
              <StyleCard
                key={style.slug}
                style={style}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="py-20 text-center text-muted-foreground">
              No styles match &ldquo;{search}&rdquo;
            </p>
          )}
        </div>
      </main>
    </>
  );
}
