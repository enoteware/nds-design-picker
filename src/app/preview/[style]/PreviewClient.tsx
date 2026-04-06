"use client";

import { useState } from "react";
import Link from "next/link";
import type { DesignStyle } from "@/lib/styles";
import { SubmitForm } from "@/components/SubmitForm";

export function PreviewClient({ styleObj }: { styleObj: DesignStyle }) {
  const [showForm, setShowForm] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* Sticky App Bar */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-4 md:px-6 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            &larr; Back
          </Link>
          <div className="hidden sm:block h-6 w-px bg-border" />
          <h1 className="text-base sm:text-lg font-semibold text-card-foreground capitalize truncate max-w-[150px] sm:max-w-xs">Inspired by {styleObj.name}</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center rounded-lg bg-muted p-1">
            <button
              onClick={() => setTheme("light")}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${theme === "light" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              Light
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${theme === "dark" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              Dark
            </button>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90 cursor-pointer"
          >
            Use this foundation
          </button>
        </div>
      </header>

      {/* Iframe container */}
      <main className="flex-1 w-full relative">
        <iframe 
          src={theme === "light" ? styleObj.previewUrl : styleObj.darkPreviewUrl}
          className="absolute inset-0 w-full h-full border-0 bg-background"
          title={`${styleObj.name} preview`}
        />
      </main>

      {/* Modal */}
      {showForm && (
        <SubmitForm style={styleObj} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}
