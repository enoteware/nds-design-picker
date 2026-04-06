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
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              NDS Design Picker
            </h1>
            <p className="text-sm text-muted-foreground">
              Select a foundational design system. We&apos;ll customize it with your logo, colors, and branding.
            </p>
          </div>
          <input
            type="text"
            placeholder="Search styles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-56 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
        <p className="mb-6 text-sm text-muted-foreground">
          {filtered.length} design {filtered.length === 1 ? "style" : "styles"}{" "}
          available
        </p>

        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
      </main>
    </>
  );
}
