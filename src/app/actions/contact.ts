"use server";

import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/constants";

export interface LeadInput {
  email: string;
  phone?: string;
  message?: string;
  lotId?: string;
  lotName?: string;
  lotDate?: string;
  source?: string;
}

export interface LeadResult {
  ok: boolean;
  error?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitLead(input: LeadInput): Promise<LeadResult> {
  const email = (input.email || "").trim();
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  const phone = (input.phone || "").trim();
  const message = (input.message || "").trim();
  const lotLine = input.lotName ? `${input.lotName}${input.lotDate ? ` (${input.lotDate})` : ""}` : "—";
  const lotLink = input.lotDate ? `${SITE_URL}/lot/${input.lotDate}` : "";
  const source = input.source || "unknown";

  const subject = input.lotName
    ? `New lead: ${input.lotName}`
    : `New lead from ${SITE_NAME}`;

  const lines = [
    `New inquiry from ${SITE_NAME}`,
    "",
    `Email:    ${email}`,
    `Phone:    ${phone || "—"}`,
    `Lot:      ${lotLine}`,
    lotLink ? `Listing:  ${lotLink}` : null,
    `Source:   ${source}`,
    "",
    "Message:",
    message || "(none)",
  ].filter(Boolean);
  const body = lines.join("\n");

  const apiKey = process.env.RESEND_API_KEY;
  const fromAddress = process.env.LEAD_FROM_EMAIL || `leads@${new URL(SITE_URL).hostname}`;

  if (!apiKey) {
    console.log("[lead] RESEND_API_KEY not set — logging only.\n" + body);
    return { ok: true };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${SITE_NAME} <${fromAddress}>`,
        to: [CONTACT_EMAIL],
        reply_to: email,
        subject,
        text: body,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("[lead] Resend error", res.status, detail);
      return { ok: false, error: "We couldn't send your message. Please try again or email us directly." };
    }

    return { ok: true };
  } catch (err) {
    console.error("[lead] Send failed", err);
    return { ok: false, error: "We couldn't send your message. Please try again or email us directly." };
  }
}
