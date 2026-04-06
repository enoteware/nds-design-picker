export interface DesignStyle {
  slug: string;
  name: string;
  previewUrl: string;
  darkPreviewUrl: string;
  designMdUrl: string;
}

const BASE = "https://awesome-design-md-nine.vercel.app";

const STYLE_SLUGS = [
  "airbnb",
  "airtable",
  "apple",
  "bmw",
  "cal",
  "claude",
  "clay",
  "clickhouse",
  "cohere",
  "coinbase",
  "composio",
  "cursor",
  "elevenlabs",
  "expo",
  "figma",
  "framer",
  "hashicorp",
  "ibm",
  "intercom",
  "kraken",
  "linear.app",
  "lovable",
  "minimax",
  "mintlify",
  "miro",
  "mistral.ai",
  "mongodb",
  "notion",
  "nvidia",
  "ollama",
  "opencode.ai",
  "pinterest",
  "posthog",
  "raycast",
  "replicate",
  "resend",
  "revolut",
  "runwayml",
  "sanity",
  "sentry",
  "spacex",
  "spotify",
  "stripe",
  "supabase",
  "superhuman",
  "together.ai",
  "uber",
  "vercel",
  "voltagent",
  "warp",
  "webflow",
  "wise",
  "x.ai",
  "zapier",
];

function formatName(slug: string): string {
  const special: Record<string, string> = {
    "linear.app": "Linear",
    "mistral.ai": "Mistral AI",
    "opencode.ai": "OpenCode",
    "together.ai": "Together AI",
    "x.ai": "xAI",
    bmw: "BMW",
    ibm: "IBM",
    cal: "Cal.com",
    elevenlabs: "ElevenLabs",
    clickhouse: "ClickHouse",
    posthog: "PostHog",
    runwayml: "RunwayML",
    spacex: "SpaceX",
    webflow: "Webflow",
  };
  if (special[slug]) return special[slug];
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

export function getStyles(): DesignStyle[] {
  return STYLE_SLUGS.map((slug) => ({
    slug,
    name: formatName(slug),
    previewUrl: `${BASE}/design-md/${slug}/preview.html`,
    darkPreviewUrl: `${BASE}/design-md/${slug}/preview-dark.html`,
    designMdUrl: `${BASE}/design-md/${slug}/DESIGN.md`,
  }));
}
