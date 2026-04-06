"use client";

import { useState, useRef } from "react";
import type { DesignStyle } from "@/lib/styles";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  notes: string;
}

export function SubmitForm({
  style,
  onClose,
}: {
  style: DesignStyle;
  onClose: () => void;
}) {
  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    notes: "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function update(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    try {
      const body = new FormData();
      body.append("firstName", form.firstName);
      body.append("lastName", form.lastName);
      body.append("email", form.email);
      body.append("company", form.company);
      body.append(
        "notes",
        `Design style: ${style.name} (${style.slug})\n\n${form.notes}`
      );
      if (logoFile) {
        body.append("logo", logoFile);
      }

      const res = await fetch("/api/submit", { method: "POST", body });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Submission failed");
      }

      setResult({ ok: true, message: "Submitted successfully!" });
    } catch (err) {
      setResult({
        ok: false,
        message: err instanceof Error ? err.message : "Something went wrong",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-card-foreground">
              Get started with {style.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              Fill in your details and we&apos;ll set up your project.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
            aria-label="Close"
          >
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {result?.ok ? (
          <div className="rounded-lg bg-emerald-50 p-4 text-center">
            <p className="font-medium text-emerald-700">{result.message}</p>
            <button
              onClick={onClose}
              className="mt-3 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90 cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-card-foreground">
                  First Name *
                </span>
                <input
                  type="text"
                  required
                  value={form.firstName}
                  onChange={(e) => update("firstName", e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Jane"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-card-foreground">
                  Last Name *
                </span>
                <input
                  type="text"
                  required
                  value={form.lastName}
                  onChange={(e) => update("lastName", e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Smith"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-1 block text-xs font-medium text-card-foreground">
                Email *
              </span>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="jane@company.com"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-medium text-card-foreground">
                Company *
              </span>
              <input
                type="text"
                required
                value={form.company}
                onChange={(e) => update("company", e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Acme Inc."
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-medium text-card-foreground">
                Notes
              </span>
              <textarea
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                placeholder="Any details about your project..."
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-medium text-card-foreground">
                Logo Upload
              </span>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
                className="w-full text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-card-foreground file:cursor-pointer hover:file:bg-border"
              />
            </label>

            {result && !result.ok && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {result.message}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-accent py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
