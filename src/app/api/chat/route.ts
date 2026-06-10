// ── FAQ-based chatbot (no API key required) ───────────────────────────────────
// Ketika ANTHROPIC_API_KEY tersedia, akan upgrade ke Claude AI otomatis.

import Anthropic from "@anthropic-ai/sdk";

// ── FAQ Database ──────────────────────────────────────────────────────────────
interface FAQEntry {
  keywords: string[];
  answer: string;
  priority?: number;
}

const FAQ: FAQEntry[] = [
  // ── Greeting ──
  {
    keywords: ["halo", "hai", "hi", "hello", "selamat", "pagi", "siang", "sore", "malam", "hei", "assalamualaikum"],
    priority: 10,
    answer: `Halo! Selamat datang di GRCC Assistant 👋

Saya siap membantu Anda mengetahui lebih lanjut tentang program pelatihan dan layanan GRCC. Silakan tanyakan apa saja tentang:

- **Program & pelatihan** yang tersedia
- **Cara mendaftar** training
- **Jadwal & format** (online/offline)
- **Kontak** GRCC

Ada yang bisa saya bantu?`,
  },

  // ── Semua program ──
  {
    keywords: ["program apa", "program saja", "daftar program", "semua program", "ada program apa", "program yang ada", "pilihan program", "list program", "mau tau program"],
    priority: 9,
    answer: `GRCC memiliki **8 Program Unggulan** yang dirancang untuk para profesional dan pemimpin organisasi:

- **GRC** — Governance, Risk & Compliance
- **ESG** — ESG & Keberlanjutan Bisnis
- **ACC** — Accounting & Pelaporan Keuangan
- **AUD** — Auditing & Pengendalian Internal
- **OC** — Organizational Competitiveness
- **HCM** — Human Capital Management
- **DTF** — Digital & Technology in Finance
- **RES** — Penelitian & Publikasi Ilmiah

Setiap program tersedia dalam format **workshop, pelatihan bersertifikat, konferensi eksekutif**, dan **in-house training**. Mau tahu detail program tertentu?`,
  },

  // ── GRC ──
  {
    keywords: ["grc", "governance", "risk", "compliance", "tata kelola", "manajemen risiko", "kepatuhan", "coso", "iso 31000", "gcg", "good corporate", "internal control", "whistleblow"],
    answer: `**Program GRC — Governance, Risk & Compliance** adalah program unggulan GRCC yang paling diminati.

**Topik yang dibahas:**
- Good Corporate Governance (GCG)
- Manajemen Risiko berbasis ISO 31000
- Implementasi COSO Framework
- Internal Control & Internal Audit
- Kepatuhan Regulasi & Hukum Perusahaan
- Whistleblowing System
- Penyusunan Roadmap Tata Kelola

**Cocok untuk:** Direktur, Board Member, Risk Officer, Compliance Officer, Internal Auditor, BUMN/Swasta.

Ingin tahu cara mendaftar atau jadwal terdekat?`,
  },

  // ── ESG ──
  {
    keywords: ["esg", "keberlanjutan", "sustainability", "lingkungan", "green", "carbon", "iklim", "sdg", "csr", "hijau", "emisi"],
    answer: `**Program ESG — ESG & Keberlanjutan Bisnis** mempersiapkan organisasi menghadapi tuntutan keberlanjutan global.

**Topik yang dibahas:**
- ESG Reporting & Disclosure
- Green Finance & Sustainable Investment
- Strategi Keberlanjutan Bisnis
- Climate Risk Management
- Carbon Footprint & Net Zero
- Penyelarasan dengan SDGs

**Cocok untuk:** Sustainability Officer, CSR Manager, CFO, Komisaris, Manajemen Senior.

Program ini makin relevan seiring regulasi ESG yang terus berkembang di Indonesia. Mau info lebih lanjut?`,
  },

  // ── Accounting ──
  {
    keywords: ["accounting", "akuntansi", "psak", "ifrs", "laporan keuangan", "keuangan", "acc", "akuntan", "finance", "neraca"],
    answer: `**Program ACC — Accounting & Pelaporan Keuangan** dirancang untuk meningkatkan kompetensi keuangan profesional.

**Topik yang dibahas:**
- Pelaporan Keuangan berbasis PSAK & IFRS
- Akuntansi Manajemen & Pengendalian Biaya
- Konsolidasi Laporan Keuangan
- Perpajakan Perusahaan
- Analisis Laporan Keuangan

**Cocok untuk:** CFO, Finance Manager, Controller, Akuntan Senior, Manajer Keuangan.

Ada pertanyaan lain tentang program ini?`,
  },

  // ── Auditing ──
  {
    keywords: ["audit", "auditing", "aud", "icofr", "auditor", "three lines", "bpkp", "forensic", "pemeriksaan"],
    answer: `**Program AUD — Auditing & Pengendalian Internal** membekali auditor dengan keahlian praktis dan berbasis risiko.

**Topik yang dibahas:**
- ICoFR — Internal Control over Financial Reporting
- Audit Internal Berbasis Risiko
- Three Lines of Defense Model
- Forensic Audit & Fraud Investigation
- Audit Sektor Publik (BPKP/BPK)

**Cocok untuk:** Internal Auditor, Eksternal Auditor, Audit Committee, Inspektorat, BPKP.

GRCC bahkan sudah menyelenggarakan Executive Conference ICoFR 2026 bersama AEEC Universitas Airlangga. Mau info lebih lanjut?`,
  },

  // ── OC ──
  {
    keywords: ["oc", "organizational", "competitiveness", "daya saing", "strategi", "transformasi", "leadership", "change management", "bisnis", "organisasi"],
    answer: `**Program OC — Organizational Competitiveness** membantu organisasi meningkatkan daya saing dan ketangguhan strategis.

**Topik yang dibahas:**
- Strategi Bisnis & Competitive Advantage
- Transformasi Organisasi
- Leadership & Change Management
- Business Process Improvement
- Balanced Scorecard & KPI

**Cocok untuk:** CEO, Direktur, Manajer Senior, Konsultan Manajemen.

Apakah ada topik spesifik yang Anda cari dalam program ini?`,
  },

  // ── HCM ──
  {
    keywords: ["hcm", "human capital", "sdm", "hr", "talent", "sumber daya manusia", "rekrutmen", "karyawan", "people", "learning"],
    answer: `**Program HCM — Human Capital Management** berfokus pada pengelolaan dan pengembangan SDM secara strategis.

**Topik yang dibahas:**
- HR Strategy & Workforce Planning
- Talent Management & Succession Planning
- Performance Management System
- Organizational Development
- Learning & Development Strategy

**Cocok untuk:** HR Director, CHRO, Talent Manager, People & Culture Lead, HRD.

Mau tahu lebih detail tentang topik tertentu?`,
  },

  // ── DTF ──
  {
    keywords: ["dtf", "digital", "teknologi", "fintech", "ai", "data", "erp", "cyber", "transformasi digital", "sistem informasi", "it"],
    answer: `**Program DTF — Digital & Technology in Finance** mempersiapkan organisasi di era transformasi digital.

**Topik yang dibahas:**
- Digital Transformation Strategy
- AI & Data Analytics dalam Keuangan
- Fintech & Regulatory Technology (RegTech)
- Cybersecurity for Finance
- ERP Implementation & Optimization
- Blockchain dalam Keuangan

**Cocok untuk:** CTO, CIO, Finance Tech Lead, Digital Transformation Officer, IT Manager.

Apakah Anda ingin tahu lebih lanjut tentang topik tertentu?`,
  },

  // ── Penelitian ──
  {
    keywords: ["penelitian", "riset", "res", "jurnal", "publikasi", "akademisi", "skripsi", "thesis", "metodologi", "statistik", "s2", "s3"],
    answer: `**Program RES — Penelitian & Publikasi Ilmiah** mendukung akademisi dan praktisi dalam menghasilkan karya riset berkualitas.

**Topik yang dibahas:**
- Metodologi Penelitian Kuantitatif & Kualitatif
- Penulisan & Publikasi Jurnal Ilmiah
- Riset Terapan untuk Kebijakan
- Analisis Data Statistik (SPSS, R, Stata)
- Systematic Literature Review

**Cocok untuk:** Akademisi, Dosen, Mahasiswa S2/S3, Peneliti, Praktisi yang ingin publikasi.

Ada yang ingin Anda tanyakan lebih lanjut?`,
  },

  // ── Cara daftar ──
  {
    keywords: ["daftar", "mendaftar", "pendaftaran", "cara daftar", "bagaimana daftar", "registrasi", "ikut", "ikuti", "join", "gabung"],
    answer: `Cara mendaftar program GRCC sangat mudah! Berikut langkahnya:

**1.** Kunjungi halaman **Training** di website grcc.id
**2.** Pilih program yang sesuai kebutuhan Anda
**3.** Klik tombol **"Daftar"** pada program yang dipilih
**4.** Isi formulir pendaftaran (nama, instansi, jabatan, email, telepon)
**5.** Lakukan pembayaran sesuai instruksi
**6.** Konfirmasi otomatis dikirim ke email Anda

Untuk **In-House Training** (pelatihan di kantor Anda), silakan hubungi GRCC langsung melalui email **grcc.ailg@gmail.com** untuk konsultasi kebutuhan.

Ada yang bisa saya bantu lagi?`,
  },

  // ── Harga ──
  {
    keywords: ["harga", "biaya", "bayar", "payment", "tarif", "berapa", "fee", "investasi", "cost", "rupiah"],
    answer: `Untuk informasi harga terbaru setiap program, silakan cek langsung di halaman **Training** pada website grcc.id karena harga dapat berubah sesuai batch dan periode.

Secara umum, harga dipengaruhi oleh:
- **Durasi** program (1 hari / multi-sesi)
- **Format** (online lebih terjangkau dari in-person)
- **Jenis peserta** (individu / grup / instansi)

GRCC juga menyediakan **kode promo** untuk early bird dan pendaftaran grup. Cek promo terbaru di halaman Training!

Apakah ada program tertentu yang ingin Anda ketahui harganya?`,
  },

  // ── Online / Format ──
  {
    keywords: ["online", "offline", "zoom", "format", "hybrid", "in person", "tatap muka", "virtual", "webinar"],
    answer: `GRCC menyediakan program dalam berbagai format yang fleksibel:

- **Online** — via Zoom, bisa diikuti dari mana saja
- **In-Person** — tatap muka, biasanya di Yogyakarta atau kota lain
- **Hybrid** — kombinasi online & tatap muka
- **In-House** — khusus di kantor/instansi Anda (bisa dikustomisasi)

Cek format tersedia untuk tiap program di halaman **Training** di website. Ada yang ingin Anda tanyakan lebih lanjut?`,
  },

  // ── In-house ──
  {
    keywords: ["in house", "in-house", "inhouse", "kantor", "instansi", "perusahaan", "khusus", "custom", "korporat", "corporate"],
    answer: `**In-House Training** adalah layanan eksklusif GRCC di mana pelatihan diselenggarakan **di kantor atau instansi Anda** sendiri.

**Keunggulan In-House Training:**
- Materi bisa dikustomisasi sesuai kebutuhan spesifik organisasi
- Lebih hemat untuk peserta dalam jumlah besar
- Waktu & lokasi disesuaikan dengan jadwal perusahaan
- Narasumber berpengalaman dari praktisi industri

**Cocok untuk:** BUMN, perusahaan swasta, kementerian, instansi pemerintah, universitas.

Untuk konsultasi dan penawaran In-House Training, hubungi GRCC di **grcc.ailg@gmail.com**. Tim kami siap membantu merancang program yang tepat untuk organisasi Anda.`,
  },

  // ── Sertifikat ──
  {
    keywords: ["sertifikat", "sertifikasi", "certificate", "ijazah", "bukti", "lulus"],
    answer: `Ya! Peserta yang menyelesaikan program GRCC akan mendapatkan **sertifikat** sebagai bukti kompetensi yang diakui.

Sertifikat GRCC berguna untuk:
- Meningkatkan **kredensial profesional** Anda
- Persyaratan **kenaikan jabatan** di instansi
- Portofolio **kompetensi** di bidang tata kelola & keuangan
- Kebutuhan **akreditasi** atau audit internal

Detail sertifikasi bisa berbeda tiap program. Cek halaman Training untuk info lengkap, atau hubungi **grcc.ailg@gmail.com**.`,
  },

  // ── Kontak ──
  {
    keywords: ["kontak", "hubungi", "contact", "email", "telepon", "whatsapp", "wa", "alamat", "lokasi", "kantor grcc", "di mana"],
    answer: `Berikut cara menghubungi GRCC:

- **Email:** grcc.ailg@gmail.com
- **WhatsApp:** +62 882-9898-9171
- **Website:** grcc.id
- **Lokasi:** Surabaya, Indonesia
- **Kolaborasi:** AILG — Universitas Airlangga, Surabaya

Tim GRCC siap membantu Anda untuk:
- Informasi program & pendaftaran
- Konsultasi In-House Training
- Kerjasama institusional
- Pertanyaan lainnya

Jangan ragu untuk menghubungi kami — kami akan merespons secepat mungkin! 😊`,
  },

  // ── Rekomendasi ──
  {
    keywords: ["rekomen", "cocok", "sesuai", "untuk saya", "pilih mana", "saran", "suggest", "mana yang", "bagus untuk"],
    answer: `Dengan senang hati saya bantu merekomendasikan program yang tepat! 😊

Boleh saya tahu sedikit tentang Anda:

- **Apa jabatan/profesi Anda?** (misal: auditor, HR manager, direktur, akademisi)
- **Di bidang apa organisasi Anda bergerak?** (misal: BUMN, swasta, pemerintahan, perbankan)
- **Apa tujuan utama Anda mengikuti pelatihan?** (misal: sertifikasi, upgrade skill, kebutuhan regulasi)

Dengan info tersebut, saya bisa berikan rekomendasi yang lebih tepat sasaran! Atau jika ingin gambaran umum, GRCC punya 8 program — mulai dari **GRC, ESG, Auditing, HCM** hingga **Digital & Finance**.`,
  },

  // ── GRCC itu apa ──
  {
    keywords: ["grcc itu", "apa itu grcc", "tentang grcc", "grcc adalah", "sejarah grcc", "profil grcc", "lembaga", "siapa grcc"],
    answer: `**GRCC (Center for Governance, Risk, Compliance & Competitiveness)** adalah pusat pengembangan profesional dan konsultasi terkemuka di Indonesia.

**Fokus GRCC:**
- Tata Kelola Organisasi (Governance)
- Manajemen Risiko (Risk Management)
- Kepatuhan Regulasi (Compliance)
- Daya Saing Organisasi (Competitiveness)

**Kolaborasi:** GRCC bekerja sama dengan **Airlangga Executive Education Center (AEEC) Universitas Airlangga**, Yogyakarta — salah satu universitas terbaik di Indonesia.

**Layanan GRCC:**
- Pelatihan & Workshop Profesional
- Konferensi Eksekutif
- In-House Training
- Konsultasi Strategis
- Penelitian & Publikasi

GRCC telah melayani profesional dari BUMN, perusahaan swasta, instansi pemerintah, dan akademisi. Ada yang ingin Anda ketahui lebih lanjut?`,
  },

  // ── Terima kasih ──
  {
    keywords: ["terima kasih", "makasih", "thanks", "thank you", "terimakasih", "thx", "mantap", "oke", "bagus", "bantu"],
    priority: 8,
    answer: `Sama-sama! Senang bisa membantu 😊

Jika ada pertanyaan lain tentang program GRCC, jangan ragu untuk bertanya kapan saja. Kami juga bisa dihubungi langsung di **grcc.ailg@gmail.com** untuk informasi lebih lanjut.

Semoga sukses dengan rencana pengembangan Anda! 🚀`,
  },
];

// ── FAQ matcher ───────────────────────────────────────────────────────────────
function findAnswer(userMessage: string): string {
  const msg = userMessage.toLowerCase()
    .replace(/[?!.,]/g, " ")
    .trim();

  let bestMatch: FAQEntry | null = null;
  let bestScore = 0;

  for (const entry of FAQ) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (msg.includes(kw)) {
        score += kw.split(" ").length * 2; // multi-word keywords score higher
      }
    }
    if (score > 0) {
      const adjustedScore = score + (entry.priority ?? 0);
      if (adjustedScore > bestScore) {
        bestScore = adjustedScore;
        bestMatch = entry;
      }
    }
  }

  if (bestMatch) return bestMatch.answer;

  // Default fallback
  return `Terima kasih atas pertanyaan Anda! 😊

Saya tidak menemukan jawaban spesifik untuk pertanyaan tersebut. Untuk informasi lebih akurat, silakan:

- **Cek website** grcc.id — halaman Training & Program
- **Email kami** di grcc.ailg@gmail.com
- **Tanyakan hal lain** — saya siap membantu tentang program GRC, ESG, Auditing, Accounting, HCM, DTF, OC, dan Penelitian!

Ada yang bisa saya bantu lagi?`;
}

// ── Simulated streaming ───────────────────────────────────────────────────────
async function streamText(text: string): Promise<ReadableStream> {
  // Split into chunks of 2-5 characters for natural streaming feel
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    const size = Math.floor(Math.random() * 4) + 2;
    chunks.push(text.slice(i, i + size));
    i += size;
  }

  return new ReadableStream({
    async start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(new TextEncoder().encode(chunk));
        // Small delay for natural streaming effect
        await new Promise(r => setTimeout(r, 12 + Math.random() * 18));
      }
      controller.close();
    },
  });
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  const { messages } = await req.json();
  const lastMessage = messages[messages.length - 1]?.content ?? "";

  // ── Use Claude AI if API key is available ──
  if (process.env.ANTHROPIC_API_KEY) {
    const SYSTEM_PROMPT = `Kamu adalah Asisten AI resmi GRCC (Center for Governance, Risk, Compliance & Competitiveness). Namamu adalah "GRCC Assistant". Kamu membantu pengunjung website grcc.id — calon peserta pelatihan, profesional, akademisi, dan pimpinan perusahaan.

TENTANG GRCC:
GRCC adalah pusat pengembangan profesional dan konsultasi yang berfokus pada Tata Kelola (Governance), Manajemen Risiko (Risk), Kepatuhan (Compliance), dan Daya Saing Organisasi (Competitiveness). GRCC berkolaborasi dengan AILG Universitas Airlangga, Surabaya.

8 PROGRAM UTAMA: GRC (Governance, Risk & Compliance), ESG (Keberlanjutan Bisnis), ACC (Accounting), AUD (Auditing & ICoFR), OC (Organizational Competitiveness), HCM (Human Capital Management), DTF (Digital & Technology in Finance), RES (Penelitian).

Format: Workshop, Pelatihan Bersertifikat, Konferensi Eksekutif, In-House Training, Online & In-Person.
Kontak: grcc.ailg@gmail.com | WhatsApp: +62 882-9898-9171 | Lokasi: Surabaya | Website: grcc.id

Jawab dalam Bahasa Indonesia yang hangat dan profesional. Maksimal 3-4 paragraf. Gunakan bullet points untuk daftar.`;

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const stream = client.messages.stream({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
    });

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
              controller.enqueue(new TextEncoder().encode(event.delta.text));
            }
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" },
    });
  }

  // ── Fallback: FAQ keyword matching with simulated streaming ──
  const answer = findAnswer(lastMessage);
  const readable = await streamText(answer);

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" },
  });
}
