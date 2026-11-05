import { supabase, TrainingItem, PriceTier } from "@/lib/supabase";
import { parseTrainingSection } from "@/lib/training-sections";
import { getTrainingFacilitators } from "@/lib/training-facilitators";
import { siteConfig } from "@/lib/site-config";
import { trainingDateLabel, trainingTimeLabel, isScheduleChoice } from "@/lib/training-schedule";

export const SITE_URL = "https://grcc-landing-page.vercel.app";

export interface KTraining {
  id: string;
  title: string;
  category: string;
  format: string;
  location: string;
  dateLabel: string;
  timeLabel: string;
  end: Date | null;
  past: boolean;
  priceLines: string[];
  max: number | null;
  description: string;
  objectives: string[];
  audience: string[];
  facilitators: string[];
  sessions: string[];
  sessionMode: "none" | "all" | "choose";
  hasBrochure: boolean;
  url: string;
  registerUrl: string;
}

export interface KComing {
  title: string;
  category: string;
  format: string;
  expected: string;
  description: string;
}

export interface KProgram {
  name: string;
  description: string;
}

export interface Knowledge {
  trainings: KTraining[];
  coming: KComing[];
  programs: KProgram[];
  builtAt: number;
}

const MONTHS: Record<string, number> = {
  januari: 0, februari: 1, maret: 2, april: 3, mei: 4, juni: 5, juli: 6,
  agustus: 7, september: 8, oktober: 9, november: 10, desember: 11,
};

function parseIdDate(text?: string | null): Date | null {
  if (!text) return null;
  const m = text.toLowerCase().match(/(\d{1,2})\s+([a-z]+)\s+(\d{4})/);
  if (!m || MONTHS[m[2]] === undefined) return null;
  return new Date(Number(m[3]), MONTHS[m[2]], Number(m[1]), 23, 59);
}

const rp = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

function tierLine(t: Pick<PriceTier, "label" | "price" | "price_label" | "note">) {
  const amount = t.price ? rp(t.price) : t.price_label || "";
  const name = [t.label, t.note].filter((x) => x && x.trim()).join(" — ").replace(/\s+/g, " ").replace(/\s+\./g, ".").trim();
  return [name, amount].filter(Boolean).join(": ");
}

function buildPriceLines(t: TrainingItem): string[] {
  const lines: string[] = [];
  if (t.price || t.price_label) {
    lines.push(tierLine({ label: "", price: t.price, price_label: t.price_label, note: t.price_note }));
  }
  for (const tier of t.price_tiers ?? []) lines.push(tierLine(tier));
  return lines.filter(Boolean);
}

function toKTraining(t: TrainingItem): KTraining {
  const sessions = Array.isArray(t.sessions) ? t.sessions : [];
  const end =
    parseIdDate(sessions.length ? sessions[sessions.length - 1]?.date : null) ??
    parseIdDate(t.date_end) ??
    parseIdDate(t.date_start);
  return {
    id: t.id,
    title: t.title,
    category: t.category ?? "",
    format: t.format ?? "",
    location: t.location ?? "",
    dateLabel: (trainingDateLabel(t) ?? "").replace(/\s+/g, " ").trim(),
    timeLabel: (trainingTimeLabel(t) ?? "").replace(/\s+/g, " ").trim(),
    end,
    past: end ? end.getTime() < Date.now() : false,
    priceLines: buildPriceLines(t),
    max: t.max_participants,
    description: (t.description ?? "").replace(/\s+/g, " ").trim(),
    objectives: parseTrainingSection(t.objectives, "Tujuan Program").items,
    audience: parseTrainingSection(t.target_audience, "Target Peserta").items,
    facilitators: getTrainingFacilitators(t.custom_fields).map((f) =>
      [f.name, f.role].filter(Boolean).join(" — ")
    ),
    sessions: sessions.map((s) => `${s.day}, ${s.date}${s.times?.filter(Boolean).length ? ` (${s.times.filter(Boolean).join(", ")})` : ""}`),
    sessionMode: sessions.length > 1 ? (isScheduleChoice(sessions) ? "choose" : "all") : "none",
    hasBrochure: Boolean(t.brochure_url),
    url: `${SITE_URL}/training/${t.id}`,
    registerUrl: `${SITE_URL}/daftar/${t.id}`,
  };
}

let cache: Knowledge | null = null;

export async function loadKnowledge(): Promise<Knowledge> {
  if (cache && Date.now() - cache.builtAt < 5 * 60 * 1000) return cache;

  const [tr, cs, sp] = await Promise.all([
    supabase.from("training").select("*").eq("published", true).order("created_at", { ascending: false }),
    supabase.from("coming_soon_posts").select("*").eq("visible", true),
    supabase.from("sub_programs").select("name,description").eq("active", true).order("order_index"),
  ]);

  const kb: Knowledge = {
    trainings: ((tr.data ?? []) as TrainingItem[]).map(toKTraining),
    coming: ((cs.data ?? []) as Record<string, string>[]).map((c) => ({
      title: c.title ?? "",
      category: c.category ?? "",
      format: c.format ?? "",
      expected: c.expected_date ?? "",
      description: (c.description ?? "").replace(/\s+/g, " ").trim(),
    })),
    programs: ((sp.data ?? []) as KProgram[]).map((p) => ({
      name: p.name,
      description: (p.description ?? "").replace(/\s+/g, " ").trim(),
    })),
    builtAt: Date.now(),
  };

  if (kb.trainings.length || kb.coming.length || kb.programs.length) cache = kb;
  return kb;
}

export function contactLine() {
  const wa = siteConfig.whatsappNumber || "6288298989171";
  return {
    email: siteConfig.contactEmail,
    whatsapp: `+${wa}`,
    waLink: `https://wa.me/${wa}`,
  };
}

// ── Teks pengetahuan untuk LLM ───────────────────────────────────────────────

export const STATIC_FACTS = `TENTANG GRCC
GRCC (Center for Governance, Risk, Compliance & Competitiveness) adalah pusat pengembangan profesional dan konsultasi di bawah AILG Universitas Airlangga, Surabaya. Fokus: tata kelola (governance), manajemen risiko, kepatuhan (compliance), dan daya saing organisasi. Layanan: pelatihan & workshop, sertifikasi, konferensi eksekutif, in-house training, konsultasi, penelitian.

CARA MENDAFTAR (INDIVIDU)
1. Buka halaman program di website lalu klik "Daftar Sekarang".
2. Jawab dulu pertanyaan "Apakah Anda membutuhkan Faktur Pajak?" — formulir baru terbuka setelah dijawab.
3. Jika "Tidak butuh Faktur Pajak": isi formulir lengkap (data peserta, kontak, sumber informasi, kode promo bila ada), lalu instruksi pembayaran (Virtual Account) tampil di formulir; transfer dan upload bukti pembayaran, lalu kirim.
4. Jika "Ya, butuh Faktur Pajak": isi form request singkat (nama PIC, nama instansi, email aktif, nomor WA aktif, foto NPWP) lalu "Kirim ke Admin". Tim GRCC memproses faktur dan mengirim instruksi pembayaran resmi (VA khusus) secara terpisah. PENTING: jangan transfer sebelum menerima instruksi resmi tersebut.
5. Tim GRCC mengonfirmasi lewat email/WhatsApp (sekitar 1x24 jam).

PENDAFTARAN GRUP
Lewat tombol "Daftar sebagai Grup" di halaman program: minimal 2 peserta, jumlah bisa ditambah, cukup 1 bukti pembayaran untuk semua peserta. Isi data PIC/koordinator lalu data tiap peserta.

JADWAL & HARGA
- Program multi-sesi (mis. beberapa hari berbeda): peserta WAJIB mengikuti semua sesi, tidak perlu memilih hari. Hanya program tertentu yang menyediakan pilihan jadwal alternatif.
- Beberapa program punya beberapa varian harga (paket); peserta memilih paket di formulir pendaftaran.
- Kode promo dimasukkan di kolom "Kode Promo" pada formulir.
- Brosur PDF program bisa diunduh lewat tombol ikon unduh di pojok kanan bawah website.

IN-HOUSE TRAINING
Pelatihan di kantor/instansi sendiri, materi dan jadwal dapat dikustomisasi. Hubungi admin untuk konsultasi dan penawaran.

SERTIFIKAT
Peserta yang menyelesaikan program mendapat sertifikat; detail sertifikasi berbeda tiap program (ada yang sertifikasi BNSP) — lihat kategori/deskripsi masing-masing program.`;

export function knowledgeToText(kb: Knowledge): string {
  const c = contactLine();
  const out: string[] = [STATIC_FACTS, ""];
  out.push(`KONTAK: Email ${c.email} | WhatsApp ${c.whatsapp} (${c.waLink}) | Website ${SITE_URL}`, "");

  out.push("PROGRAM YANG PENDAFTARANNYA SEDANG DIBUKA / TERBIT DI WEBSITE (data real-time):");
  if (kb.trainings.length === 0) out.push("(belum ada program yang dipublikasikan saat ini)");
  kb.trainings.forEach((t, i) => {
    out.push(`${i + 1}. ${t.title}${t.past ? " [SUDAH SELESAI]" : ""}`);
    if (t.category) out.push(`   Kategori: ${t.category}`);
    if (t.dateLabel) out.push(`   Tanggal: ${t.dateLabel}`);
    if (t.sessions.length > 1) out.push(`   Sesi (${t.sessionMode === "all" ? "wajib hadir semua sesi" : "peserta memilih salah satu"}): ${t.sessions.join(" | ")}`);
    else if (t.timeLabel) out.push(`   Waktu: ${t.timeLabel}`);
    if (t.format || t.location) out.push(`   Format/Lokasi: ${[t.format, t.location].filter(Boolean).join(" — ")}`);
    out.push(`   Harga: ${t.priceLines.length ? t.priceLines.join(" | ") : "belum dicantumkan — hubungi admin"}`);
    if (t.max) out.push(`   Kuota maksimal: ${t.max} peserta`);
    if (t.description) out.push(`   Deskripsi: ${t.description.slice(0, 700)}`);
    if (t.objectives.length) out.push(`   Tujuan: ${t.objectives.slice(0, 6).join("; ")}`);
    if (t.audience.length) out.push(`   Target peserta/persyaratan: ${t.audience.slice(0, 6).join("; ")}`);
    if (t.facilitators.length) out.push(`   Pembicara: ${t.facilitators.slice(0, 10).join("; ")}`);
    out.push(`   Brosur: ${t.hasBrochure ? "tersedia" : "belum ada"} | Detail: ${t.url} | Daftar: ${t.registerUrl}`);
  });

  out.push("", "SEGERA HADIR (pendaftaran belum dibuka):");
  if (kb.coming.length === 0) out.push("(tidak ada)");
  kb.coming.forEach((c2) =>
    out.push(`- ${c2.title}${c2.category ? ` [${c2.category}]` : ""}${c2.format ? ` — ${c2.format}` : ""}${c2.expected ? ` — perkiraan ${c2.expected}` : ""}${c2.description ? `. ${c2.description.slice(0, 300)}` : ""}`)
  );

  out.push("", "KATALOG PROGRAM/TOPIK PELATIHAN GRCC (tersedia sebagai pelatihan/in-house; jadwal menyesuaikan, hubungi admin):");
  kb.programs.forEach((p) => out.push(`- ${p.name}${p.description ? `: ${p.description.slice(0, 220)}` : ""}`));

  return out.join("\n");
}

// ── Mesin jawaban tanpa LLM (berbasis data real-time) ────────────────────────

const STOP = new Set([
  "yang","di","ke","dari","ada","apa","apakah","adakah","gak","ga","nggak","tidak","tak","dong","ya","nih","sih","kah","deh",
  "saya","aku","kami","kita","anda","untuk","dan","atau","itu","ini","bisa","mau","ingin","tolong","dengan","pada","juga","lagi",
  "boleh","minta","tanya","mohon","kak","mas","mbak","pak","bu","min","admin","yg","utk","dgn","sama","kalau","kalo","jika","bagaimana",
  "gimana","kenapa","mengapa","sudah","udah","belum","akan","ada","halo","hai","hi","hello","hei","selamat","pagi","siang","sore","malam","assalamualaikum","permisi","pelatihan","training","program","kelas","acara","kegiatan","info","informasi",
]);

const SYNONYMS: Record<string, string[]> = {
  bnsp: ["bnsp", "sertifikasi"],
  sertifikat: ["sertifikasi"],
  bersertifikat: ["sertifikasi"],
  sertifikasi: ["sertifikasi"],
  esg: ["esg", "sustainability", "keberlanjutan"],
  keberlanjutan: ["sustainability", "keberlanjutan"],
  risiko: ["risk", "risiko"],
  risk: ["risk", "risiko"],
  kepatuhan: ["compliance", "kepatuhan"],
  compliance: ["compliance", "kepatuhan"],
  tatakelola: ["governance"],
  governance: ["governance", "tata", "kelola"],
  fraud: ["fraud", "kecurangan"],
  audit: ["audit", "auditing"],
  auditing: ["audit", "auditing"],
  cssl: ["cssl", "sustainability"],
  icofr: ["icofr", "internal", "control"],
  grccp: ["governance", "compliance", "certified", "professional"],
  grc: ["grc", "governance", "compliance"],
};

function norm(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s&-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokensOf(text: string): string[] {
  const out = new Set<string>();
  for (const raw of norm(text).split(" ")) {
    let w = raw.replace(/nya$/, "");
    if (!w || STOP.has(w) || w.length < 2) continue;
    out.add(w);
    (SYNONYMS[w] ?? []).forEach((s) => out.add(s));
  }
  return [...out];
}

function score(tokens: string[], strong: string, weak: string) {
  const s = norm(strong);
  const w = norm(weak);
  let total = 0;
  for (const t of tokens) {
    if (t.length < 3 && !/^(hr|it|ai)$/.test(t)) continue;
    if (s.includes(t)) total += 3;
    else if (w.includes(t)) total += 1;
  }
  return total;
}

type Hit =
  | { kind: "training"; score: number; t: KTraining }
  | { kind: "coming"; score: number; c: KComing }
  | { kind: "program"; score: number; p: KProgram };

function findHits(tokens: string[], kb: Knowledge): Hit[] {
  const hits: Hit[] = [];
  for (const t of kb.trainings) {
    const sc = score(tokens, `${t.title} ${t.category}`, `${t.description} ${t.objectives.join(" ")} ${t.audience.join(" ")} ${t.facilitators.join(" ")} ${t.location}`);
    if (sc >= 3) hits.push({ kind: "training", score: sc, t });
  }
  for (const c of kb.coming) {
    const sc = score(tokens, `${c.title} ${c.category}`, c.description);
    if (sc >= 3) hits.push({ kind: "coming", score: sc, c });
  }
  for (const p of kb.programs) {
    const sc = score(tokens, p.name, p.description);
    if (sc >= 3) hits.push({ kind: "program", score: sc, p });
  }
  return hits.sort((a, b) => b.score - a.score);
}

function trainingCard(t: KTraining, focus?: "price" | "schedule" | "place" | "register" | "who") {
  const lines: string[] = [`**${t.title}**${t.past ? " _(sudah selesai)_" : ""}`];
  const meta = [t.category, t.format].filter(Boolean).join(" · ");
  if (meta) lines.push(meta);

  const showAll = !focus;
  if (showAll || focus === "schedule") {
    if (t.sessions.length > 1) {
      lines.push(`- **Jadwal:** ${t.sessionMode === "all" ? "wajib hadir di semua sesi" : "pilih salah satu sesi"}`);
      t.sessions.forEach((s) => lines.push(`  - ${s}`));
    } else {
      if (t.dateLabel) lines.push(`- **Tanggal:** ${t.dateLabel}`);
      if (t.timeLabel) lines.push(`- **Waktu:** ${t.timeLabel}`);
    }
  }
  if (showAll || focus === "place") {
    if (t.format || t.location) lines.push(`- **Format/Lokasi:** ${[t.format, t.location].filter(Boolean).join(" — ")}`);
  }
  if (showAll || focus === "price" || focus === "register") {
    lines.push(
      t.priceLines.length
        ? `- **Harga:**${t.priceLines.length > 1 ? "" : " " + t.priceLines[0]}`
        : "- **Harga:** belum dicantumkan, silakan hubungi admin"
    );
    if (t.priceLines.length > 1) t.priceLines.forEach((p) => lines.push(`  - ${p}`));
  }
  if (focus === "who" && t.audience.length) {
    lines.push("- **Target peserta / persyaratan:**");
    t.audience.slice(0, 6).forEach((a) => lines.push(`  - ${a}`));
  }
  if (showAll && t.description) {
    const short = t.description.length > 230 ? t.description.slice(0, 227).trimEnd() + "…" : t.description;
    lines.push(`- ${short}`);
  }
  lines.push(`[Lihat detail](${t.url})${t.past ? "" : ` · [Daftar](${t.registerUrl})`}`);
  return lines.join("\n");
}

function listTrainings(kb: Knowledge) {
  const open = kb.trainings.filter((t) => !t.past);
  if (open.length === 0) return "";
  return open
    .map((t) => `- **${t.title}**${t.dateLabel ? ` — ${t.dateLabel}` : ""}${t.format ? ` (${t.format})` : ""}`)
    .join("\n");
}

function contactBlock() {
  const c = contactLine();
  return `- **Email:** ${c.email}\n- **WhatsApp:** [${c.whatsapp}](${c.waLink})`;
}

function generalTopic(w: { wantFaktur: boolean; wantGroup: boolean; wantInhouse: boolean; wantPromo: boolean }): string | null {
  if (w.wantFaktur) {
    return `**Faktur Pajak** — alurnya dipisah supaya pembayaran tidak keliru:\n\n- Di formulir pendaftaran, pilih **"Ya, butuh Faktur Pajak"**.\n- Isi form singkat: nama PIC, instansi, email aktif, nomor WA aktif, dan **foto NPWP**, lalu **Kirim ke Admin**.\n- Tim GRCC memproses faktur dan mengirim **instruksi pembayaran resmi (VA khusus)**.\n\n⚠️ **Jangan transfer sebelum menerima instruksi resmi** dari tim GRCC.\n\nJika tidak butuh faktur, pilih "Tidak butuh Faktur Pajak" dan Anda bisa langsung mengisi formulir lengkap + pembayaran.`;
  }
  if (w.wantGroup) {
    return `**Pendaftaran Grup** untuk instansi/rombongan:\n\n- Klik **"Daftar sebagai Grup"** di halaman program.\n- **Minimal 2 peserta**, jumlahnya bisa ditambah di formulir.\n- Cukup **1 bukti pembayaran** untuk seluruh peserta.\n- Isi data PIC/koordinator, lalu data tiap peserta.\n\nUntuk jumlah peserta besar atau kebutuhan khusus, hubungi admin:\n${contactBlock()}`;
  }
  if (w.wantInhouse) {
    return `**In-House Training** dilaksanakan **di kantor/instansi Anda**, dengan materi dan jadwal yang dapat disesuaikan kebutuhan organisasi.\n\nUntuk konsultasi dan penawaran, hubungi admin:\n${contactBlock()}`;
  }
  if (w.wantPromo) {
    return `Kode promo dimasukkan di kolom **"Kode Promo"** pada formulir pendaftaran, lalu klik **Pakai** — potongan harga langsung terlihat di ringkasan biaya.\n\nUntuk info promo yang sedang berlaku, tanyakan ke admin:\n${contactBlock()}`;
  }
  return null;
}

const has = (q: string, re: RegExp) => re.test(q);

export function answerOffline(userMsg: string, history: { role: string; content: string }[], kb: Knowledge): string {
  const q = norm(userMsg);
  const tokens = tokensOf(userMsg);
  const open = kb.trainings.filter((t) => !t.past);

  const wantPrice = has(q, /\b(harga|biaya|tarif|berapa|investasi|bayar|fee|paket)\b/);
  const wantSchedule = has(q, /\b(jadwal|kapan|tanggal|tgl|waktu|jam|hari|batch|mulai)\b/);
  const wantPlace = has(q, /\b(lokasi|dimana|di mana|tempat|online|offline|zoom|hybrid|tatap muka|in person|venue|hotel|format)\b/);
  const wantRegister = has(q, /\b(daftar|mendaftar|pendaftaran|registrasi|ikut|ikuti|gabung|join)\b/);
  const wantWho = has(q, /\b(syarat|persyaratan|target|peserta|cocok|siapa|kualifikasi|pengalaman)\b/);
  const wantFaktur = has(q, /\b(faktur|npwp|pajak|ppn|invoice)\b/);
  const wantGroup = has(q, /\b(grup|group|rombongan|kolektif|beberapa orang|banyak orang)\b/);
  const wantContact = has(q, /\b(kontak|hubungi|whatsapp|wa|telepon|telp|email|alamat|cs|admin)\b/);
  const wantInhouse = has(q, /(in house|in-house|inhouse|kantor kami|di kantor|khusus instansi|kustom|custom)/);
  const wantBrochure = has(q, /\b(brosur|brochure|pdf|silabus|kurikulum|materi)\b/);
  const wantPromo = has(q, /\b(promo|diskon|potongan|voucher|kode)\b/);
  const wantCert = has(q, /\b(sertifikat|sertifikasi|bnsp|bersertifikat)\b/);
  const wantList = has(q, /(apa saja|ada apa|list|daftar program|semua program|program apa|training apa|pelatihan apa|yang tersedia|yang ada|tersedia)/);
  const greeting = has(q, /^(halo|hai|hi|hello|selamat|assalamualaikum|hei|permisi|p)\b/) && q.split(" ").length <= 4;
  const thanks = has(q, /\b(terima kasih|makasih|thanks|thank you|terimakasih|thx|mantap)\b/);

  if (greeting && tokens.length === 0) {
    return `Halo! Selamat datang di **GRCC Assistant** 👋\n\nSaya bisa membantu soal **program & jadwal terbaru, harga, cara mendaftar, faktur pajak, pendaftaran grup**, dan **kontak GRCC**.\n\nAda yang ingin Anda ketahui?`;
  }
  if (thanks && tokens.length <= 2) {
    return `Sama-sama! Senang bisa membantu 😊\n\nJika ada pertanyaan lain tentang program GRCC, tanyakan kapan saja.`;
  }

  // Konteks percakapan: jika pertanyaan lanjutan (mis. "harganya berapa?") rujuk ke program yang dibahas sebelumnya.
  let hits = findHits(tokens, kb);
  if (hits.length === 0 && (wantPrice || wantSchedule || wantPlace || wantRegister || wantWho || wantBrochure)) {
    const recent = history.slice(-6).reverse();
    for (const m of recent) {
      const h = findHits(tokensOf(m.content), kb);
      if (h.length && h[0].kind === "training") { hits = [h[0]]; break; }
    }
  }

  const strongTraining = hits.some((h) => h.kind === "training" && h.score >= 6);

  // Topik layanan umum didahulukan kecuali pengunjung jelas menyebut nama program tertentu
  if (!strongTraining) {
    const general = generalTopic({ wantFaktur, wantGroup, wantInhouse, wantPromo });
    if (general) return general;
  }

  // Sertifikasi / BNSP
  if (wantCert && !strongTraining) {
    const certs = open.filter((t) => /sertifik|bnsp/i.test(`${t.category} ${t.title} ${t.description}`));
    const certsComing = kb.coming.filter((c) => /sertifik|bnsp/i.test(`${c.category} ${c.title} ${c.description}`));
    if (certs.length) {
      const explain = /(apa itu|itu apa|maksud|artinya|apa sih)/.test(q) ? bnspHint(q) : "";
      return `${explain}${explain ? "\n\n" : ""}Ya, ada program bersertifikat yang sedang dibuka:\n\n${certs.map((t) => trainingCard(t, wantWho ? "who" : undefined)).join("\n\n")}\n\nAda yang ingin ditanyakan lebih lanjut?`;
    }
    if (certsComing.length) {
      return `Saat ini belum ada program bersertifikat yang pendaftarannya dibuka, tetapi segera hadir:\n\n${certsComing.map((c) => `- **${c.title}**${c.expected ? ` — perkiraan ${c.expected}` : ""}`).join("\n")}\n\nPantau halaman Training atau hubungi admin untuk kabar terbaru:\n${contactBlock()}`;
    }
    const hint = bnspHint(q);
    return `${hint}Saat ini **belum ada program ${/bnsp/.test(q) ? "sertifikasi BNSP" : "bersertifikat"}** yang pendaftarannya dibuka di website.\n\nUntuk jadwal berikutnya atau kebutuhan sertifikasi khusus instansi Anda, silakan hubungi admin:\n${contactBlock()}${open.length ? `\n\nProgram yang sedang dibuka:\n${listTrainings(kb)}` : ""}`;
  }

  // Cocok dengan program tertentu
  const top = hits[0];
  if (top) {
    if (top.kind === "training") {
      const same = hits.filter((h) => h.kind === "training" && h.score >= top.score - 1).slice(0, 3) as Extract<Hit, { kind: "training" }>[];
      const focus = wantPrice ? "price" : wantSchedule ? "schedule" : wantPlace ? "place" : wantRegister ? "register" : wantWho ? "who" : undefined;
      const body = same.map((h) => trainingCard(h.t, focus)).join("\n\n");
      const tail = wantBrochure
        ? same.some((h) => h.t.hasBrochure)
          ? "\n\nBrosur PDF bisa diunduh lewat **tombol ikon unduh** di pojok kanan bawah website."
          : "\n\nBrosur PDF program ini belum tersedia; detail lengkap ada di halaman program."
        : focus === "register"
          ? `\n\nCaranya: klik **Daftar**, jawab pertanyaan Faktur Pajak, lalu isi formulir. Butuh bantuan? ${contactLine().email}`
          : "\n\nAda yang ingin ditanyakan lebih lanjut?";
      const explain = /bnsp/.test(q) && /(apa itu|itu apa|maksud|artinya|apa sih)/.test(q) ? `${bnspHint(q)}Program GRCC yang terkait:\n\n` : "";
      return `${explain}${body}${tail}`;
    }
    if (top.kind === "coming") {
      const items = hits.filter((h) => h.kind === "coming").slice(0, 3) as Extract<Hit, { kind: "coming" }>[];
      return `${items.map((h) => `**${h.c.title}** — segera hadir${h.c.expected ? ` (perkiraan ${h.c.expected})` : ""}${h.c.format ? `, ${h.c.format}` : ""}.${h.c.description ? `\n${h.c.description.slice(0, 220)}` : ""}`).join("\n\n")}\n\nPendaftaran belum dibuka. Pantau halaman Training atau hubungi admin:\n${contactBlock()}`;
    }
    const progs = hits.filter((h) => h.kind === "program").slice(0, 3) as Extract<Hit, { kind: "program" }>[];
    return `${progs.map((h) => `**${h.p.name}**\n${h.p.description.slice(0, 260)}`).join("\n\n")}\n\nProgram ini tersedia sebagai pelatihan/in-house dengan jadwal menyesuaikan. Lihat [halaman Program](${SITE_URL}/programs) atau hubungi admin untuk penawaran:\n${contactBlock()}`;
  }

  // Topik umum
  if (wantContact && !wantRegister) {
    return `Silakan hubungi GRCC:\n\n${contactBlock()}\n- **Lokasi:** Surabaya (AILG Universitas Airlangga)\n\nTim kami merespons secepat mungkin.`;
  }
  if (wantRegister) {
    return `**Cara mendaftar:**\n\n1. Buka halaman program, klik **Daftar Sekarang**.\n2. Jawab pertanyaan **Faktur Pajak** (butuh / tidak).\n3. Isi formulir, lalu ikuti instruksi pembayaran yang tampil.\n4. Tim GRCC mengonfirmasi lewat email/WhatsApp (±1x24 jam).\n\nBisa juga **daftar sebagai grup** (min. 2 peserta).${open.length ? `\n\nProgram yang sedang dibuka:\n${listTrainings(kb)}` : ""}`;
  }
  if (wantBrochure) {
    return `Brosur PDF program bisa diunduh lewat **tombol ikon unduh** di pojok kanan bawah website (di atas tombol chat).${open.length ? `\n\nProgram yang sedang dibuka:\n${listTrainings(kb)}` : ""}`;
  }
  if (wantPrice || wantSchedule || wantPlace || wantList) {
    if (open.length === 0 && kb.coming.length === 0) {
      return `Saat ini belum ada program yang dibuka di website. Untuk jadwal berikutnya atau penawaran in-house, hubungi admin:\n${contactBlock()}`;
    }
    const detail = open
      .map((t) => {
        const bits: string[] = [];
        if (wantPrice || wantList) bits.push(t.priceLines.length ? t.priceLines.join(" / ") : "harga: hubungi admin");
        if (wantSchedule || wantList) bits.push(t.dateLabel);
        if (wantPlace || wantList) bits.push([t.format, t.location].filter(Boolean).join(", "));
        return `- **${t.title}** — ${bits.filter(Boolean).join(" · ")}`;
      })
      .join("\n");
    const coming = kb.coming.length
      ? `\n\n**Segera hadir:**\n${kb.coming.map((c) => `- ${c.title}${c.expected ? ` (perkiraan ${c.expected})` : ""}`).join("\n")}`
      : "";
    return `${open.length ? `**Program yang sedang dibuka:**\n${detail}` : "Saat ini belum ada program yang pendaftarannya dibuka."}${coming}\n\nSebutkan nama programnya untuk detail lengkap.`;
  }

  // Fallback cerdas
  const cat = kb.programs.slice(0, 8).map((p) => `- ${p.name}`).join("\n");
  return `Maaf, saya belum menemukan jawaban yang pas untuk pertanyaan itu 🙏\n\n${open.length ? `**Program yang sedang dibuka:**\n${listTrainings(kb)}\n\n` : ""}${cat ? `**Topik pelatihan GRCC** (tersedia in-house / sesuai jadwal):\n${cat}\n\n` : ""}Anda bisa tanyakan **harga, jadwal, cara daftar, faktur pajak, atau pendaftaran grup**. Untuk hal lain, hubungi admin:\n${contactBlock()}`;
}

function bnspHint(q: string) {
  return /bnsp/.test(q) ? "BNSP (Badan Nasional Sertifikasi Profesi) adalah lembaga yang mengawasi sertifikasi kompetensi profesi di Indonesia. " : "";
}
