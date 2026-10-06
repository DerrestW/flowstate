// Personal one-off emails: plain letter look (no banner, no marketing layout) with a branded signature.
// A real logo in the signature makes the message look like it came from a business, not a bulk sender.

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://cityactivations.com").trim().replace(/\/+$/, "");
const PHONE = "(713) 376-8521";
const LOGO = `${SITE}/email/flowstate-wordmark.png`;

function esc(v: unknown) {
  return String(v ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

// Plain-text paragraphs → HTML paragraphs; bare URLs become links
function paragraphs(text: string) {
  return text.trim().split(/\n{2,}/).map(p => {
    const html = esc(p).replace(/\n/g, "<br>").replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" style="color:#1E88E5;">$1</a>');
    return `<p style="margin:0 0 14px;">${html}</p>`;
  }).join("\n");
}

export const SIGNATURE_TEXT = `Derrest Williams Jr.
Co-Founder, FlowState Experiences
${PHONE}
cityactivations.com`;

export function personalEmail(body: string) {
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FFFFFF;">
<div style="max-width:600px;padding:8px 4px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:23px;color:#222222;">
${paragraphs(body)}
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:22px;border-top:1px solid #E6E9EE;">
<tr><td style="padding-top:16px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:21px;color:#3A4250;">
<strong style="color:#14181F;font-size:15px;">Derrest Williams Jr.</strong><br>
Co-Founder, FlowState Experiences<br>
${PHONE} &nbsp;·&nbsp; <a href="${SITE}" style="color:#1E88E5;text-decoration:none;">cityactivations.com</a>
</td></tr>
<tr><td style="padding-top:12px;">
<a href="${SITE}"><img src="${LOGO}" width="220" height="61" alt="FlowState Experiences" style="display:block;width:220px;height:61px;border:0;border-radius:8px;"></a>
</td></tr>
</table>
</div></body></html>`;
  return { html, text: `${body.trim()}\n\n${SIGNATURE_TEXT}` };
}
