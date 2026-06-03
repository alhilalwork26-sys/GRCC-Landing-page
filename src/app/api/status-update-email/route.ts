import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const ADMIN_EMAIL = "grcc.ailg@gmail.com";
const WA_NUMBER   = "6288298989171";
const SITE_URL    = "https://grcc-landing-page.vercel.app";

function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;
  return createClient(url, key);
}

function formatRp(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

// ── Email: Dikonfirmasi ────────────────────────────────────────────────────────
function buildConfirmedEmail(data: {
  nama: string;
  trainingTitle: string;
  trainingDate?: string;
  trainingTime?: string;
  trainingLocation?: string;
  trainingFormat?: string;
  vaBank?: string;
  vaNumber?: string;
  finalPrice?: number;
  color: string;
}) {
  const c     = data.color || "#10B981";
  const waMsg = encodeURIComponent(`Halo Tim GRCC, saya ${data.nama} ingin menanyakan detail teknis untuk program *${data.trainingTitle}* yang sudah dikonfirmasi. Terima kasih.`);
  const waUrl = `https://wa.me/${WA_NUMBER}?text=${waMsg}`;

  return `<!DOCTYPE html>
<html lang="id">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#F0F0EE;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F0EE;padding:40px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <!-- HEADER -->
  <tr>
    <td style="background:linear-gradient(135deg,#10B981 0%,#059669 100%);border-radius:16px 16px 0 0;padding:40px;text-align:center;">
      <div style="background:rgba(255,255,255,0.18);border-radius:12px;display:inline-block;padding:8px 18px;margin-bottom:20px;">
        <span style="color:#fff;font-size:14px;font-weight:800;letter-spacing:0.06em;">GRCC</span>
      </div>
      <div style="font-size:52px;line-height:1;margin-bottom:14px;">🎉</div>
      <h1 style="margin:0;color:#fff;font-size:26px;font-weight:800;letter-spacing:-0.5px;">Pendaftaran Dikonfirmasi!</h1>
      <p style="margin:10px 0 0;color:rgba(255,255,255,0.85);font-size:14px;line-height:1.6;">Selamat <strong>${data.nama}</strong>, pembayaran Anda telah diverifikasi.</p>
    </td>
  </tr>

  <!-- BODY -->
  <tr>
    <td style="background:#fff;padding:36px 40px 32px;">

      <!-- Program card -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border-radius:12px;overflow:hidden;border-left:4px solid #10B981;">
        <tr>
          <td style="padding:16px 20px;">
            <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#059669;">Program Terdaftar</p>
            <p style="margin:0;font-size:16px;font-weight:700;color:#1a1a1a;line-height:1.4;">${data.trainingTitle}</p>
          </td>
        </tr>
      </table>

      <!-- Detail training -->
      ${[
        data.trainingDate     ? `<tr><td style="padding:11px 16px;width:40%;border-bottom:1px solid #f5f5f5;"><span style="font-size:13px;">📅</span><span style="font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.08em;margin-left:6px;">Tanggal</span></td><td style="padding:11px 16px;font-size:13px;color:#333;border-bottom:1px solid #f5f5f5;">${data.trainingDate}</td></tr>` : "",
        data.trainingTime     ? `<tr><td style="padding:11px 16px;width:40%;border-bottom:1px solid #f5f5f5;"><span style="font-size:13px;">⏰</span><span style="font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.08em;margin-left:6px;">Waktu</span></td><td style="padding:11px 16px;font-size:13px;color:#333;border-bottom:1px solid #f5f5f5;">${data.trainingTime}</td></tr>` : "",
        data.trainingLocation ? `<tr><td style="padding:11px 16px;width:40%;border-bottom:1px solid #f5f5f5;"><span style="font-size:13px;">📍</span><span style="font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.08em;margin-left:6px;">Lokasi</span></td><td style="padding:11px 16px;font-size:13px;color:#333;border-bottom:1px solid #f5f5f5;">${data.trainingLocation}</td></tr>` : "",
        data.trainingFormat   ? `<tr><td style="padding:11px 16px;width:40%;"><span style="font-size:13px;">💻</span><span style="font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.08em;margin-left:6px;">Format</span></td><td style="padding:11px 16px;font-size:13px;color:#333;">${data.trainingFormat}</td></tr>` : "",
      ].filter(Boolean).length > 0 ? `<table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #efefef;border-radius:12px;overflow:hidden;margin-top:20px;">${[
        data.trainingDate     ? `<tr><td style="padding:11px 16px;width:40%;border-bottom:1px solid #f5f5f5;"><span style="font-size:13px;">📅</span><span style="font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.08em;margin-left:6px;">Tanggal</span></td><td style="padding:11px 16px;font-size:13px;color:#333;border-bottom:1px solid #f5f5f5;">${data.trainingDate}</td></tr>` : "",
        data.trainingTime     ? `<tr><td style="padding:11px 16px;width:40%;border-bottom:1px solid #f5f5f5;"><span style="font-size:13px;">⏰</span><span style="font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.08em;margin-left:6px;">Waktu</span></td><td style="padding:11px 16px;font-size:13px;color:#333;border-bottom:1px solid #f5f5f5;">${data.trainingTime}</td></tr>` : "",
        data.trainingLocation ? `<tr><td style="padding:11px 16px;width:40%;border-bottom:1px solid #f5f5f5;"><span style="font-size:13px;">📍</span><span style="font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.08em;margin-left:6px;">Lokasi</span></td><td style="padding:11px 16px;font-size:13px;color:#333;border-bottom:1px solid #f5f5f5;">${data.trainingLocation}</td></tr>` : "",
        data.trainingFormat   ? `<tr><td style="padding:11px 16px;width:40%;"><span style="font-size:13px;">💻</span><span style="font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.08em;margin-left:6px;">Format</span></td><td style="padding:11px 16px;font-size:13px;color:#333;">${data.trainingFormat}</td></tr>` : "",
      ].filter(Boolean).join("")}</table>` : ""}

      <!-- Info box -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
        <tr>
          <td style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px 24px;">
            <p style="margin:0 0 12px;font-size:11px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:#166534;">✅ Status Pendaftaran</p>
            <p style="margin:0 0 10px;font-size:14px;color:#14532d;line-height:1.7;">Pembayaran Anda telah <strong>terverifikasi</strong>. Tempat Anda di program ini telah <strong>dikonfirmasi</strong>.</p>
            <p style="margin:0;font-size:13px;color:#166534;line-height:1.7;padding:10px 14px;background:#fff;border-radius:8px;">
              📋 <strong>Informasi teknis</strong> (link Zoom / detail venue) akan dikirimkan melalui email dan WhatsApp <strong>H-1 sebelum pelatihan dimulai</strong>.
            </p>
          </td>
        </tr>
      </table>

      <!-- Divider -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0 20px;"><tr><td style="border-top:1px solid #f0f0f0;"></td></tr></table>

      <!-- CTA -->
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="text-align:center;">
            <p style="margin:0 0 14px;font-size:14px;color:#555;">Ada pertanyaan sebelum pelatihan dimulai?</p>
            <a href="${waUrl}" style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;padding:13px 30px;border-radius:10px;font-size:14px;font-weight:700;">💬 Chat via WhatsApp</a>
            <p style="margin:12px 0 0;font-size:12px;color:#aaa;">atau email ke <a href="mailto:${ADMIN_EMAIL}" style="color:#10B981;">${ADMIN_EMAIL}</a></p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- FOOTER -->
  <tr>
    <td style="background:#1a1a1a;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;">
      <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#fff;">GRCC</p>
      <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.4);line-height:1.7;">Center for Governance, Risk, Compliance &amp; Competitiveness</p>
    </td>
  </tr>
</table>
</td></tr>
</table>
</body></html>`;
}

// ── Email: Ditolak ─────────────────────────────────────────────────────────────
function buildRejectedEmail(nama: string, trainingTitle: string) {
  const waMsg = encodeURIComponent(`Halo Tim GRCC, saya ${nama} ingin menanyakan mengenai pendaftaran saya untuk program *${trainingTitle}* yang tidak dikonfirmasi. Terima kasih.`);
  const waUrl = `https://wa.me/${WA_NUMBER}?text=${waMsg}`;

  return `<!DOCTYPE html>
<html lang="id">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#F0F0EE;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F0EE;padding:40px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
  <tr>
    <td style="background:linear-gradient(135deg,#374151 0%,#1f2937 100%);border-radius:16px 16px 0 0;padding:40px;text-align:center;">
      <div style="background:rgba(255,255,255,0.1);border-radius:12px;display:inline-block;padding:8px 18px;margin-bottom:20px;">
        <span style="color:#fff;font-size:14px;font-weight:800;">GRCC</span>
      </div>
      <div style="font-size:52px;line-height:1;margin-bottom:14px;">📋</div>
      <h1 style="margin:0;color:#fff;font-size:24px;font-weight:800;">Informasi Pendaftaran</h1>
      <p style="margin:10px 0 0;color:rgba(255,255,255,0.7);font-size:14px;">Halo <strong>${nama}</strong></p>
    </td>
  </tr>
  <tr>
    <td style="background:#fff;padding:36px 40px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;margin-bottom:24px;">
        <tr>
          <td style="padding:20px 24px;">
            <p style="margin:0 0 8px;font-size:12px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:#991b1b;">⚠️ Status Pendaftaran</p>
            <p style="margin:0;font-size:14px;color:#7f1d1d;line-height:1.75;">Mohon maaf, pendaftaran Anda untuk program <strong>${trainingTitle}</strong> tidak dapat kami proses pada saat ini. Hal ini bisa disebabkan oleh bukti pembayaran yang tidak valid atau informasi yang tidak lengkap.</p>
          </td>
        </tr>
      </table>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
        <tr>
          <td style="padding:0;">
            <p style="margin:0 0 10px;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;color:#64748b;">Langkah Selanjutnya</p>
            <p style="margin:0;font-size:13px;color:#475569;line-height:1.8;">• Hubungi tim kami via WhatsApp untuk klarifikasi<br/>• Siapkan bukti transfer yang valid<br/>• Daftar ulang jika diperlukan</p>
          </td>
        </tr>
      </table>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="text-align:center;">
            <a href="${waUrl}" style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;padding:13px 30px;border-radius:10px;font-size:14px;font-weight:700;">💬 Hubungi Kami</a>
            <p style="margin:12px 0 0;font-size:12px;color:#aaa;">atau email ke <a href="mailto:${ADMIN_EMAIL}" style="color:#4F46E5;">${ADMIN_EMAIL}</a></p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="background:#1a1a1a;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;">
      <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.4);">GRCC — Center for Governance, Risk, Compliance &amp; Competitiveness</p>
    </td>
  </tr>
</table>
</td></tr>
</table>
</body></html>`;
}

// ── Handler ────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { registrationId, newStatus } = await req.json();

    if (!["confirmed", "rejected"].includes(newStatus)) {
      return NextResponse.json({ success: false, message: "Status tidak valid" });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return NextResponse.json({ success: true, skipped: true });

    const supabaseServer = createSupabaseServerClient();
    if (!supabaseServer) {
      return NextResponse.json(
        { success: false, message: "Supabase environment belum dikonfigurasi" },
        { status: 500 }
      );
    }

    // Fetch registration + training
    const { data: reg } = await supabaseServer
      .from("registrations")
      .select("*, training:training_id(*)")
      .eq("id", registrationId)
      .single();

    if (!reg?.email) return NextResponse.json({ success: false, message: "Registrasi tidak ditemukan" });

    const t       = reg.training as Record<string, string | number> | null;
    const fromAddress = process.env.RESEND_FROM_EMAIL
      ? `GRCC <${process.env.RESEND_FROM_EMAIL}>`
      : "GRCC <onboarding@resend.dev>";

    let subject: string;
    let html: string;

    if (newStatus === "confirmed") {
      subject = `🎉 Pendaftaran Dikonfirmasi — ${t?.title ?? "Program GRCC"}`;
      html = buildConfirmedEmail({
        nama:             reg.nama_lengkap,
        trainingTitle:    String(t?.title ?? "Program GRCC"),
        trainingDate:     t?.date_start ? `${t.date_start}${t.date_end ? ` – ${t.date_end}` : ""}` : undefined,
        trainingTime:     String(t?.time ?? ""),
        trainingLocation: String(t?.location ?? ""),
        trainingFormat:   String(t?.format ?? ""),
        vaBank:           String(t?.va_bank ?? ""),
        vaNumber:         String(t?.va_number ?? ""),
        finalPrice:       reg.final_price ?? undefined,
        color:            String(t?.color ?? "#10B981"),
      });
    } else {
      subject = `Informasi Pendaftaran — ${t?.title ?? "Program GRCC"}`;
      html    = buildRejectedEmail(reg.nama_lengkap, String(t?.title ?? "Program GRCC"));
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ from: fromAddress, to: [reg.email], subject, html }),
    });
    const json = await res.json();

    if (!res.ok) console.error("[Resend status-update-email] Error:", json);
    else console.log("[Resend status-update-email] Sent to", reg.email, "id:", json.id);

    return NextResponse.json({ success: res.ok, resendId: json.id });
  } catch (err) {
    console.error("status-update-email error:", err);
    return NextResponse.json({ success: false, error: String(err) });
  }
}
