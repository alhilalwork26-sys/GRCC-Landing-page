import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ADMIN_EMAIL = "grcc.ailg@gmail.com";

function buildVAEmail(data: {
  nama: string;
  trainingTitle: string;
  trainingDate: string;
  vaBank: string;
  vaNumber: string;
  finalPrice: number | null;
  priceLabel: string;
}) {
  const harga = data.finalPrice
    ? `Rp ${data.finalPrice.toLocaleString("id-ID")}`
    : data.priceLabel || "Sesuai kesepakatan";

  return `
<!DOCTYPE html>
<html lang="id">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:600px;width:100%;">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#4F46E5 0%,#7C3AED 100%);padding:36px 40px;">
            <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">💳 Instruksi Pembayaran</p>
            <p style="margin:8px 0 0;font-size:13px;color:rgba(255,255,255,0.7);">${data.trainingTitle}</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">
            <p style="font-size:15px;line-height:1.7;color:#333;">Halo <strong>${data.nama}</strong>,</p>
            <p style="font-size:15px;line-height:1.7;color:#333;">
              Terima kasih telah mendaftar program pelatihan kami. Berikut instruksi pembayaran untuk melengkapi pendaftaran Anda:
            </p>

            <!-- VA Box -->
            <div style="background:linear-gradient(135deg,#f0f4ff,#f5f0ff);border:2px solid #c7d2fe;border-radius:16px;padding:28px;margin:24px 0;text-align:center;">
              <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#6366f1;">Virtual Account ${data.vaBank}</p>
              <p style="margin:0;font-size:32px;font-weight:800;letter-spacing:0.05em;color:#1a1a1a;font-family:monospace;">${data.vaNumber}</p>
              <p style="margin:12px 0 0;font-size:13px;color:#6b7280;">Universitas Airlangga</p>
            </div>

            <!-- Detail -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f0f0f0;border-radius:12px;overflow:hidden;margin-bottom:24px;">
              <tr>
                <td style="padding:12px 16px;font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#999;background:#fafafa;width:40%;border-bottom:1px solid #f0f0f0;">Program</td>
                <td style="padding:12px 16px;font-size:14px;color:#333;border-bottom:1px solid #f0f0f0;">${data.trainingTitle}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px;font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#999;background:#fafafa;border-bottom:1px solid #f0f0f0;">Tanggal</td>
                <td style="padding:12px 16px;font-size:14px;color:#333;border-bottom:1px solid #f0f0f0;">${data.trainingDate}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px;font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#999;background:#fafafa;">Jumlah Pembayaran</td>
                <td style="padding:12px 16px;font-size:15px;font-weight:700;color:#1a1a1a;"><strong>${harga}</strong></td>
              </tr>
            </table>

            <!-- Steps -->
            <div style="background:#f8f8f8;border-radius:12px;padding:20px;">
              <p style="margin:0 0 12px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#999;">Langkah Pembayaran</p>
              <ol style="margin:0;padding-left:20px;font-size:14px;line-height:1.85;color:#444;">
                <li>Buka aplikasi mobile banking atau ATM <strong>${data.vaBank}</strong></li>
                <li>Pilih menu <strong>Transfer / Virtual Account</strong></li>
                <li>Masukkan nomor VA: <strong>${data.vaNumber}</strong></li>
                <li>Pastikan nama tujuan: <strong>Universitas Airlangga</strong></li>
                <li>Masukkan nominal: <strong>${harga}</strong></li>
                <li>Konfirmasi dan simpan bukti transfer</li>
                <li>Upload bukti transfer di portal pendaftaran</li>
              </ol>
            </div>

            <div style="background:#fffbeb;border-left:4px solid #f59e0b;border-radius:0 8px 8px 0;padding:14px 18px;margin-top:20px;">
              <p style="margin:0;font-size:13px;color:#92400e;">
                ⚠️ <strong>Penting:</strong> Pastikan nominal transfer sesuai. VA ini khusus untuk program <strong>${data.trainingTitle}</strong>. Hubungi kami jika ada kendala.
              </p>
            </div>

            <p style="font-size:14px;line-height:1.7;color:#666;margin-top:20px;">
              Pertanyaan? WhatsApp kami atau email ke <a href="mailto:${ADMIN_EMAIL}" style="color:#4F46E5;">${ADMIN_EMAIL}</a>
            </p>
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
    const { trainingId } = await req.json();
    if (!trainingId) return NextResponse.json({ error: "trainingId required" }, { status: 400 });

    // Fetch training data
    const { data: training, error: tErr } = await supabaseAdmin
      .from("training")
      .select("*")
      .eq("id", trainingId)
      .single();

    if (tErr || !training) return NextResponse.json({ error: "Training not found" }, { status: 404 });
    if (!training.va_number || !training.va_bank) {
      return NextResponse.json({ error: "VA belum diisi" }, { status: 400 });
    }

    // Fetch all registrations for this training
    const { data: registrations, error: rErr } = await supabaseAdmin
      .from("registrations")
      .select("nama_lengkap, email, final_price")
      .eq("training_id", trainingId)
      .neq("status", "rejected");

    if (rErr) return NextResponse.json({ error: rErr.message }, { status: 500 });

    const regs = registrations ?? [];
    if (regs.length === 0) {
      return NextResponse.json({ success: true, sent: 0, message: "Tidak ada peserta terdaftar" });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: true, sent: 0, message: "RESEND_API_KEY belum dikonfigurasi" });
    }

    const dateLabel = training.date_start
      ? `${training.date_start}${training.date_end ? ` – ${training.date_end}` : ""}`
      : "Segera";

    let sent = 0;
    for (const reg of regs) {
      if (!reg.email) continue;
      const html = buildVAEmail({
        nama: reg.nama_lengkap,
        trainingTitle: training.title,
        trainingDate: dateLabel,
        vaBank: training.va_bank,
        vaNumber: training.va_number,
        finalPrice: reg.final_price,
        priceLabel: training.price_label ?? "",
      });

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          from: "GRCC <onboarding@resend.dev>",
          to: [reg.email],
          subject: `💳 Instruksi Pembayaran — ${training.title}`,
          html,
        }),
      });

      if (res.ok) sent++;
    }

    // Notify admin too
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        from: "GRCC Website <onboarding@resend.dev>",
        to: [ADMIN_EMAIL],
        subject: `✅ Broadcast VA selesai — ${training.title} (${sent}/${regs.length} terkirim)`,
        html: `<p>Broadcast instruksi VA untuk <strong>${training.title}</strong> telah dikirim ke <strong>${sent}</strong> dari <strong>${regs.length}</strong> peserta.</p><p>VA: <strong>${training.va_bank} ${training.va_number}</strong></p>`,
      }),
    });

    return NextResponse.json({ success: true, sent, total: regs.length });
  } catch (err) {
    console.error("broadcast-va error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
