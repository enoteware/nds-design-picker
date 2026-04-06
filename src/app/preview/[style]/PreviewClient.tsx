"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import type { DesignStyle } from "@/lib/styles";
import { SubmitForm } from "@/components/SubmitForm";

export function PreviewClient({ styleObj }: { styleObj: DesignStyle }) {
  const [showForm, setShowForm] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [brandColors, setBrandColors] = useState<string[]>([]);
  const [analyzingLogo, setAnalyzingLogo] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  async function handleLogoUpload(file: File) {
    setAnalyzingLogo(true);
    setLogoError(null);
    setBrandColors([]);

    // Show logo preview
    const reader = new FileReader();
    reader.onload = (e) => setLogoPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    try {
      const body = new FormData();
      body.append("logo", file);

      const res = await fetch("/api/analyze-logo", { method: "POST", body });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setBrandColors(data.colors);

      // Send colors to iframe
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          { type: "UPDATE_THEME", colors: data.colors },
          "*"
        );
      }
    } catch (err) {
      setLogoError(
        err instanceof Error ? err.message : "Failed to analyze logo"
      );
    } finally {
      setAnalyzingLogo(false);
    }
  }

  function handleColorClick(color: string) {
    navigator.clipboard.writeText(color);
  }

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

      {/* Brand Customization Bar */}
      <div className="shrink-0 border-b border-border bg-card px-4 md:px-6 py-3">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Customize with your Brand
            </span>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleLogoUpload(file);
              }}
            />
            <button
              onClick={() => logoInputRef.current?.click()}
              disabled={analyzingLogo}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50 cursor-pointer"
            >
              {analyzingLogo ? (
                <span className="flex items-center gap-1.5">
                  <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Analyzing...
                </span>
              ) : logoPreview ? (
                "Change Logo"
              ) : (
                "Upload Logo"
              )}
            </button>
          </div>

          {logoPreview && (
            <div className="h-8 w-8 rounded border border-border bg-background p-0.5 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoPreview} alt="Uploaded logo" className="h-full w-full object-contain" />
            </div>
          )}

          {brandColors.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">Suggested Brand Tokens:</span>
              <div className="flex items-center gap-1.5">
                {brandColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorClick(color)}
                    className="group relative flex items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1 transition-colors hover:bg-muted cursor-pointer"
                    title={`Click to copy ${color}`}
                  >
                    <span
                      className="h-4 w-4 rounded-sm border border-black/10 shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-xs font-mono text-foreground">{color}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {logoError && (
            <p className="text-xs text-red-500">{logoError}</p>
          )}
        </div>
      </div>

      {/* Iframe container */}
      <main className="flex-1 w-full relative">
        <iframe
          ref={iframeRef}
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
