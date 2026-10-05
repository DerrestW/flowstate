// Urban Slide outreach emails (initial pitch + follow-up).
// Email-client-safe: table layout, inline styles, no web fonts, no background images.
// Images and the info packet are served from the live site (public/email, public/urban-slide-info-packet.pdf).

export type OutreachContact = { name?: string | null; city?: string | null; state?: string | null };

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://cityactivations.com";
const PHONE = "(713) 376-8521";
const FB = "https://www.facebook.com/TheUrbanSlide";
const PACKET = `${SITE}/urban-slide-info-packet.pdf`;
const ADDRESS = process.env.COMPANY_MAILING_ADDRESS || "FlowState Experiences · Houston, TX";
const UNSUB = "mailto:derrest@cityactivations.com?subject=Unsubscribe";

// Past hosts and clients shown in the trust banner (text only: no logos or seals used without permission)
const TRUSTED = [
  "Fredericksburg, VA", "Roanoke, VA", "Lynchburg, VA", "Gadsden, AL", "Marble Falls, TX",
  "Jacksonville, FL", "Calgary, Canada", "Blueberry Festival", "U.S. Army", "U.S. Navy", "U.S. Air Force",
];

const WHY: [string, string][] = [
  ["Newsworthy.", "A waterslide down Main Street draws local TV, press and a flood of social posts."],
  ["Boosts community morale.", "An all-ages day that brings residents together downtown."],
  ["A visible win for city leadership.", "Council members and departments get a feel-good event to show up for and talk about."],
  ["Brings people downtown.", "Thousands of riders and spectators mean foot traffic for local businesses."],
];

const ORANGE = "#FF6B2B";
const BLUE = "#1E88E5";
const INK = "#14181F";
const BODY = "#3A4250";
const MUTED = "#7A8291";

function esc(v: unknown) {
  return String(v ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
function firstNameOf(c: OutreachContact) {
  const n = (c.name || "").trim().split(/\s+/)[0];
  return n && n.toLowerCase() !== "unknown" ? n : "";
}
function cityOf(c: OutreachContact) {
  return (c.city || "").trim() || "your city";
}

function shell(preheader: string, inner: string) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><title>The Urban Slide</title>
<style>
  @media (max-width:620px){ .px{padding-left:20px!important;padding-right:20px!important} .stack{display:block!important;width:100%!important} .stack-pad{padding:0 0 12px 0!important} .stat{padding:10px 8px!important} .h1{font-size:26px!important;line-height:32px!important} }
  a{color:${BLUE}}
</style></head>
<body style="margin:0;padding:0;background:#EEF1F5;-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#EEF1F5;">${esc(preheader)}&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#EEF1F5;">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#FFFFFF;border-radius:14px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;">
${inner}
</table>
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;font-family:Arial,Helvetica,sans-serif;">
<tr><td class="px" style="padding:18px 32px;text-align:center;font-size:11px;line-height:17px;color:${MUTED};">
${esc(ADDRESS)}<br>
You're receiving this because you lead events or community programs for your city.
<a href="${UNSUB}" style="color:${MUTED};text-decoration:underline;">Unsubscribe</a>
</td></tr></table>
</td></tr></table></body></html>`;
}

function button(href: string, label: string, bg = ORANGE) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-radius:100px;background:${bg};">
<a href="${href}" style="display:inline-block;padding:14px 28px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;color:#FFFFFF;text-decoration:none;border-radius:100px;">${label}</a>
</td></tr></table>`;
}

function signature() {
  return `<tr><td class="px" style="padding:8px 32px 28px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #E6E9EE;width:100%;"><tr><td style="padding-top:18px;font-size:14px;line-height:21px;color:${BODY};">
<strong style="color:${INK};font-size:15px;">Derrest Williams Jr.</strong><br>
Co-Founder, The Urban Slide &amp; FlowState Experiences<br>
<a href="tel:+17133768521" style="color:${BODY};text-decoration:none;">${PHONE}</a> &nbsp;·&nbsp; <a href="${SITE}" style="color:${BLUE};text-decoration:none;">cityactivations.com</a> &nbsp;·&nbsp; <a href="${FB}" style="color:${BLUE};text-decoration:none;">Facebook</a>
</td></tr></table></td></tr>`;
}

// ---------------------------------------------------------------------------
// Email 1 — initial pitch
// ---------------------------------------------------------------------------
export function urbanSlidePitch(c: OutreachContact) {
  const first = firstNameOf(c);
  const city = cityOf(c);
  const subject = `A street waterslide for ${city}?`;
  const preheader = `Fredericksburg, VA: 1,800 sliders, sold out, and $72,500 in ticket + sponsor revenue.`;

  const inner = `
<tr><td style="padding:0;"><a href="${FB}"><img src="${SITE}/email/slide-aerial.jpg" width="600" alt="The Urban Slide running down a closed downtown street" style="display:block;width:100%;max-width:600px;height:auto;border:0;"></a></td></tr>

<tr><td class="px" style="padding:28px 32px 6px;">
<div style="font-size:11px;font-weight:bold;letter-spacing:1.6px;text-transform:uppercase;color:${ORANGE};">Now booking the 2027 season</div>
<h1 class="h1" style="margin:8px 0 0;font-size:30px;line-height:36px;font-weight:900;color:${INK};">Turn a street in ${esc(city)} into a 500–700 ft waterslide.</h1>
</td></tr>

<tr><td class="px" style="padding:14px 32px 0;font-size:16px;line-height:25px;color:${BODY};">
<p style="margin:0 0 14px;">Howdy${first ? ` ${esc(first)}` : ""},</p>
<p style="margin:0 0 14px;">The Urban Slide closes down a city street and turns it into a giant multi-lane waterslide, an event that families, residents and visitors keep talking about long after it's gone. We've run it with cities across the country, and the U.S. Air Force even bought one of our slides.</p>
<p style="margin:0;">With ticket sales and local sponsors, it can often pay for itself. Here's what one host city reported:</p>
</td></tr>

<tr><td class="px" style="padding:18px 32px 4px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FFF4EE;border-radius:12px;">
<tr>
<td class="stack stat" width="33%" align="center" style="padding:18px 8px;"><div style="font-size:26px;font-weight:900;color:${ORANGE};">1,800</div><div style="font-size:12px;line-height:16px;color:${BODY};">sliders, sold out</div></td>
<td class="stack stat" width="34%" align="center" style="padding:18px 8px;"><div style="font-size:26px;font-weight:900;color:${ORANGE};">$72,500</div><div style="font-size:12px;line-height:16px;color:${BODY};">tickets + sponsorships</div></td>
<td class="stack stat" width="33%" align="center" style="padding:18px 8px;"><div style="font-size:26px;font-weight:900;color:${ORANGE};">$40,000</div><div style="font-size:12px;line-height:16px;color:${BODY};">from 8 local sponsors</div></td>
</tr>
<tr><td colspan="3" align="center" style="padding:0 16px 14px;font-size:12px;color:${MUTED};">City of Fredericksburg, VA, as reported by their Economic Development &amp; Tourism office</td></tr>
</table>
</td></tr>


<tr><td class="px" style="padding:18px 32px 0;">
<div style="font-size:11px;font-weight:bold;letter-spacing:1.4px;text-transform:uppercase;color:${MUTED};text-align:center;margin-bottom:10px;">Trusted by cities, festivals &amp; the U.S. military</div>
<div style="text-align:center;font-size:0;line-height:0;">
${TRUSTED.map(t => `<span style="display:inline-block;margin:0 4px 8px;padding:7px 12px;border:1px solid #E6E9EE;border-radius:100px;font-size:12px;line-height:14px;font-weight:bold;color:${INK};white-space:nowrap;">${t}</span>`).join("")}
</div>
</td></tr>

<tr><td class="px" style="padding:20px 32px 4px;">
<div style="font-size:13px;font-weight:bold;letter-spacing:1.2px;text-transform:uppercase;color:${INK};margin-bottom:10px;">Why cities book it</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
${WHY.map(([h, d]) => `<tr><td width="26" valign="top" style="padding:2px 0 12px;font-size:16px;line-height:21px;color:${ORANGE};font-weight:900;">&#10003;</td><td style="padding:0 0 12px;font-size:15px;line-height:22px;color:${BODY};"><strong style="color:${INK};">${h}</strong> ${d}</td></tr>`).join("")}
</table>
</td></tr>

<tr><td class="px" style="padding:22px 32px 4px;">
<div style="font-size:13px;font-weight:bold;letter-spacing:1.2px;text-transform:uppercase;color:${INK};margin-bottom:10px;">Two ways to bring it to ${esc(city)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td class="stack stack-pad" width="50%" valign="top" style="padding-right:6px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #E6E9EE;border-radius:12px;"><tr><td style="padding:16px;font-size:14px;line-height:21px;color:${BODY};">
  <strong style="color:${INK};font-size:15px;">Turnkey event</strong><br>We bring the slide, trained crew, setup, teardown and marketing support. You pick the street.
  </td></tr></table>
</td>
<td class="stack stack-pad" width="50%" valign="top" style="padding-left:6px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #E6E9EE;border-radius:12px;"><tr><td style="padding:16px;font-size:14px;line-height:21px;color:${BODY};">
  <strong style="color:${INK};font-size:15px;">Own the slide</strong><br>Buy your own Urban Slide and run it every year, with our team training and supporting you.
  </td></tr></table>
</td>
</tr></table>
</td></tr>

<tr><td class="px" style="padding:18px 32px 0;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td width="50%" style="padding-right:4px;"><img src="${SITE}/email/slide-rider.jpg" width="264" alt="A rider on The Urban Slide" style="display:block;width:100%;height:auto;border:0;border-radius:10px;"></td>
<td width="50%" style="padding-left:4px;"><img src="${SITE}/email/slide-bridge.jpg" width="264" alt="The Urban Slide on a downtown overpass" style="display:block;width:100%;height:auto;border:0;border-radius:10px;"></td>
</tr></table>
</td></tr>

<tr><td class="px" style="padding:22px 32px 0;font-size:16px;line-height:25px;color:${BODY};">
<p style="margin:0 0 16px;">The packet below has a two-day revenue example: up to <strong>$67,500</strong> in ticket sales if all 10 waves sell out at 225 riders and $30 a ticket. It also has our sponsorship guide and the full recommendation letter from Fredericksburg. 2027 dates are first-come, first-served.</p>
</td></tr>

<tr><td class="px" align="left" style="padding:4px 32px 8px;">
${button(PACKET, "See the revenue example →")}
</td></tr>
<tr><td class="px" style="padding:6px 32px 18px;font-size:14px;line-height:21px;color:${BODY};">
Or just reply to this email with a good time for a 15-minute call. &nbsp;<a href="${FB}" style="color:${BLUE};">See photos &amp; videos on Facebook</a>
</td></tr>

${signature()}`;

  const text = `Howdy${first ? ` ${first}` : ""},

The Urban Slide closes down a city street and turns it into a giant multi-lane waterslide (500-700 ft), an event families, residents and visitors keep talking about. We've run it with cities across the country, and the U.S. Air Force even bought one of our slides.

With ticket sales and local sponsors, it can often pay for itself. Fredericksburg, VA sold out 1,800 slider spots and grossed $72,500 ($32,500 in tickets + $40,000 from 8 sponsors).

Why cities book it: it's newsworthy (local TV, press, social buzz), boosts community morale, gives city leadership a visible win, and brings people downtown.

Past hosts and clients include Fredericksburg VA, Roanoke VA, Lynchburg VA, Gadsden AL, Marble Falls TX, Jacksonville FL, Calgary, the Blueberry Festival, and the U.S. Army, Navy and Air Force.

Two ways to bring it to ${city}:
- Turnkey event: we bring the slide, crew, setup, teardown and marketing support.
- Own the slide: buy your own and run it every year with our support.

Revenue example (up to $67,500 over two days if all 10 waves sell out at 225 riders and $30 a ticket), sponsorship guide and Fredericksburg's recommendation letter:
${PACKET}

We're booking the 2027 season now, first-come, first-served. Reply with a good time for a 15-minute call.

Derrest Williams Jr.
Co-Founder, The Urban Slide & FlowState Experiences
${PHONE} · cityactivations.com · ${FB}

${ADDRESS}
Unsubscribe: reply with "unsubscribe".`;

  return { subject, preheader, html: shell(preheader, inner), text };
}

// ---------------------------------------------------------------------------
// Email 2 — follow-up ("market back"), sent to non-responders a few days later
// ---------------------------------------------------------------------------
export function urbanSlideFollowUp(c: OutreachContact) {
  const first = firstNameOf(c);
  const city = cityOf(c);
  const subject = `Re: A street waterslide for ${city}?`;
  const preheader = `Quick follow-up, plus how cities cover the cost with sponsors.`;

  const inner = `
<tr><td style="padding:0;"><img src="${SITE}/email/slide-arches.jpg" width="600" alt="Riders under the arches of The Urban Slide" style="display:block;width:100%;max-width:600px;height:auto;border:0;"></td></tr>
<tr><td class="px" style="padding:26px 32px 0;font-size:16px;line-height:25px;color:${BODY};">
<p style="margin:0 0 14px;">Howdy${first ? ` ${esc(first)}` : ""},</p>
<p style="margin:0 0 14px;">Following up on The Urban Slide for ${esc(city)}. The question I hear most is <em>"how would we pay for it?"</em> Many host cities offset the cost with two things:</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 14px;">
<tr><td width="28" valign="top" style="font-size:18px;font-weight:900;color:${ORANGE};">1</td><td style="padding:0 0 10px;"><strong style="color:${INK};">Ticketed waves.</strong> 225 riders per 2-hour wave, five waves a day.</td></tr>
<tr><td width="28" valign="top" style="font-size:18px;font-weight:900;color:${ORANGE};">2</td><td><strong style="color:${INK};">Local sponsors</strong> on lane banners, tubes and wristbands. Fredericksburg raised $40,000 from 8 sponsors.</td></tr>
</table>
<p style="margin:0 0 16px;">Would it help if I sent a quick revenue estimate for ${esc(city)}? Just reply with the street or park you have in mind.</p>
</td></tr>
<tr><td class="px" style="padding:0 32px 18px;">${button(PACKET, "View the sponsorship guide →", BLUE)}</td></tr>
${signature()}`;

  const text = `Howdy${first ? ` ${first}` : ""},

Following up on The Urban Slide for ${city}. The question I hear most is "how would we pay for it?" Many host cities offset the cost with two things:

1. Ticketed waves: 225 riders per 2-hour wave, five waves a day.
2. Local sponsors on lane banners, tubes and wristbands. Fredericksburg raised $40,000 from 8 sponsors.

Would it help if I sent a quick revenue estimate for ${city}? Just reply with the street or park you have in mind.

Sponsorship guide: ${PACKET}

Derrest Williams Jr.
${PHONE} · cityactivations.com

${ADDRESS}
Unsubscribe: reply with "unsubscribe".`;

  return { subject, preheader, html: shell(preheader, inner), text };
}
