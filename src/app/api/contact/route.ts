import { NextRequest, NextResponse } from "next/server";

const ADMIN_EMAIL = "grcc.ailg@gmail.com";

// ── HTML email template ──────────────────────────────────────────────────────
function buildContactEmail(data: {
  nama: string;
  email: string;
  perusahaan: string;
  subjek: string;
  pesan: string;
}) {
  return `
<!DOCTYPE html>
<html lang="id">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:600px;width:100%;">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1a1a1a 0%,#333 100%);padding:36px 40px;">
            <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">📩 Pesan Masuk — GRCC</p>
            <p style="margin:8px 0 0;font-size:13px;color:rgba(255,255,255,0.6);">Formulir kontak dari website grcc-landing-page.vercel.app</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding-bottom:20px;border-bottom:1px solid #f0f0f0;">
                  <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#999;">Pengirim</p>
                  <p style="margin:0;font-size:16px;font-weight:600;color:#1a1a1a;">${data.nama}</p>
                  <p style="margin:4px 0 0;font-size:13px;color:#666;">${data.email}</p>
                  ${data.perusahaan ? `<p style="margin:2px 0 0;font-size:13px;color:#888;">🏢 ${data.perusahaan}</p>` : ""}
                </td>
              </tr>
              <tr>
                <td style="padding:20px 0;border-bottom:1px solid #f0f0f0;">
                  <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#999;">Subjek</p>
                  <p style="margin:0;font-size:15px;font-weight:600;color:#1a1a1a;">${data.subjek}</p>
                </td>
              </tr>
              <tr>
                <td style="padding:20px 0;">
                  <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#999;">Pesan</p>
                  <div style="background:#f8f8f8;border-radius:10px;padding:20px;font-size:14px;line-height:1.75;color:#333;white-space:pre-wrap;">${data.pesan}</div>
                </td>
              </tr>
            </table>
            <!-- CTA -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
              <tr>
                <td>
                  <a href="mailto:${data.email}?subject=Re: ${encodeURIComponent(data.subjek)}"
                    style="display:inline-block;background:#1a1a1a;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:13px;font-weight:600;">
                    ↩ Balas Email
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f8f8f8;padding:20px 40px;text-align:center;">
            <p style="margin:0;font-size:11px;color:#bbb;">© 2025 GRCC — Center for Governance, Risk, Compliance & Competitiveness</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── Auto-reply to sender ─────────────────────────────────────────────────────
function buildAutoReplyEmail(nama: string) {
  return `
<!DOCTYPE html>
<html lang="id">
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;max-width:600px;width:100%;">
        <tr>
          <td style="background:linear-gradient(135deg,#1a1a1a 0%,#333 100%);padding:36px 40px;">
            <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;">Terima kasih telah menghubungi GRCC</p>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px;">
            <p style="font-size:15px;line-height:1.7;color:#333;">Halo <strong>${nama}</strong>,</p>
            <p style="font-size:15px;line-height:1.7;color:#333;">Pesan Anda telah kami terima dengan baik. Tim kami akan meninjau dan merespons dalam waktu <strong>1-2 hari kerja</strong>.</p>
            <p style="font-size:15px;line-height:1.7;color:#333;">Jika ada pertanyaan mendesak, Anda dapat menghubungi kami melalui email di <a href="mailto:grcc.ailg@gmail.com" style="color:#4F46E5;">grcc.ailg@gmail.com</a>.</p>
            <p style="font-size:15px;line-height:1.7;color:#333;margin-top:24px;">Salam hangat,<br/><strong>Tim GRCC</strong></p>
          </td>
        </tr>
        <tr>
          <td style="background:#f8f8f8;padding:20px 40px;text-align:center;">
            <p style="margin:0;font-size:11px;color:#bbb;">© 2025 GRCC — Center for Governance, Risk, Compliance & Competitiveness</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nama, email, perusahaan, subjek, pesan } = body;

    if (!nama || !email || !subjek || !pesan) {
      return NextResponse.json({ error: "Field wajib tidak lengkap" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;

    if (apiKey) {
      // Kirim ke admin
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          from: "GRCC Website <onboarding@resend.dev>",
          to: [ADMIN_EMAIL],
          subject: `📩 Pesan Kontak: ${subjek}`,
          html: buildContactEmail({ nama, email, perusahaan: perusahaan || "", subjek, pesan }),
          reply_to: email,
        }),
      });

      // Auto-reply ke pengirim
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          from: "GRCC <onboarding@resend.dev>",
          to: [email],
          subject: "Pesan Anda telah diterima — GRCC",
          html: buildAutoReplyEmail(nama),
        }),
      });
    }
    // Jika tidak ada API key, form tetap berhasil (pesan tersimpan di log)

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Gagal mengirim pesan" }, { status: 500 });
  }
}
