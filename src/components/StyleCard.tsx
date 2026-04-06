"use client";

import { useState } from "react";
import type { DesignStyle } from "@/lib/styles";

export function StyleCard({
  style,
}: {
  style: DesignStyle;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5">
      {/* Iframe thumbnail */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
          </div>
        )}
        <iframe
          src={style.previewUrl}
          title={`${style.name} preview`}
          className="pointer-events-none h-[900px] w-[1200px] origin-top-left"
          style={{ transform: "scale(0.25)", transformOrigin: "top left" }}
          onLoad={() => setLoaded(true)}
          loading="lazy"
          sandbox="allow-same-origin"
        />
      </div>

      {/* Card content */}
      <div className="flex flex-1 items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-card-foreground">
            {style.name}
          </h3>
          <a
            href={`/preview/${style.slug}`}
            className="text-xs text-muted-foreground hover:text-accent transition-colors"
          >
            View full preview &rarr;
          </a>
        </div>
        <button
          onClick={() => {
            window.location.href = `/preview/${style.slug}`;
          }}
          className="shrink-0 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground transition-colors hover:bg-accent/90 cursor-pointer"
        >
          Choose
        </button>
      </div>
    </div>
  );
}
