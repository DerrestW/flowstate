import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "derrest@cityactivations.com";
const FROM_NAME = "Derrest Williams | FlowState Experiences";

type Template = "urban_slide" | "destination_marketing" | "media_buying" | "full_funnel" | "follow_up";

function getEmailTemplate(template: Template, contact: any): { subject: string; html: string } {
  const firstName = contact.name?.split(" ")[0] || "there";
  const city = contact.city || "your city";

  const IMG1 = "https://res.cloudinary.com/demo/image/upload/v1/urban-slide-1.jpg";
  const VIDEO_THUMB = "https://img.youtube.com/vi/MWxVJMfFjnA/maxresdefault.jpg";
  const VIDEO_URL = "https://www.youtube.com/watch?v=MWxVJMfFjnA";

  const FOOTER = `
    <div style="background:#F8F6F2;padding:20px 32px;border-radius:0 0 12px 12px;text-align:center;">
      <p style="font-size:11px;color:#999;margin:0;">
        FlowState Experiences · Houston, TX · <a href="https://cityactivations.com" style="color:#2196F3;">cityactivations.com</a> · (713) 376-8521
        <br/><a href="mailto:derrest@cityactivations.com?subject=Unsubscribe" style="color:#999;">Unsubscribe</a>
      </p>
    </div>`;

  const templates: Record<Template, { subject: string; html: string }> = {

    urban_slide: {
      subject: `Bringing a Street Water Slide to ${city} — FlowState Experiences`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;color:#111;">
          <div style="background:linear-gradient(135deg,#0F1623 0%,#1A2338 100%);padding:32px;border-radius:12px 12px 0 0;">
            <p style="color:#2196F3;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 8px;">City Activation Partner</p>
            <h1 style="color:#fff;font-size:28px;font-weight:900;margin:0;line-height:1.1;">WHAT IF YOUR CITY<br/>MADE THE NEWS?</h1>
          </div>

          <div style="padding:32px;background:#fff;border:1px solid #eee;border-top:none;">
            <p style="font-size:15px;color:#333;line-height:1.6;">Hi ${firstName},</p>

            <p style="font-size:15px;color:#333;line-height:1.6;">
              My name is Derrest Williams — I'm the founder of <strong>FlowState Experiences</strong>, and I help cities create the kind of events that get people talking, sharing, and coming back year after year.
            </p>

            <p style="font-size:15px;color:#333;line-height:1.6;">
              I'm reaching out because I'd love to bring <strong>The Urban Slide</strong> to ${city} — a massive street water slide that transforms a city block into the most exciting community event of the summer.
            </p>

            <!-- Photo -->
            <div style="margin:24px 0;border-radius:10px;overflow:hidden;">
              <img src="https://img.youtube.com/vi/MWxVJMfFjnA/maxresdefault.jpg" alt="The Urban Slide" style="width:100%;display:block;"/>
            </div>

            <!-- Video CTA -->
            <div style="text-align:center;margin:0 0 24px;">
              <a href="https://www.youtube.com/watch?v=MWxVJMfFjnA" style="display:inline-block;background:linear-gradient(90deg,#2196F3,#FF6B2B);color:#fff;font-weight:700;font-size:14px;padding:12px 28px;border-radius:100px;text-decoration:none;">▶ Watch the Urban Slide in Action</a>
            </div>

            <div style="background:#F0F7FF;border-left:4px solid #2196F3;padding:20px;margin:24px 0;border-radius:0 8px 8px 0;">
              <p style="font-weight:700;color:#1565C0;margin:0 0 10px;font-size:14px;">What makes it special for ${city}:</p>
              <ul style="color:#333;margin:0;padding-left:20px;font-size:14px;line-height:1.9;">
                <li>Turns a city street into a <strong>400–700 ft water slide</strong></li>
                <li>Brings families, visitors, and local businesses together</li>
                <li>Creates buzz on local news and social media</li>
                <li>Revenue opportunities through ticket sales, sponsorships &amp; grants</li>
                <li>Our team handles full production — setup, staffing, teardown</li>
              </ul>
            </div>

            <div style="background:#F5F5F5;padding:20px;border-radius:8px;margin:24px 0;">
              <p style="font-weight:700;color:#111;margin:0 0 8px;font-size:14px;">Proven track record:</p>
              <p style="color:#555;font-size:14px;line-height:1.8;margin:0;">
                🏆 Hampton, VA — 8,000+ attendees, sold-out event<br/>
                🏆 65+ events operated across 12+ cities<br/>
                🏆 330,000+ total participants<br/>
                🏆 Recommended structure: 5 waves/day, 225 people per wave
              </p>
            </div>

            <p style="font-size:15px;color:#333;line-height:1.6;">
              I'd love to schedule a quick 20-minute call to share more details, answer your questions, and explore how the Urban Slide could work for ${city}.
            </p>

            <p style="font-size:15px;color:#333;line-height:1.6;">
              Would you have some time this week or next?
            </p>

            <p style="font-size:15px;color:#333;line-height:1.6;margin-top:32px;">
              Best,<br/>
              <strong>Derrest Williams Jr.</strong><br/>
              Founder, FlowState Experiences<br/>
              (713) 376-8521<br/>
              <a href="https://cityactivations.com" style="color:#2196F3;">cityactivations.com</a>
            </p>
          </div>
          ${FOOTER}
        </div>`,
    },

    follow_up: {
      subject: `Urban Slide in ${city} — Full Details & Pricing`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;color:#111;">
          <div style="background:linear-gradient(135deg,#0F1623 0%,#1A2338 100%);padding:32px;border-radius:12px 12px 0 0;">
            <p style="color:#FF6B2B;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 8px;">Follow Up — Full Details</p>
            <h1 style="color:#fff;font-size:26px;font-weight:900;margin:0;line-height:1.1;">URBAN SLIDE: ${city.toUpperCase()}<br/>PRICING &amp; OVERVIEW</h1>
          </div>

          <div style="padding:32px;background:#fff;border:1px solid #eee;border-top:none;">
            <p style="font-size:15px;color:#333;line-height:1.6;">Hi ${firstName},</p>
            <p style="font-size:15px;color:#333;line-height:1.6;">
              Thank you for your interest in The Urban Slide! Here's everything you need to know to bring this event to ${city}.
            </p>

            <!-- Video -->
            <div style="margin:20px 0;text-align:center;">
              <a href="https://www.youtube.com/watch?v=MWxVJMfFjnA">
                <img src="https://img.youtube.com/vi/MWxVJMfFjnA/maxresdefault.jpg" alt="Watch Urban Slide Video" style="width:100%;border-radius:10px;display:block;"/>
              </a>
              <a href="https://www.youtube.com/watch?v=MWxVJMfFjnA" style="display:inline-block;margin-top:10px;background:linear-gradient(90deg,#2196F3,#FF6B2B);color:#fff;font-weight:700;font-size:13px;padding:10px 24px;border-radius:100px;text-decoration:none;">▶ Watch the Full Event Video</a>
            </div>

            <!-- Pricing -->
            <div style="background:#0F1623;color:#fff;padding:24px;border-radius:10px;margin:24px 0;">
              <p style="font-weight:700;font-size:16px;color:#2196F3;margin:0 0 16px;text-transform:uppercase;letter-spacing:0.05em;">Pricing</p>
              <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:8px 0;font-size:14px;color:#ccc;border-bottom:1px solid rgba(255,255,255,0.1);">One-Day Event</td><td style="padding:8px 0;font-size:14px;font-weight:700;text-align:right;border-bottom:1px solid rgba(255,255,255,0.1);">$65,000</td></tr>
                <tr><td style="padding:8px 0;font-size:14px;color:#ccc;border-bottom:1px solid rgba(255,255,255,0.1);">Two-Day Event <span style="color:#FF6B2B;font-size:11px;">(Recommended)</span></td><td style="padding:8px 0;font-size:14px;font-weight:700;text-align:right;border-bottom:1px solid rgba(255,255,255,0.1);">$70,000</td></tr>
                <tr><td style="padding:8px 0;font-size:13px;color:#aaa;">Insurance discount (if city provides coverage)</td><td style="padding:8px 0;font-size:13px;color:#4CAF50;text-align:right;">-$6,000</td></tr>
              </table>
              <p style="font-size:12px;color:#888;margin:12px 0 0;">Flexible payment plans available across 3–4 installments.</p>
            </div>

            <!-- Event Structure -->
            <div style="background:#F0F7FF;border-left:4px solid #2196F3;padding:20px;margin:20px 0;border-radius:0 8px 8px 0;">
              <p style="font-weight:700;color:#1565C0;margin:0 0 8px;font-size:14px;">Recommended Event Structure</p>
              <p style="color:#333;font-size:14px;line-height:1.8;margin:0;">
                ⏰ Hours: 10:00 AM – 8:00 PM<br/>
                🌊 Wave duration: 2 hours each<br/>
                👥 Capacity: 225 people per wave<br/>
                🎟️ Daily attendance: Up to 1,125 participants<br/>
                📅 Two-day total: Up to 2,250 participants
              </p>
            </div>

            <!-- What's Included -->
            <div style="margin:20px 0;">
              <p style="font-weight:700;font-size:15px;color:#111;margin:0 0 12px;">What's Included</p>
              <table style="width:100%;font-size:13px;color:#444;line-height:1.8;">
                <tr><td style="vertical-align:top;padding:4px 8px 4px 0;">✅</td><td>Urban Slide (400–700 ft) — full setup, maintenance &amp; teardown</td></tr>
                <tr><td style="vertical-align:top;padding:4px 8px 4px 0;">✅</td><td>Site assessment and layout recommendations</td></tr>
                <tr><td style="vertical-align:top;padding:4px 8px 4px 0;">✅</td><td>Complete production schedule and operations manual</td></tr>
                <tr><td style="vertical-align:top;padding:4px 8px 4px 0;">✅</td><td>Forklifts, generators, speakers, water hoses, and operational equipment</td></tr>
                <tr><td style="vertical-align:top;padding:4px 8px 4px 0;">✅</td><td>Full staffing: Lead Event Manager, Operations Manager, setup/teardown crews, slide operators</td></tr>
                <tr><td style="vertical-align:top;padding:4px 8px 4px 0;">✅</td><td>Travel &amp; logistics: airfare, rental vehicles, trailer transport, lodging for all staff</td></tr>
                <tr><td style="vertical-align:top;padding:4px 8px 4px 0;">✅</td><td>General liability insurance up to $1–2M</td></tr>
                <tr><td style="vertical-align:top;padding:4px 8px 4px 0;">✅</td><td>1 custom promo video (2 revisions) + 3 marketing graphics</td></tr>
              </table>
            </div>

            <!-- Tubes -->
            <div style="background:#FFF8E1;border-left:4px solid #FF6B2B;padding:20px;margin:20px 0;border-radius:0 8px 8px 0;">
              <p style="font-weight:700;color:#E65100;margin:0 0 8px;font-size:14px;">Custom Branded Tubes</p>
              <p style="color:#333;font-size:14px;line-height:1.8;margin:0;">
                $6–10 per tube · Heavy-duty PVC · Customized with ${city} branding &amp; sponsor logos<br/>
                We recommend ~200 tubes in circulation. We can source and manage them, or you may purchase your own.
              </p>
            </div>

            <!-- Revenue -->
            <div style="margin:20px 0;">
              <p style="font-weight:700;font-size:15px;color:#111;margin:0 0 12px;">Revenue Opportunities</p>
              <p style="font-size:13px;color:#555;line-height:1.8;margin:0;">
                💰 <strong>Ticket Sales</strong> — We'll help you determine pricing, wave times &amp; ticketing strategy<br/>
                🏷️ <strong>Sponsorships</strong> — Banner placements on arches, branded tubes, and event assets<br/>
                🛍️ <strong>Merchandise</strong> — Offer products from our catalog; you keep a portion of net proceeds<br/>
                🏛️ <strong>Grants</strong> — Tourism, parks, recreation, or economic development grants often apply
              </p>
            </div>

            <!-- Host Responsibilities -->
            <div style="background:#F5F5F5;padding:20px;border-radius:8px;margin:20px 0;">
              <p style="font-weight:700;font-size:14px;color:#111;margin:0 0 10px;">Host Responsibilities</p>
              <p style="font-size:13px;color:#555;line-height:1.8;margin:0;">
                • All required permits &amp; approvals<br/>
                • Event insurance (listing Urban Slide &amp; Kodiak Events as additional insureds)<br/>
                • Ticket sales and event check-in<br/>
                • Water meter access &amp; overnight security<br/>
                • Police officers, EMS coordination &amp; street barricades<br/>
                • Event advertising &amp; promotion<br/>
                • DJ for music and announcements<br/>
                • ~15 volunteers throughout the event
              </p>
            </div>

            <div style="background:#E8F5E9;border-left:4px solid #4CAF50;padding:20px;margin:24px 0;border-radius:0 8px 8px 0;">
              <p style="font-weight:700;color:#1B5E20;margin:0 0 6px;font-size:14px;">Ready to talk?</p>
              <p style="color:#333;font-size:14px;margin:0;">I'd love to schedule a 20-minute call to answer your questions and discuss how Urban Slide can work for ${city}. Please reply with a few times that work for you.</p>
            </div>

            <p style="font-size:15px;color:#333;line-height:1.6;margin-top:24px;">
              Best,<br/>
              <strong>Derrest Williams Jr.</strong><br/>
              Founder, FlowState Experiences<br/>
              (713) 376-8521<br/>
              <a href="https://cityactivations.com" style="color:#2196F3;">cityactivations.com</a>
            </p>
          </div>
          ${FOOTER}
        </div>`,
    },

    destination_marketing: {
      subject: `Building ${city}'s event audience — FlowState Experiences`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;color:#111;">
          <div style="background:linear-gradient(135deg,#0F1623 0%,#1A2338 100%);padding:32px;border-radius:12px 12px 0 0;">
            <p style="color:#8B3CF7;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 8px;">Destination Marketing</p>
            <h1 style="color:#fff;font-size:28px;font-weight:900;margin:0;line-height:1.1;">WE BUILD THE<br/>AUDIENCE FIRST.</h1>
          </div>
          <div style="padding:32px;background:#fff;border:1px solid #eee;border-top:none;">
            <p style="font-size:15px;color:#333;line-height:1.6;">Hi ${firstName},</p>
            <p style="font-size:15px;color:#333;line-height:1.6;">
              My name is Derrest Williams — I'm the founder of <strong>FlowState Experiences</strong>. We're a full-funnel city activation partner: we run the events <em>and</em> we market the destination.
            </p>
            <div style="background:#F5F0FF;border-left:4px solid #8B3CF7;padding:20px;margin:24px 0;border-radius:0 8px 8px 0;">
              <p style="font-weight:700;color:#6B21A8;margin:0 0 8px;font-size:14px;">Live proof — ThingsToDoInAustin.com:</p>
              <p style="color:#333;font-size:14px;line-height:1.8;margin:0;">
                📸 11,400 Instagram followers<br/>
                👥 18,000 Facebook Group members<br/>
                📘 10,000 Facebook Page fans<br/>
                🎯 39,000+ total owned audience — built from zero
              </p>
            </div>
            <p style="font-size:15px;color:#333;line-height:1.6;">
              We can build a <strong>Things To Do in ${city}</strong> platform as part of any activation package — giving your city a permanent audience asset that promotes every future event you run.
            </p>
            <p style="font-size:15px;color:#333;line-height:1.6;">Would you have 20 minutes to explore this for ${city}?</p>
            <p style="font-size:15px;color:#333;line-height:1.6;margin-top:32px;">
              Best,<br/><strong>Derrest Williams Jr.</strong><br/>
              FlowState Experiences · (713) 376-8521<br/>
              <a href="https://cityactivations.com" style="color:#8B3CF7;">cityactivations.com</a>
            </p>
          </div>
          ${FOOTER}
        </div>`,
    },

    media_buying: {
      subject: `Paid media for ${city} events — FlowState Experiences`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;color:#111;">
          <div style="background:linear-gradient(135deg,#0F1623 0%,#1A2338 100%);padding:32px;border-radius:12px 12px 0 0;">
            <p style="color:#FF6B2B;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 8px;">Media Buying</p>
            <h1 style="color:#fff;font-size:28px;font-weight:900;margin:0;line-height:1.1;">WE FILL SEATS<br/>WITH DATA.</h1>
          </div>
          <div style="padding:32px;background:#fff;border:1px solid #eee;border-top:none;">
            <p style="font-size:15px;color:#333;line-height:1.6;">Hi ${firstName},</p>
            <p style="font-size:15px;color:#333;line-height:1.6;">
              My name is Derrest Williams — I run paid media campaigns for city events and activations across the country.
            </p>
            <div style="background:#FFF5F0;border-left:4px solid #FF6B2B;padding:20px;margin:24px 0;border-radius:0 8px 8px 0;">
              <p style="font-weight:700;color:#C2410C;margin:0 0 8px;font-size:14px;">What sets us apart:</p>
              <p style="color:#333;font-size:14px;line-height:1.8;margin:0;">
                💰 $1M+ in monthly ad spend managed<br/>
                🎯 Meta, Google, TikTok, programmatic &amp; traditional<br/>
                📊 Full attribution and ROAS reporting<br/>
                🔄 Event ops + media in sync — no agency middleman
              </p>
            </div>
            <p style="font-size:15px;color:#333;line-height:1.6;">Would you have 20 minutes this week?</p>
            <p style="font-size:15px;color:#333;line-height:1.6;margin-top:32px;">
              Best,<br/><strong>Derrest Williams Jr.</strong><br/>
              FlowState Experiences · (713) 376-8521<br/>
              <a href="https://cityactivations.com" style="color:#FF6B2B;">cityactivations.com</a>
            </p>
          </div>
          ${FOOTER}
        </div>`,
    },

    full_funnel: {
      subject: `Full-funnel city activation for ${city} — FlowState Experiences`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;color:#111;">
          <div style="background:linear-gradient(135deg,#0F1623 0%,#1A2338 100%);padding:32px;border-radius:12px 12px 0 0;">
            <p style="color:#2196F3;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 8px;">City Activation Partner</p>
            <h1 style="color:#fff;font-size:28px;font-weight:900;margin:0;line-height:1.1;">ONE PARTNER.<br/>FULL FUNNEL.</h1>
          </div>
          <div style="padding:32px;background:#fff;border:1px solid #eee;border-top:none;">
            <p style="font-size:15px;color:#333;line-height:1.6;">Hi ${firstName},</p>
            <p style="font-size:15px;color:#333;line-height:1.6;">
              My name is Derrest Williams — I'm the founder of <strong>FlowState Experiences</strong>. We activate cities across the country through events, destination marketing, and paid media — all from one team.
            </p>
            <div style="display:grid;gap:10px;margin:24px 0;">
              <div style="background:#F0F7FF;padding:14px;border-radius:8px;border-left:3px solid #2196F3;">
                <p style="font-weight:700;color:#1565C0;font-size:13px;margin:0 0 4px;">01 — Event Operations</p>
                <p style="color:#555;font-size:13px;margin:0;">Urban Slide, 400–700 ft water slide — fully staffed and operated. Teams handle everything from setup to teardown.</p>
              </div>
              <div style="background:#F5F0FF;padding:14px;border-radius:8px;border-left:3px solid #8B3CF7;">
                <p style="font-weight:700;color:#6B21A8;font-size:13px;margin:0 0 4px;">02 — Destination Marketing</p>
                <p style="color:#555;font-size:13px;margin:0;">We build the audience before the first ticket goes on sale. 39K+ owned followers across Texas.</p>
              </div>
              <div style="background:#FFF5F0;padding:14px;border-radius:8px;border-left:3px solid #FF6B2B;">
                <p style="font-weight:700;color:#C2410C;font-size:13px;margin:0 0 4px;">03 — Media Buying</p>
                <p style="color:#555;font-size:13px;margin:0;">$1M+ monthly managed across Meta, Google, TikTok, and traditional media.</p>
              </div>
            </div>
            <p style="font-size:15px;color:#333;line-height:1.6;">Would you have 20 minutes this week?</p>
            <p style="font-size:15px;color:#333;line-height:1.6;margin-top:32px;">
              Best,<br/><strong>Derrest Williams Jr.</strong><br/>
              FlowState Experiences · (713) 376-8521<br/>
              <a href="https://cityactivations.com" style="color:#2196F3;">cityactivations.com</a>
            </p>
          </div>
          ${FOOTER}
        </div>`,
    },
  };

  return templates[template] || templates.urban_slide;
}

export async function POST(req: NextRequest) {
  const { prospect_ids, template, custom_subject, custom_body } = await req.json();

  if (!prospect_ids?.length) {
    return NextResponse.json({ error: "No prospects selected" }, { status: 400 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data: prospects, error } = await sb
    .from("prospects")
    .select("*")
    .in("id", prospect_ids);

  if (error || !prospects?.length) {
    return NextResponse.json({ error: "Failed to load prospects" }, { status: 500 });
  }

  const results = { sent: 0, failed: 0, errors: [] as string[] };

  for (const prospect of prospects) {
    try {
      const emailContent = custom_subject && custom_body
        ? { subject: custom_subject, html: custom_body.includes("<") ? custom_body : `<pre style="font-family:Arial,sans-serif;white-space:pre-wrap;font-size:14px;line-height:1.7;max-width:600px;padding:32px;">${custom_body}</pre>` }
        : getEmailTemplate(template as Template, prospect);

      const { error: sendError } = await resend.emails.send({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: prospect.email,
        subject: emailContent.subject,
        html: emailContent.html,
        tags: [
          { name: "prospect_id", value: prospect.id },
          { name: "template", value: template || "custom" },
          { name: "city", value: prospect.city || "unknown" },
        ],
      });

      if (sendError) {
        results.failed++;
        results.errors.push(`${prospect.email}: ${sendError.message}`);
      } else {
        results.sent++;
        await sb.from("prospects").update({
          email_status: "emailed",
          last_emailed_at: new Date().toISOString(),
          last_template: template || "custom",
          open_count: 0,
          opened_at: null,
          clicked_at: null,
        }).eq("id", prospect.id);
      }
    } catch (e: any) {
      results.failed++;
      results.errors.push(`${prospect.email}: ${e.message}`);
    }
  }

  return NextResponse.json(results);
}
