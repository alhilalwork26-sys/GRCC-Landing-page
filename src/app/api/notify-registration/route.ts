import { NextRequest, NextResponse } from "next/server";

const ADMIN_EMAIL = "grcc.ailg@gmail.com";

function buildRegistrationEmail(data: {
  type: "individu" | "grup";
  trainingTitle: string;
  nama: string;
  email: string;
  instansi: string;
  jabatan: string;
  telepon: string;
  participantCount?: number;
  promoCode?: string;
  finalPrice?: number;
}) {
  const badgeColor = data.type === "grup" ? "#10B981" : "#4F46E5";
  const badgeLabel = data.type === "grup" ? "Pendaftaran Grup" : "Pendaftaran Individu";

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
            <span style="display:inline-block;background:${badgeColor};color:#fff;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:4px 12px;border-radius:20px;margin-bottom:14px;">${badgeLabel}</span>
            <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">🎉 Pendaftaran Baru!</p>
            <p style="margin:8px 0 0;font-size:13px;color:rgba(255,255,255,0.6);">${data.trainingTitle}</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f0f0f0;border-radius:12px;overflow:hidden;">
              ${row("Nama Lengkap", data.nama)}
              ${row("Email", `<a href="mailto:${data.email}" style="color:#4F46E5;">${data.email}</a>`)}
              ${row("Telepon", `<a href="tel:${data.telepon}" style="color:#4F46E5;">${data.telepon}</a>`)}
              ${row("Instansi / Perusahaan", data.instansi || "-")}
              ${row("Jabatan", data.jabatan || "-")}
              ${data.participantCount ? row("Jumlah Peserta", `${data.participantCount} orang`) : ""}
              ${data.promoCode ? row("Kode Promo", `<span style="background:#f0fdf4;color:#16a34a;padding:2px 8px;border-radius:4px;font-weight:700;">${data.promoCode}</span>`) : ""}
              ${data.finalPrice ? row("Total Pembayaran", `<strong style="color:#1a1a1a;">Rp ${data.finalPrice.toLocaleString("id-ID")}</strong>`) : ""}
            </table>

            <!-- Action buttons -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
              <tr>
                <td>
                  <a href="https://grcc-landing-page.vercel.app/admin"
                    style="display:inline-block;background:#1a1a1a;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:13px;font-weight:600;margin-right:12px;">
                    Buka Admin Panel
                  </a>
                  <a href="mailto:${data.email}"
                    style="display:inline-block;background:#f5f5f5;color:#1a1a1a;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:13px;font-weight:600;border:1px solid #e5e5e5;">
                    Balas ke Peserta
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

function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding:12px 16px;font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#999;background:#fafafa;border-bottom:1px solid #f0f0f0;width:35%;">${label}</td>
      <td style="padding:12px 16px;font-size:14px;color:#333;border-bottom:1px solid #f0f0f0;">${value}</td>
    </tr>`;
}

// ── Confirmation email to participant ─────────────────────────────────────────
function buildConfirmationEmail(data: { nama: string; trainingTitle: string }) {
  return `
<!DOCTYPE html>
<html lang="id">
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;max-width:600px;width:100%;">
        <tr>
          <td style="background:linear-gradient(135deg,#4F46E5 0%,#7C3AED 100%);padding:36px 40px;">
            <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;">✅ Pendaftaran Diterima!</p>
            <p style="margin:8px 0 0;font-size:13px;color:rgba(255,255,255,0.7);">${data.trainingTitle}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px;">
            <p style="font-size:15px;line-height:1.7;color:#333;">Halo <strong>${data.nama}</strong>,</p>
            <p style="font-size:15px;line-height:1.7;color:#333;">Pendaftaran Anda untuk <strong>${data.trainingTitle}</strong> telah kami terima. Tim GRCC akan segera memproses dan menghubungi Anda untuk konfirmasi lebih lanjut.</p>
            <div style="background:#f0f4ff;border-left:4px solid #4F46E5;border-radius:0 8px 8px 0;padding:16px 20px;margin:20px 0;">
              <p style="margin:0;font-size:13px;line-height:1.7;color:#4338ca;">
                <strong>Langkah selanjutnya:</strong><br/>
                • Pastikan bukti pembayaran sudah di-upload<br/>
                • Tim kami akan verifikasi dalam 1-2 hari kerja<br/>
                • Informasi lebih lanjut akan dikirim via WhatsApp/email
              </p>
            </div>
            <p style="font-size:15px;line-height:1.7;color:#333;">Ada pertanyaan? Hubungi kami di <a href="mailto:grcc.ailg@gmail.com" style="color:#4F46E5;">grcc.ailg@gmail.com</a></p>
            <p style="font-size:15px;line-height:1.7;color:#333;margin-top:24px;">Salam,<br/><strong>Tim GRCC</strong></p>
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
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      // No API key yet — silently succeed (don't break registration flow)
      return NextResponse.json({ success: true, skipped: true });
    }

    const emailHtml = buildRegistrationEmail(body);
    const confirmHtml = buildConfirmationEmail({
      nama: body.nama,
      trainingTitle: body.trainingTitle,
    });

    // Send to admin
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        from: "GRCC Website <onboarding@resend.dev>",
        to: [ADMIN_EMAIL],
        subject: `🎉 Pendaftaran Baru: ${body.trainingTitle} — ${body.nama}`,
        html: emailHtml,
      }),
    });

    // Send confirmation to participant
    if (body.email) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          from: "GRCC <onboarding@resend.dev>",
          to: [body.email],
          subject: `Konfirmasi Pendaftaran — ${body.trainingTitle}`,
          html: confirmHtml,
        }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Notify registration error:", err);
    // Don't fail the registration itself
    return NextResponse.json({ success: true, error: String(err) });
  }
}
