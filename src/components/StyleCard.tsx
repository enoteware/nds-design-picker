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
    <div
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer h-64"
      onClick={() => {
        window.location.href = `/preview/${style.slug}`;
      }}
    >
      {/* Iframe thumbnail (covers entire card) */}
      <div className="absolute inset-0 bg-muted">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-muted">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
          </div>
        )}
        <iframe
          src={style.previewUrl}
          title={`${style.name} preview`}
          className="pointer-events-none h-[1280px] w-[1280px] origin-top-left"
          style={{ transform: "scale(0.25)", transformOrigin: "top left" }}
          onLoad={() => setLoaded(true)}
          loading="lazy"
          sandbox="allow-same-origin"
        />
      </div>

      {/* Overlay gradient for readability */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

      {/* Card content floating at the bottom */}
      <div className="relative mt-auto flex items-center justify-between gap-3 px-4 py-3 z-10">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-white">
            {style.name}
          </h3>
          <span className="text-xs text-white/70">
            View preview &rarr;
          </span>
        </div>
      </div>
    </div>
  );
}
