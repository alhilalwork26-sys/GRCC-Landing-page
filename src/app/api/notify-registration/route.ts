import { NextRequest, NextResponse } from "next/server";

const ADMIN_EMAIL = "grcc.ailg@gmail.com";
const WA_NUMBER   = "6288298989171";
const SITE_URL    = "https://grcc-landing-page.vercel.app";

// ── Types ─────────────────────────────────────────────────────────────────────
interface RegistrationData {
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
  trainingDate?: string;
  trainingTime?: string;
  trainingLocation?: string;
  trainingFormat?: string;
  trainingColor?: string;
  vaBank?: string;
  vaNumber?: string;
}

function formatRp(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

// ── Email to ADMIN ─────────────────────────────────────────────────────────────
function buildAdminEmail(data: RegistrationData) {
  const badgeColor = data.type === "grup" ? "#10B981" : "#4F46E5";
  const badgeLabel = data.type === "grup" ? "Pendaftaran Grup" : "Pendaftaran Individu";

  return `<!DOCTYPE html>
<html lang="id">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:600px;width:100%;">
  <tr>
    <td style="background:linear-gradient(135deg,#1a1a1a 0%,#333 100%);padding:32px 36px;">
      <span style="display:inline-block;background:${badgeColor};color:#fff;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:4px 12px;border-radius:20px;margin-bottom:12px;">${badgeLabel}</span>
      <p style="margin:0;font-size:22px;font-weight:700;color:#fff;">🎉 Pendaftaran Baru!</p>
      <p style="margin:8px 0 0;font-size:13px;color:rgba(255,255,255,0.6);">${data.trainingTitle}</p>
    </td>
  </tr>
  <tr>
    <td style="padding:32px 36px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f0f0f0;border-radius:12px;overflow:hidden;">
        ${adminRow("Nama Lengkap", data.nama)}
        ${adminRow("Email", `<a href="mailto:${data.email}" style="color:#4F46E5;">${data.email}</a>`)}
        ${adminRow("Telepon", `<a href="tel:${data.telepon}" style="color:#4F46E5;">${data.telepon}</a>`)}
        ${adminRow("Instansi", data.instansi || "-")}
        ${adminRow("Jabatan", data.jabatan || "-")}
        ${data.participantCount ? adminRow("Jumlah Peserta", `${data.participantCount} orang`) : ""}
        ${data.promoCode ? adminRow("Kode Promo", `<span style="background:#f0fdf4;color:#16a34a;padding:2px 8px;border-radius:4px;font-weight:700;">${data.promoCode}</span>`) : ""}
        ${data.finalPrice ? adminRow("Total Pembayaran", `<strong style="color:#1a1a1a;">${formatRp(data.finalPrice)}</strong>`) : ""}
      </table>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
        <tr>
          <td>
            <a href="${SITE_URL}/admin/registrations" style="display:inline-block;background:#1a1a1a;color:#fff;text-decoration:none;padding:11px 22px;border-radius:8px;font-size:13px;font-weight:600;margin-right:10px;">Buka Admin Panel</a>
            <a href="mailto:${data.email}" style="display:inline-block;background:#f5f5f5;color:#1a1a1a;text-decoration:none;padding:11px 22px;border-radius:8px;font-size:13px;font-weight:600;border:1px solid #e5e5e5;">Balas ke Peserta</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="background:#f8f8f8;padding:18px 36px;text-align:center;">
      <p style="margin:0;font-size:11px;color:#bbb;">GRCC — Center for Governance, Risk, Compliance &amp; Competitiveness</p>
    </td>
  </tr>
</table>
</td></tr>
</table>
</body></html>`;
}

function adminRow(label: string, value: string) {
  return `<tr>
    <td style="padding:11px 16px;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#999;background:#fafafa;border-bottom:1px solid #f0f0f0;width:35%;">${label}</td>
    <td style="padding:11px 16px;font-size:13px;color:#333;border-bottom:1px solid #f0f0f0;">${value}</td>
  </tr>`;
}

// ── Email to PARTICIPANT ───────────────────────────────────────────────────────
function buildConfirmationEmail(data: RegistrationData) {
  const c     = data.trainingColor || "#4F46E5";
  const waMsg = encodeURIComponent(
    `Halo Tim GRCC, saya ${data.nama} baru saja mendaftar program *${data.trainingTitle}*. Ingin konfirmasi pendaftaran saya. Terima kasih.`
  );
  const waUrl = `https://wa.me/${WA_NUMBER}?text=${waMsg}`;
  const hasVA = data.vaNumber && data.vaBank;

  const detailRows = [
    data.trainingDate     ? detailRow("📅", "Tanggal",   data.trainingDate)     : "",
    data.trainingTime     ? detailRow("⏰", "Waktu",     data.trainingTime)     : "",
    data.trainingLocation ? detailRow("📍", "Lokasi",    data.trainingLocation) : "",
    data.trainingFormat   ? detailRow("💻", "Format",    data.trainingFormat)   : "",
    data.finalPrice       ? detailRow("💰", "Total Bayar", `<strong style="color:${c};">${formatRp(data.finalPrice)}</strong>`) : "",
  ].filter(Boolean).join("");

  return `<!DOCTYPE html>
<html lang="id">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#F0F0EE;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F0EE;padding:40px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <!-- HEADER -->
  <tr>
    <td style="background:linear-gradient(135deg,${c} 0%,${c}BB 100%);border-radius:16px 16px 0 0;padding:40px;text-align:center;">
      <div style="background:rgba(255,255,255,0.18);border-radius:12px;display:inline-block;padding:8px 18px;margin-bottom:20px;">
        <span style="color:#fff;font-size:14px;font-weight:800;letter-spacing:0.06em;">GRCC</span>
      </div>
      <div style="font-size:48px;line-height:1;margin-bottom:14px;">✅</div>
      <h1 style="margin:0;color:#fff;font-size:24px;font-weight:800;letter-spacing:-0.5px;">Pendaftaran Berhasil!</h1>
      <p style="margin:10px 0 0;color:rgba(255,255,255,0.8);font-size:14px;line-height:1.6;">Selamat, <strong>${data.nama}</strong>! Kami telah menerima pendaftaran Anda.</p>
    </td>
  </tr>

  <!-- BODY -->
  <tr>
    <td style="background:#fff;padding:36px 40px 32px;">

      <!-- Program card -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f8f8;border-radius:12px;overflow:hidden;border-left:4px solid ${c};">
        <tr>
          <td style="padding:16px 20px;">
            <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#999;">Program yang Didaftarkan</p>
            <p style="margin:0;font-size:16px;font-weight:700;color:#1a1a1a;line-height:1.4;">${data.trainingTitle}</p>
          </td>
        </tr>
      </table>

      ${detailRows ? `<!-- Detail -->
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #efefef;border-radius:12px;overflow:hidden;margin-top:20px;">
        ${detailRows}
      </table>` : ""}

      ${hasVA ? `<!-- VA Payment -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
        <tr>
          <td style="background:linear-gradient(135deg,${c}12 0%,${c}06 100%);border:1.5px dashed ${c}50;border-radius:14px;padding:24px;text-align:center;">
            <p style="margin:0 0 6px;font-size:10px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:${c};">Pembayaran — Virtual Account ${data.vaBank}</p>
            <p style="margin:0;font-family:'Courier New',monospace;font-size:26px;font-weight:800;letter-spacing:0.1em;color:#1a1a1a;">${data.vaNumber}</p>
            <p style="margin:6px 0 0;font-size:12px;color:#888;">a.n. Universitas Airlangga</p>
            <div style="margin-top:14px;background:#fff;border-radius:8px;padding:12px 16px;font-size:12px;color:#666;line-height:1.75;text-align:left;">
              ⚠️ Transfer <strong>tepat sesuai nominal</strong> yang tertera di atas.<br/>
              📎 Simpan bukti transfer &amp; <strong>upload di halaman pendaftaran</strong>.
            </div>
          </td>
        </tr>
      </table>` : ""}

      <!-- Next steps -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
        <tr>
          <td style="background:#fffbeb;border-radius:12px;padding:20px 24px;border:1px solid #fde68a;">
            <p style="margin:0 0 14px;font-size:11px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:#92400e;">📋 Langkah Selanjutnya</p>
            ${step("1", hasVA ? "Lakukan pembayaran ke Virtual Account di atas" : "Tunggu instruksi pembayaran dari tim kami")}
            ${step("2", "Upload bukti pembayaran di halaman pendaftaran")}
            ${step("3", "Tim GRCC akan verifikasi dalam <strong>1–2 hari kerja</strong>")}
            ${step("4", "Informasi teknis (link Zoom / venue) dikirim <strong>H-1 sebelum pelatihan</strong>")}
          </td>
        </tr>
      </table>

      <!-- Divider -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0 20px;"><tr><td style="border-top:1px solid #f0f0f0;"></td></tr></table>

      <!-- Data peserta -->
      <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:0.1em;">Ringkasan Pendaftaran</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #efefef;border-radius:10px;overflow:hidden;">
        ${infoRow("Nama",     data.nama)}
        ${infoRow("Instansi", data.instansi || "-")}
        ${infoRow("Jabatan",  data.jabatan  || "-")}
        ${infoRow("Telepon",  data.telepon)}
        ${data.participantCount ? infoRow("Peserta Grup", `${data.participantCount} orang`) : ""}
        ${data.promoCode ? infoRow("Kode Promo", data.promoCode) : ""}
      </table>

      <!-- WhatsApp CTA -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:30px;">
        <tr>
          <td style="text-align:center;">
            <p style="margin:0 0 14px;font-size:14px;color:#555;line-height:1.6;">Ada pertanyaan? Tim GRCC siap membantu Anda!</p>
            <a href="${waUrl}" style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;padding:13px 30px;border-radius:10px;font-size:14px;font-weight:700;">💬 Chat via WhatsApp</a>
            <p style="margin:12px 0 0;font-size:12px;color:#aaa;">atau email ke <a href="mailto:${ADMIN_EMAIL}" style="color:${c};">${ADMIN_EMAIL}</a></p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- FOOTER -->
  <tr>
    <td style="background:#1a1a1a;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;">
      <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#fff;letter-spacing:0.05em;">GRCC</p>
      <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.4);line-height:1.7;">Center for Governance, Risk, Compliance &amp; Competitiveness<br/>Email ini dikirim otomatis — mohon tidak membalas langsung ke email ini</p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body></html>`;
}

function detailRow(emoji: string, label: string, value: string) {
  return `<tr>
    <td style="padding:11px 16px;width:40%;border-bottom:1px solid #f5f5f5;white-space:nowrap;">
      <span style="font-size:13px;">${emoji}</span>
      <span style="font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.08em;margin-left:6px;">${label}</span>
    </td>
    <td style="padding:11px 16px;font-size:13px;color:#333;border-bottom:1px solid #f5f5f5;">${value}</td>
  </tr>`;
}

function infoRow(label: string, value: string) {
  return `<tr>
    <td style="padding:9px 14px;font-size:11px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:0.08em;background:#fafafa;border-bottom:1px solid #f5f5f5;width:35%;">${label}</td>
    <td style="padding:9px 14px;font-size:13px;color:#555;border-bottom:1px solid #f5f5f5;">${value}</td>
  </tr>`;
}

function step(num: string, text: string) {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;"><tr>
    <td style="width:24px;vertical-align:top;padding-top:1px;">
      <div style="width:20px;height:20px;background:#f59e0b;color:#fff;border-radius:50%;text-align:center;line-height:20px;font-size:11px;font-weight:800;">${num}</div>
    </td>
    <td style="padding-left:10px;font-size:13px;color:#78350f;line-height:1.65;">${text}</td>
  </tr></table>`;
}

// ── API Handler ────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body: RegistrationData = await req.json();
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ success: true, skipped: true });
    }

    const send = (to: string[], subject: string, html: string) =>
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ from: "GRCC <onboarding@resend.dev>", to, subject, html }),
      });

    // 1. Notify admin
    await send(
      [ADMIN_EMAIL],
      `🎉 Pendaftaran Baru: ${body.trainingTitle} — ${body.nama}`,
      buildAdminEmail(body)
    );

    // 2. Confirmation to participant
    if (body.email) {
      await send(
        [body.email],
        `✅ Konfirmasi Pendaftaran — ${body.trainingTitle}`,
        buildConfirmationEmail(body)
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("notify-registration error:", err);
    return NextResponse.json({ success: true, error: String(err) });
  }
}
