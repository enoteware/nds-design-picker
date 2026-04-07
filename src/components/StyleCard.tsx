"use client";

import { useState } from "react";
import type { DesignStyle } from "@/lib/styles";

export function StyleCard({
  style,
  index = 0,
}: {
  style: DesignStyle;
  index?: number;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="animate-scale-in group relative flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 hover:border-border cursor-pointer"
      style={{
        animationDelay: `${Math.min(index * 50, 500)}ms`,
        height: "280px",
      }}
      onClick={() => {
        window.location.href = `/preview/${style.slug}`;
      }}
    >
      {/* Iframe thumbnail */}
      <div className="absolute inset-0 bg-muted">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-muted">
            <div className="animate-shimmer h-full w-full" />
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

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-foreground/0 transition-colors duration-300 group-hover:bg-foreground/5" />

      {/* Bottom gradient */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none transition-opacity duration-300" />

      {/* Card content */}
      <div className="relative mt-auto flex items-center justify-between gap-3 px-4 py-3.5 z-10">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-white leading-tight">
            {style.name}
          </h3>
          <span className="text-[11px] text-white/60 font-medium tracking-wide group-hover:text-white/80 transition-colors">
            View preview &rarr;
          </span>
        </div>
      </div>
    </div>
  );
}
