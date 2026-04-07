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
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  async function handleLogoUpload(file: File) {
    setAnalyzingLogo(true);
    setLogoError(null);
    setBrandColors([]);
    setAnalysisProgress(0);

    // Show logo preview
    const reader = new FileReader();
    reader.onload = (e) => setLogoPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    // Simulate progress while waiting for API
    const progressInterval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      const body = new FormData();
      body.append("logo", file);

      const res = await fetch("/api/analyze-logo", { method: "POST", body });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setAnalysisProgress(100);
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
      clearInterval(progressInterval);
      setAnalyzingLogo(false);
    }
  }

  function handleColorClick(color: string) {
    navigator.clipboard.writeText(color);
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* Sticky App Bar — blurred */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-xl px-4 md:px-6 z-10">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            &larr; Back
          </Link>
          <div className="hidden sm:block h-4 w-px bg-border" />
          <h1 className="text-sm font-semibold text-foreground capitalize truncate max-w-[150px] sm:max-w-xs">
            {styleObj.name}
          </h1>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center rounded-lg bg-muted p-0.5">
            <button
              onClick={() => setTheme("light")}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                theme === "light"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Light
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                theme === "dark"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Dark
            </button>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="rounded-lg bg-foreground text-background px-4 py-1.5 text-xs font-medium transition-all hover:bg-foreground/90 hover:shadow-md cursor-pointer"
          >
            Use this foundation
          </button>
        </div>
      </header>

      {/* Brand Customization Bar */}
      <div className="shrink-0 border-b border-border/50 bg-card/50 backdrop-blur-sm px-4 md:px-6 py-2.5">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Brand
            </span>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleLogoUpload(file);
              }}
            />
            <button
              onClick={() => logoInputRef.current?.click()}
              disabled={analyzingLogo}
              className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-all hover:bg-muted hover:shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {analyzingLogo
                ? "Extracting..."
                : logoPreview
                  ? "Change Logo"
                  : "Upload Logo"}
            </button>
          </div>

          {/* Analysis progress bar */}
          {analyzingLogo && (
            <div className="flex items-center gap-4 animate-fade-in">
              <div className="relative h-7 w-7 rounded-md border border-border bg-card p-0.5 shrink-0 shadow-sm overflow-hidden">
                {logoPreview && (
                  <>
                    <img
                      src={logoPreview}
                      alt="Analyzing..."
                      className="h-full w-full object-contain opacity-50 blur-[0.5px]"
                    />
                    <div className="absolute inset-x-0 h-[2px] bg-accent/80 shadow-[0_0_8px_var(--accent)] animate-scanning z-10" />
                  </>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <div className="h-1 w-32 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${analysisProgress}%` }}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold uppercase tracking-tighter text-accent/80 animate-pulse">
                    Analyzing Spectrum
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground tabular-nums">
                    {Math.round(analysisProgress)}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {logoPreview && !analyzingLogo && (
            <div className="relative h-7 w-7">
              <div className="absolute inset-0 rounded-full border border-accent/30 animate-pulse-ring" />
              <div className="relative h-7 w-7 rounded-md border border-border bg-card p-0.5 shrink-0 shadow-sm animate-scale-in z-10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoPreview}
                  alt="Uploaded logo"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
          )}

          {brandColors.length > 0 && !analyzingLogo && (
            <div className="flex items-center gap-2 animate-fade-in">
              <div className="h-4 w-px bg-border" />
              <span className="text-[11px] text-muted-foreground">
                Extracted:
              </span>
              <div className="flex items-center gap-1">
                {brandColors.slice(0, 1).map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorClick(color)}
                    className="group/color flex items-center gap-1.5 rounded-md border border-border bg-card px-2 py-0.5 transition-all hover:shadow-sm cursor-pointer"
                    title={`Click to copy ${color}`}
                  >
                    <span
                      className="h-3 w-3 rounded-sm border border-black/10 shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-[11px] font-mono text-foreground">
                      {color}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {logoError && (
            <p className="text-[11px] text-red-500 animate-fade-in">
              {logoError}
            </p>
          )}
        </div>
      </div>

      {/* Iframe container */}
      <main className="flex-1 w-full relative bg-muted/20">
        <iframe
          ref={iframeRef}
          src={
            theme === "light" ? styleObj.previewUrl : styleObj.darkPreviewUrl
          }
          className="absolute inset-0 w-full h-full border-0 bg-transparent transition-opacity duration-1000 ease-in-out"
          title={`${styleObj.name} preview`}
          onLoad={(e) => {
            const target = e.target as HTMLIFrameElement;
            target.style.opacity = "1";
          }}
          style={{ opacity: 0 }}
        />
      </main>

      {/* Modal */}
      {showForm && (
        <SubmitForm style={styleObj} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}
