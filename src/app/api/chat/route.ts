import Anthropic from "@anthropic-ai/sdk";
import { answerOffline, contactLine, knowledgeToText, loadKnowledge } from "@/lib/chat-knowledge";

export const dynamic = "force-dynamic";

type ChatMessage = { role: "user" | "assistant"; content: string };

function textStream(text: string): ReadableStream {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; ) {
    const size = Math.floor(Math.random() * 4) + 3;
    chunks.push(text.slice(i, i + size));
    i += size;
  }
  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk));
        await new Promise((r) => setTimeout(r, 8 + Math.random() * 12));
      }
      controller.close();
    },
  });
}

const headers = { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" };

function buildSystemPrompt(knowledge: string) {
  const today = new Date().toLocaleDateString("id-ID", {
    timeZone: "Asia/Jakarta", weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
  const c = contactLine();
  return `Kamu adalah "GRCC Assistant", asisten resmi website GRCC (Center for Governance, Risk, Compliance & Competitiveness, AILG Universitas Airlangga). Kamu melayani calon peserta, profesional, akademisi, dan pimpinan organisasi.

Hari ini: ${today}.

ATURAN:
- Jawab dalam Bahasa Indonesia yang hangat, ringkas, dan profesional (maksimal sekitar 150 kata kecuali diminta rinci). Gunakan **tebal** dan bullet bila membantu.
- Jawab HANYA berdasarkan DATA GRCC di bawah. Jangan mengarang harga, tanggal, diskon, narasumber, atau fitur. Jika informasinya tidak ada, katakan terus terang lalu arahkan ke admin (${c.email} / WhatsApp ${c.whatsapp}).
- Pahami maksud pertanyaan walau singkat atau salah ketik, dan ingat konteks percakapan (mis. "harganya berapa?" merujuk ke program yang baru dibahas).
- Pertanyaan umum (mis. apa itu BNSP, apa itu GRC) boleh dijelaskan singkat dengan pengetahuan umum, lalu kaitkan dengan program GRCC yang relevan bila ada.
- Bila pengunjung menanyakan jenis program tertentu (mis. BNSP, ESG, audit), cek daftar program di data; sebutkan yang cocok beserta tanggal, format, harga, dan tautan. Jika tidak ada yang cocok, katakan belum ada yang dibuka dan tawarkan menghubungi admin atau menyebut program "segera hadir" yang relevan.
- Program yang bertanda [SUDAH SELESAI] jangan ditawarkan untuk didaftar.
- Jangan pernah meminta atau menyebut nomor rekening/VA. Instruksi pembayaran hanya tampil di formulir pendaftaran; untuk yang butuh Faktur Pajak, VA dikirim admin dan peserta tidak boleh transfer lebih dulu.
- Sertakan tautan Markdown ke halaman program/daftar bila relevan.
- Jika pertanyaan di luar topik GRCC, tolak dengan sopan dan kembalikan ke topik layanan GRCC.

DATA GRCC (real-time dari website):
${knowledge}`;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const messages: ChatMessage[] = Array.isArray(body.messages)
    ? body.messages
        .filter((m: ChatMessage) => (m?.role === "user" || m?.role === "assistant") && typeof m.content === "string" && m.content.trim())
        .slice(-12)
        .map((m: ChatMessage) => ({ role: m.role, content: m.content.slice(0, 2000) }))
    : [];
  const last = messages[messages.length - 1];
  if (!last || last.role !== "user") {
    return new Response("Silakan tulis pertanyaan Anda.", { headers });
  }

  const kb = await loadKnowledge();
  const offline = () => answerOffline(last.content, messages.slice(0, -1), kb);

  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const stream = client.messages.stream({
        model: "claude-haiku-4-5",
        max_tokens: 900,
        system: buildSystemPrompt(knowledgeToText(kb)),
        messages,
      });

      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          let sent = false;
          try {
            for await (const event of stream) {
              if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
                sent = true;
                controller.enqueue(encoder.encode(event.delta.text));
              }
            }
          } catch (err) {
            console.error("[chat] Claude error:", err);
            if (!sent) controller.enqueue(encoder.encode(offline()));
          } finally {
            controller.close();
          }
        },
      });
      return new Response(readable, { headers });
    } catch (err) {
      console.error("[chat] Claude init error:", err);
    }
  }

  return new Response(textStream(offline()), { headers });
}
