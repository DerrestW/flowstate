import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "derrest@cityactivations.com";
const FROM_NAME = "Derrest Williams | FlowState Experiences";

type Template = "urban_slide" | "destination_marketing" | "media_buying" | "full_funnel";

function getEmailTemplate(template: Template, contact: any): { subject: string; html: string } {
  const firstName = contact.name?.split(" ")[0] || "there";

  const templates: Record<Template, { subject: string; html: string }> = {
    urban_slide: {
      subject: `Urban Slide in ${contact.city} — 1,000ft Water Slide Activation`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
          <div style="background: linear-gradient(135deg, #0F1623 0%, #1A2338 100%); padding: 32px; border-radius: 12px 12px 0 0;">
            <p style="color: #2196F3; font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; margin: 0 0 8px;">City Activation Partner</p>
            <h1 style="color: #fff; font-size: 28px; font-weight: 900; margin: 0; line-height: 1.1;">URBAN SLIDE<br/>IN ${contact.city.toUpperCase()}</h1>
          </div>

          <div style="padding: 32px; background: #fff; border: 1px solid #eee; border-top: none;">
            <p style="font-size: 15px; color: #333; line-height: 1.6;">Hi ${firstName},</p>

            <p style="font-size: 15px; color: #333; line-height: 1.6;">
              My name is Derrest Williams — I'm the founder of <strong>FlowState Experiences</strong>, a Houston-based city activation company that produces world-class outdoor events for municipalities across the country.
            </p>

            <p style="font-size: 15px; color: #333; line-height: 1.6;">
              I'm reaching out because I'd love to bring our flagship activation — the <strong>Urban Slide</strong> — to ${contact.city}. It's a 1,000-foot modular water slide that shuts down a street and becomes the most-photographed day of the summer for any city.
            </p>

            <div style="background: #F0F7FF; border-left: 4px solid #2196F3; padding: 20px; margin: 24px 0; border-radius: 0 8px 8px 0;">
              <p style="font-weight: 700; color: #1565C0; margin: 0 0 12px; font-size: 14px;">What we handle end-to-end:</p>
              <ul style="color: #333; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8;">
                <li>Full city permitting and municipal coordination</li>
                <li>Traffic control and street closure management</li>
                <li>Day-of operations crew and safety staff</li>
                <li>Event marketing and ticket sales</li>
                <li>Insurance documentation</li>
                <li>Complete teardown and site restoration</li>
              </ul>
            </div>

            <div style="background: #F5F5F5; padding: 20px; border-radius: 8px; margin: 24px 0;">
              <p style="font-weight: 700; color: #111; margin: 0 0 8px; font-size: 14px;">Recent results:</p>
              <p style="color: #555; font-size: 14px; line-height: 1.7; margin: 0;">
                🏆 Hampton, VA — 8,000+ attendees, $70K contract, fully permitted<br/>
                🏆 65+ events operated across 12+ cities<br/>
                🏆 330,000+ total participants<br/>
                🏆 100% city client retention rate
              </p>
            </div>

            <p style="font-size: 15px; color: #333; line-height: 1.6;">
              We bring everything — you just show up. I'd love to put together a proposal for ${contact.city} and walk you through what this would look like for your community.
            </p>

            <p style="font-size: 15px; color: #333; line-height: 1.6;">
              Would you have 20 minutes for a quick call this week or next?
            </p>

            <p style="font-size: 15px; color: #333; line-height: 1.6; margin-top: 32px;">
              Best,<br/>
              <strong>Derrest Williams</strong><br/>
              Founder, FlowState Experiences<br/>
              <span style="color: #2196F3;">cityactivations.com</span><br/>
              derrest@cityactivations.com
            </p>
          </div>

          <div style="background: #F8F6F2; padding: 16px 32px; border-radius: 0 0 12px 12px; text-align: center;">
            <p style="font-size: 11px; color: #999; margin: 0;">
              FlowState Experiences · Houston, TX · <a href="https://cityactivations.com" style="color: #2196F3;">cityactivations.com</a>
              <br/>You're receiving this because you manage events for the City of ${contact.city}.
              <a href="mailto:derrest@cityactivations.com?subject=Unsubscribe" style="color: #999; margin-left: 8px;">Unsubscribe</a>
            </p>
          </div>
        </div>
      `,
    },

    destination_marketing: {
      subject: `Building ${contact.city}'s event audience — FlowState Experiences`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
          <div style="background: linear-gradient(135deg, #0F1623 0%, #1A2338 100%); padding: 32px; border-radius: 12px 12px 0 0;">
            <p style="color: #8B3CF7; font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; margin: 0 0 8px;">Destination Marketing</p>
            <h1 style="color: #fff; font-size: 28px; font-weight: 900; margin: 0; line-height: 1.1;">WE BUILD THE<br/>AUDIENCE FIRST.</h1>
          </div>

          <div style="padding: 32px; background: #fff; border: 1px solid #eee; border-top: none;">
            <p style="font-size: 15px; color: #333; line-height: 1.6;">Hi ${firstName},</p>

            <p style="font-size: 15px; color: #333; line-height: 1.6;">
              My name is Derrest Williams — I'm the founder of <strong>FlowState Experiences</strong>. We're a full-funnel city activation partner: we run the events <em>and</em> we market the destination.
            </p>

            <p style="font-size: 15px; color: #333; line-height: 1.6;">
              Most event companies wait for cities to handle their own marketing. We don't. We've built owned platforms and social audiences that promote events before a single ticket goes on sale.
            </p>

            <div style="background: #F5F0FF; border-left: 4px solid #8B3CF7; padding: 20px; margin: 24px 0; border-radius: 0 8px 8px 0;">
              <p style="font-weight: 700; color: #6B21A8; margin: 0 0 8px; font-size: 14px;">Live proof — ThingsToDoInAustin.com:</p>
              <p style="color: #333; font-size: 14px; line-height: 1.8; margin: 0;">
                📸 11,400 Instagram followers<br/>
                👥 18,000 Facebook Group members<br/>
                📘 10,000 Facebook Page fans<br/>
                🎯 39,000+ total owned audience — built from zero
              </p>
            </div>

            <p style="font-size: 15px; color: #333; line-height: 1.6;">
              We can build a <strong>Things To Do in ${contact.city}</strong> platform as part of any activation package — giving your city a permanent audience asset that promotes every future event you run.
            </p>

            <div style="background: #F5F5F5; padding: 20px; border-radius: 8px; margin: 24px 0;">
              <p style="font-weight: 700; color: #111; margin: 0 0 8px; font-size: 14px;">Our destination marketing services:</p>
              <p style="color: #555; font-size: 14px; line-height: 1.8; margin: 0;">
                • Social media & content creation<br/>
                • Paid media (Meta, Google, TikTok)<br/>
                • Influencer marketing & local creators<br/>
                • Email & SMS campaigns<br/>
                • Press & media outreach<br/>
                • Local discovery platforms
              </p>
            </div>

            <p style="font-size: 15px; color: #333; line-height: 1.6;">
              Would you have 20 minutes to explore what this could look like for ${contact.city}?
            </p>

            <p style="font-size: 15px; color: #333; line-height: 1.6; margin-top: 32px;">
              Best,<br/>
              <strong>Derrest Williams</strong><br/>
              Founder, FlowState Experiences<br/>
              <span style="color: #8B3CF7;">cityactivations.com</span><br/>
              derrest@cityactivations.com
            </p>
          </div>

          <div style="background: #F8F6F2; padding: 16px 32px; border-radius: 0 0 12px 12px; text-align: center;">
            <p style="font-size: 11px; color: #999; margin: 0;">
              FlowState Experiences · Houston, TX · <a href="https://cityactivations.com" style="color: #8B3CF7;">cityactivations.com</a>
              <br/><a href="mailto:derrest@cityactivations.com?subject=Unsubscribe" style="color: #999;">Unsubscribe</a>
            </p>
          </div>
        </div>
      `,
    },

    media_buying: {
      subject: `Paid media for ${contact.city} events — $1M+ monthly managed`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
          <div style="background: linear-gradient(135deg, #0F1623 0%, #1A2338 100%); padding: 32px; border-radius: 12px 12px 0 0;">
            <p style="color: #FF6B2B; font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; margin: 0 0 8px;">Media Buying</p>
            <h1 style="color: #fff; font-size: 28px; font-weight: 900; margin: 0; line-height: 1.1;">WE FILL SEATS<br/>WITH DATA.</h1>
          </div>

          <div style="padding: 32px; background: #fff; border: 1px solid #eee; border-top: none;">
            <p style="font-size: 15px; color: #333; line-height: 1.6;">Hi ${firstName},</p>

            <p style="font-size: 15px; color: #333; line-height: 1.6;">
              My name is Derrest Williams — I'm the founder of <strong>FlowState Experiences</strong>, and I run paid media campaigns for city events and activations across the country.
            </p>

            <div style="background: #FFF5F0; border-left: 4px solid #FF6B2B; padding: 20px; margin: 24px 0; border-radius: 0 8px 8px 0;">
              <p style="font-weight: 700; color: #C2410C; margin: 0 0 8px; font-size: 14px;">What sets us apart:</p>
              <p style="color: #333; font-size: 14px; line-height: 1.8; margin: 0;">
                💰 $1M+ in monthly ad spend managed (enterprise level)<br/>
                🎯 Meta, Google, TikTok, programmatic & traditional<br/>
                📊 Full attribution and ROAS reporting<br/>
                🔄 Event ops + media in sync — no agency middleman
              </p>
            </div>

            <p style="font-size: 15px; color: #333; line-height: 1.6;">
              Most cities split event operations and marketing across multiple vendors — losing time to coordination and money to duplication. We handle both from one team, which means your campaigns are aligned with your event from day one.
            </p>

            <p style="font-size: 15px; color: #333; line-height: 1.6;">
              I'd love to put together a media strategy proposal for ${contact.city}'s upcoming events. Would you have 20 minutes this week?
            </p>

            <p style="font-size: 15px; color: #333; line-height: 1.6; margin-top: 32px;">
              Best,<br/>
              <strong>Derrest Williams</strong><br/>
              Founder, FlowState Experiences<br/>
              <span style="color: #FF6B2B;">cityactivations.com</span><br/>
              derrest@cityactivations.com
            </p>
          </div>

          <div style="background: #F8F6F2; padding: 16px 32px; border-radius: 0 0 12px 12px; text-align: center;">
            <p style="font-size: 11px; color: #999; margin: 0;">
              FlowState Experiences · Houston, TX · <a href="https://cityactivations.com" style="color: #FF6B2B;">cityactivations.com</a>
              <br/><a href="mailto:derrest@cityactivations.com?subject=Unsubscribe" style="color: #999;">Unsubscribe</a>
            </p>
          </div>
        </div>
      `,
    },

    full_funnel: {
      subject: `Full-funnel city activation for ${contact.city} — FlowState Experiences`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
          <div style="background: linear-gradient(135deg, #0F1623 0%, #1A2338 100%); padding: 32px; border-radius: 12px 12px 0 0;">
            <p style="color: #2196F3; font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; margin: 0 0 8px;">City Activation Partner</p>
            <h1 style="color: #fff; font-size: 28px; font-weight: 900; margin: 0; line-height: 1.1;">ONE PARTNER.<br/>FULL FUNNEL.</h1>
          </div>

          <div style="padding: 32px; background: #fff; border: 1px solid #eee; border-top: none;">
            <p style="font-size: 15px; color: #333; line-height: 1.6;">Hi ${firstName},</p>

            <p style="font-size: 15px; color: #333; line-height: 1.6;">
              My name is Derrest Williams — I'm the founder of <strong>FlowState Experiences</strong>, a Houston-based company that activates cities across the country. We produce outdoor events, market destinations, and run paid media — all from one team.
            </p>

            <div style="display: grid; gap: 12px; margin: 24px 0;">
              <div style="background: #F0F7FF; padding: 16px; border-radius: 8px; border-left: 3px solid #2196F3;">
                <p style="font-weight: 700; color: #1565C0; font-size: 13px; margin: 0 0 4px;">01 — Event Operations</p>
                <p style="color: #555; font-size: 13px; margin: 0;">Urban Slide, mud runs, crawfish festivals, light shows — fully permitted and operated.</p>
              </div>
              <div style="background: #F5F0FF; padding: 16px; border-radius: 8px; border-left: 3px solid #8B3CF7;">
                <p style="font-weight: 700; color: #6B21A8; font-size: 13px; margin: 0 0 4px;">02 — Destination Marketing</p>
                <p style="color: #555; font-size: 13px; margin: 0;">We build the audience before the first ticket goes on sale. 39K+ owned followers across Texas.</p>
              </div>
              <div style="background: #FFF5F0; padding: 16px; border-radius: 8px; border-left: 3px solid #FF6B2B;">
                <p style="font-weight: 700; color: #C2410C; font-size: 13px; margin: 0 0 4px;">03 — Media Buying</p>
                <p style="color: #555; font-size: 13px; margin: 0;">$1M+ monthly managed across Meta, Google, TikTok, and traditional media.</p>
              </div>
            </div>

            <p style="font-size: 15px; color: #333; line-height: 1.6;">
              Most cities manage 5–9 vendors to get what we do as one team. I'd love to show you what a full activation strategy for ${contact.city} would look like — events, marketing, and audience — in one proposal.
            </p>

            <p style="font-size: 15px; color: #333; line-height: 1.6;">Would you have 20 minutes this week?</p>

            <p style="font-size: 15px; color: #333; line-height: 1.6; margin-top: 32px;">
              Best,<br/>
              <strong>Derrest Williams</strong><br/>
              Founder, FlowState Experiences<br/>
              <span style="color: #2196F3;">cityactivations.com</span><br/>
              derrest@cityactivations.com
            </p>
          </div>

          <div style="background: #F8F6F2; padding: 16px 32px; border-radius: 0 0 12px 12px; text-align: center;">
            <p style="font-size: 11px; color: #999; margin: 0;">
              FlowState Experiences · Houston, TX · <a href="https://cityactivations.com" style="color: #2196F3;">cityactivations.com</a>
              <br/><a href="mailto:derrest@cityactivations.com?subject=Unsubscribe" style="color: #999;">Unsubscribe</a>
            </p>
          </div>
        </div>
      `,
    },
  };

  return templates[template];
}

export async function POST(req: NextRequest) {
  const { prospect_ids, template, custom_subject, custom_body } = await req.json();

  if (!prospect_ids?.length) {
    return NextResponse.json({ error: "No prospects selected" }, { status: 400 });
  }

  // Load prospects
  const { data: prospects, error } = await sb
    .from("prospects")
    .select("*")
    .in("id", prospect_ids);

  if (error || !prospects?.length) {
    return NextResponse.json({ error: "Failed to load prospects" }, { status: 500 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const results = { sent: 0, failed: 0, errors: [] as string[] };

  for (const prospect of prospects) {
    try {
      const emailContent = custom_subject && custom_body
        ? { subject: custom_subject, html: custom_body }
        : getEmailTemplate(template as Template, prospect);

      const { error: sendError } = await resend.emails.send({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: prospect.email,
        subject: emailContent.subject,
        html: emailContent.html,
        tags: [
          { name: "prospect_id", value: prospect.id },
          { name: "template", value: template || "custom" },
          { name: "city", value: prospect.city },
        ],
      });

      if (sendError) {
        results.failed++;
        results.errors.push(`${prospect.email}: ${sendError.message}`);
      } else {
        results.sent++;
        // Update prospect status
        await sb.from("prospects").update({
          email_status: "emailed",
          last_emailed_at: new Date().toISOString(),
          last_template: template || "custom",
        }).eq("id", prospect.id);
      }
    } catch (e: any) {
      results.failed++;
      results.errors.push(`${prospect.email}: ${e.message}`);
    }
  }

  return NextResponse.json(results);
}
