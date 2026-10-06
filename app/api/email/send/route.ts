import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { FROM_EMAIL, FROM_NAME } from "@/lib/email/sendOutreach";

// One-off personal email from derrest@cityactivations.com (admin only — protected by middleware).
// Body: { to: string | string[], cc?: string | string[], subject: string, text: string }
const EMAIL_RE = /^[^\s@<>"]+@[^\s@<>"]+\.[a-z]{2,}$/i;
const list = (v: unknown) => (Array.isArray(v) ? v : v ? [v] : []).map(x => String(x).trim()).filter(Boolean);

export async function POST(req: NextRequest) {
  const { to, cc, subject, text } = await req.json().catch(() => ({}));
  const toList = list(to), ccList = list(cc);
  if (!toList.length || !subject || !text) return NextResponse.json({ error: "to, subject and text are required" }, { status: 400 });
  const bad = [...toList, ...ccList].filter(e => !EMAIL_RE.test(e));
  if (bad.length) return NextResponse.json({ error: `Invalid address: ${bad.join(", ")}` }, { status: 400 });

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: toList,
    ...(ccList.length ? { cc: ccList } : {}),
    replyTo: FROM_EMAIL,
    subject: String(subject),
    text: String(text),
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 502 });
  return NextResponse.json({ sent: true, id: data?.id });
}
