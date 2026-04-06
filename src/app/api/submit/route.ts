import { NextResponse } from "next/server";

const INVOI_BASE = "https://app.noteware.dev/api/agent";

export async function POST(request: Request) {
  const apiKey = process.env.INVOI_AGENT_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server misconfigured: missing API key" },
      { status: 500 }
    );
  }

  const formData = await request.formData();
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const company = formData.get("company") as string;
  const notes = formData.get("notes") as string;
  const logo = formData.get("logo") as File | null;

  if (!firstName || !lastName || !email || !company) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Step 1: Create client
  const clientRes = await fetch(`${INVOI_BASE}/clients`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      client_type: "organization",
      first_name: firstName,
      last_name: lastName,
      company_name: company,
      email,
      notes: notes || undefined,
    }),
  });

  if (!clientRes.ok) {
    const err = await clientRes.text();
    return NextResponse.json(
      { error: `Failed to create client: ${err}` },
      { status: clientRes.status }
    );
  }

  const client = await clientRes.json();
  const clientId = client.id || client.data?.id;

  // Step 2: Upload logo if provided
  if (logo && clientId) {
    const logoForm = new FormData();
    logoForm.append("logo", logo);

    const logoRes = await fetch(`${INVOI_BASE}/clients/${clientId}/logo`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: logoForm,
    });

    if (!logoRes.ok) {
      // Client created but logo failed — still return success with warning
      return NextResponse.json({
        success: true,
        clientId,
        warning: "Client created but logo upload failed",
      });
    }
  }

  return NextResponse.json({ success: true, clientId });
}
