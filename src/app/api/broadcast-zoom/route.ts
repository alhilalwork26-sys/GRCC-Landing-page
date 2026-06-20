import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const ADMIN_EMAIL = "grcc.ailg@gmail.com";

function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;
  return createClient(url, key);
}

function sanitizePhone(phone: string | null) {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  if (digits.startsWith("62")) return digits;
  return digits;
}

function buildZoomMessage(data: {
  nama: string;
  trainingTitle: string;
  trainingDate: string;
  trainingTime: string;
  zoomLink: string;
  notes: string;
}) {
  return [
    `Halo ${data.nama},`,
    "",
    `Berikut link Zoom untuk pelatihan GRCC:`,
    `*${data.trainingTitle}*`,
    "",
    `Tanggal: ${data.trainingDate}`,
    data.trainingTime ? `Waktu: ${data.trainingTime}` : "",
    `Link Zoom: ${data.zoomLink}`,
    data.notes ? `Catatan: ${data.notes}` : "",
    "",
    "Mohon hadir 10 menit sebelum sesi dimulai. Terima kasih.",
  ].filter(Boolean).join("\n");
}

function buildZoomEmail(data: {
  nama: string;
  trainingTitle: string;
  trainingDate: string;
  trainingTime: string;
  zoomLink: string;
  notes: string;
}) {
  return `
<!DOCTYPE html>
<html lang="id">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:600px;width:100%;">
        <tr>
          <td style="background:linear-gradient(135deg,#2563eb 0%,#4f46e5 100%);padding:34px 40px;">
            <p style="margin:0;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">Link Zoom Pelatihan</p>
            <p style="margin:8px 0 0;font-size:13px;color:rgba(255,255,255,0.78);">${data.trainingTitle}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px;">
            <p style="font-size:15px;line-height:1.7;color:#333;margin-top:0;">Halo <strong>${data.nama}</strong>,</p>
            <p style="font-size:15px;line-height:1.7;color:#333;">
              Berikut informasi akses Zoom untuk mengikuti pelatihan GRCC:
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eef2ff;border-radius:14px;overflow:hidden;margin:22px 0;">
              <tr>
                <td style="padding:13px 16px;font-size:11px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;color:#64748b;background:#f8fafc;width:38%;border-bottom:1px solid #eef2ff;">Program</td>
                <td style="padding:13px 16px;font-size:14px;color:#1f2937;border-bottom:1px solid #eef2ff;">${data.trainingTitle}</td>
              </tr>
              <tr>
                <td style="padding:13px 16px;font-size:11px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;color:#64748b;background:#f8fafc;border-bottom:1px solid #eef2ff;">Tanggal</td>
                <td style="padding:13px 16px;font-size:14px;color:#1f2937;border-bottom:1px solid #eef2ff;">${data.trainingDate}</td>
              </tr>
              ${
                data.trainingTime
                  ? `<tr><td style="padding:13px 16px;font-size:11px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;color:#64748b;background:#f8fafc;border-bottom:1px solid #eef2ff;">Waktu</td><td style="padding:13px 16px;font-size:14px;color:#1f2937;border-bottom:1px solid #eef2ff;">${data.trainingTime}</td></tr>`
                  : ""
              }
              <tr>
                <td style="padding:13px 16px;font-size:11px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;color:#64748b;background:#f8fafc;">Link Zoom</td>
                <td style="padding:13px 16px;font-size:14px;color:#1f2937;"><a href="${data.zoomLink}" style="color:#4f46e5;font-weight:700;">${data.zoomLink}</a></td>
              </tr>
            </table>
            ${
              data.notes
                ? `<div style="background:#f8fafc;border-left:4px solid #4f46e5;border-radius:0 10px 10px 0;padding:14px 18px;margin:18px 0;"><p style="margin:0;font-size:13px;color:#475569;line-height:1.7;">${data.notes}</p></div>`
                : ""
            }
            <p style="font-size:14px;line-height:1.7;color:#666;">
              Mohon hadir 10 menit sebelum sesi dimulai. Jika ada kendala akses, hubungi tim GRCC melalui email <a href="mailto:${ADMIN_EMAIL}" style="color:#4f46e5;">${ADMIN_EMAIL}</a>.
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#f8f8f8;padding:20px 40px;text-align:center;">
            <p style="margin:0;font-size:11px;color:#aaa;">© 2026 GRCC — Center for Governance, Risk, Compliance & Competitiveness</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

async function sendWhatsApp(to: string, message: string) {
  const apiUrl = process.env.WHATSAPP_API_URL;
  const token = process.env.WHATSAPP_API_TOKEN;

  if (!apiUrl || !token) return false;

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ to, message }),
  });

  return res.ok;
}

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.ADMIN_SECRET;
    if (secret && req.cookies.get("admin_session")?.value !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { trainingId, zoomLink, notes = "" } = await req.json();
    if (!trainingId) return NextResponse.json({ error: "trainingId required" }, { status: 400 });
    if (!zoomLink || typeof zoomLink !== "string") {
      return NextResponse.json({ error: "Link Zoom wajib diisi" }, { status: 400 });
    }

    const supabaseAdmin = createSupabaseAdminClient();
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Supabase environment belum dikonfigurasi" }, { status: 500 });
    }

    const { data: training, error: tErr } = await supabaseAdmin
      .from("training")
      .select("*")
      .eq("id", trainingId)
      .single();

    if (tErr || !training) return NextResponse.json({ error: "Training tidak ditemukan" }, { status: 404 });

    const { data: registrations, error: rErr } = await supabaseAdmin
      .from("registrations")
      .select("nama_lengkap, email, telepon")
      .eq("training_id", trainingId)
      .neq("status", "rejected");

    if (rErr) return NextResponse.json({ error: rErr.message }, { status: 500 });

    const regs = registrations ?? [];
    if (regs.length === 0) {
      return NextResponse.json({ success: true, total: 0, emailSent: 0, whatsappSent: 0, message: "Tidak ada peserta terdaftar" });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const dateLabel = training.date_start
      ? `${training.date_start}${training.date_end ? ` – ${training.date_end}` : ""}`
      : "Segera";

    let emailSent = 0;
    let whatsappSent = 0;
    const whatsappLinks: { name: string; phone: string; href: string }[] = [];

    for (const reg of regs) {
      const nama = reg.nama_lengkap || "Peserta";
      const message = buildZoomMessage({
        nama,
        trainingTitle: training.title,
        trainingDate: dateLabel,
        trainingTime: training.time ?? "",
        zoomLink,
        notes,
      });
      const phone = sanitizePhone(reg.telepon);

      if (phone) {
        whatsappLinks.push({
          name: nama,
          phone,
          href: `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
        });

        if (await sendWhatsApp(phone, message)) whatsappSent++;
      }

      if (!apiKey || !reg.email) continue;

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          from: "GRCC <onboarding@resend.dev>",
          to: [reg.email],
          subject: `Link Zoom Pelatihan — ${training.title}`,
          html: buildZoomEmail({
            nama,
            trainingTitle: training.title,
            trainingDate: dateLabel,
            trainingTime: training.time ?? "",
            zoomLink,
            notes,
          }),
        }),
      });

      if (res.ok) emailSent++;
    }

    if (apiKey) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          from: "GRCC Website <onboarding@resend.dev>",
          to: [ADMIN_EMAIL],
          subject: `Broadcast Zoom selesai — ${training.title}`,
          html: `<p>Broadcast link Zoom untuk <strong>${training.title}</strong> selesai.</p><p>Email terkirim: <strong>${emailSent}/${regs.length}</strong></p><p>WhatsApp gateway: <strong>${whatsappSent}/${whatsappLinks.length}</strong></p>`,
        }),
      });
    }

    return NextResponse.json({
      success: true,
      total: regs.length,
      emailSent,
      whatsappSent,
      whatsappTotal: whatsappLinks.length,
      whatsappGatewayConfigured: Boolean(process.env.WHATSAPP_API_URL && process.env.WHATSAPP_API_TOKEN),
      whatsappLinks: whatsappLinks.slice(0, 20),
    });
  } catch (err) {
    console.error("broadcast-zoom error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
