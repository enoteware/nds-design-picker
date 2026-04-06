import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server misconfigured: missing OPENAI_API_KEY" },
      { status: 500 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("logo") as File | null;

  if (!file) {
    return NextResponse.json(
      { error: "No logo file provided" },
      { status: 400 }
    );
  }

  // Convert file to base64 data URL
  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");
  const mimeType = file.type || "image/png";
  const dataUrl = `data:${mimeType};base64,${base64}`;

  const openai = new OpenAI({ apiKey });

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: 'Analyze this logo image. Extract exactly 3 dominant brand colors from it. Return ONLY a JSON array of 3 hex color codes, e.g. ["#FF5733","#1A1A2E","#E94560"]. No other text.',
          },
          {
            type: "image_url",
            image_url: { url: dataUrl },
          },
        ],
      },
    ],
    max_tokens: 100,
  });

  const raw = response.choices[0]?.message?.content?.trim() ?? "[]";

  // Parse the JSON array from the response
  let colors: string[];
  try {
    const parsed = JSON.parse(raw);
    if (
      !Array.isArray(parsed) ||
      !parsed.every((c: unknown) => typeof c === "string" && /^#[0-9a-fA-F]{6}$/.test(c))
    ) {
      throw new Error("Invalid format");
    }
    colors = parsed.slice(0, 3);
  } catch {
    // Try to extract hex codes from the response text as fallback
    const matches = raw.match(/#[0-9a-fA-F]{6}/g);
    colors = matches ? matches.slice(0, 3) : [];
  }

  if (colors.length === 0) {
    return NextResponse.json(
      { error: "Could not extract colors from logo" },
      { status: 422 }
    );
  }

  return NextResponse.json({ colors });
}
