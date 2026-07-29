import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { contacts } = await req.json();
    if (!contacts?.length) return NextResponse.json({ error: "No contacts" }, { status: 400 });

    const { data: existing } = await sb.from("prospects").select("email");
    const existingEmails = new Set((existing || []).map((e: any) => e.email?.toLowerCase()));

    const newContacts = contacts
      .filter((c: any) => c.email && c.email.includes("@") && !existingEmails.has(c.email.toLowerCase()))
      .map((c: any) => ({
        name: c.name || "Unknown",
        email: c.email.toLowerCase().trim(),
        title: c.title || "",
        department: c.department || "",
        city: c.city || "",
        state: c.state || "",
        source_url: c.linkedin || c.source_url || "",
        email_verified: c.email_verified || "unknown",
        email_status: "uncontacted",
        notes: c.notes || c.note || "",
      }));

    if (!newContacts.length) {
      return NextResponse.json({ success: true, imported: 0, skipped: contacts.length, message: "All contacts already exist." });
    }

    let imported = 0;
    for (let i = 0; i < newContacts.length; i += 100) {
      const { error } = await sb.from("prospects").insert(newContacts.slice(i, i + 100));
      if (!error) imported += Math.min(100, newContacts.length - i);
    }

    return NextResponse.json({ success: true, imported, skipped: contacts.length - imported, total: contacts.length });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
