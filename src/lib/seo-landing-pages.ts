export type SeoLandingPage = {
  slug: string;
  title: string;
  h1: string;
  eyebrow: string;
  description: string;
  keywords: string[];
  audience: string[];
  outcomes: string[];
  faqs: { question: string; answer: string }[];
  relatedTerms: string[];
};

export const seoLandingPages: SeoLandingPage[] = [
  {
    slug: "pelatihan-grc-indonesia",
    title: "Pelatihan GRC Indonesia",
    h1: "Pelatihan GRC Indonesia",
    eyebrow: "Governance, Risk, and Compliance",
    description:
      "Program pelatihan GRC GRCC membantu organisasi memahami tata kelola, manajemen risiko, dan kepatuhan secara terintegrasi untuk memperkuat akuntabilitas, kontrol, dan daya saing.",
    keywords: ["pelatihan GRC Indonesia", "training governance risk compliance", "pelatihan tata kelola perusahaan"],
    audience: ["Direksi dan komisaris", "Manajer risiko", "Compliance officer", "Internal auditor", "Sekretaris perusahaan"],
    outcomes: [
      "Memahami prinsip governance, risk, and compliance secara terpadu.",
      "Mengidentifikasi kebutuhan penguatan tata kelola dan kepatuhan organisasi.",
      "Menyusun prioritas perbaikan GRC berbasis risiko dan konteks organisasi.",
    ],
    faqs: [
      {
        question: "Apa itu pelatihan GRC?",
        answer:
          "Pelatihan GRC adalah program untuk memahami tata kelola, manajemen risiko, dan kepatuhan sebagai sistem terpadu agar organisasi lebih akuntabel, patuh, dan siap menghadapi ketidakpastian.",
      },
      {
        question: "Siapa yang cocok mengikuti pelatihan GRC?",
        answer:
          "Program ini cocok untuk pimpinan, manajer risiko, compliance officer, auditor internal, sekretaris perusahaan, dan profesional yang terlibat dalam penguatan tata kelola organisasi.",
      },
    ],
    relatedTerms: ["GRC", "governance", "risk", "compliance", "tata kelola", "kepatuhan"],
  },
  {
    slug: "pelatihan-risk-management",
    title: "Pelatihan Risk Management",
    h1: "Pelatihan Risk Management",
    eyebrow: "Enterprise Risk Management",
    description:
      "Pelatihan risk management GRCC membantu organisasi mengidentifikasi, menganalisis, memitigasi, dan memonitor risiko secara sistematis agar pengambilan keputusan lebih kuat.",
    keywords: ["pelatihan risk management", "pelatihan manajemen risiko", "enterprise risk management"],
    audience: ["Risk officer", "Manajer unit bisnis", "Internal auditor", "Tim strategi", "Tim kepatuhan"],
    outcomes: [
      "Memahami proses identifikasi, analisis, evaluasi, dan mitigasi risiko.",
      "Menghubungkan risiko dengan strategi, operasional, dan kepatuhan.",
      "Membangun kerangka monitoring risiko yang dapat ditindaklanjuti.",
    ],
    faqs: [
      {
        question: "Apa manfaat pelatihan risk management?",
        answer:
          "Pelatihan risk management membantu organisasi mengenali risiko sejak awal, menentukan prioritas penanganan, dan meningkatkan kualitas keputusan berbasis data dan konteks bisnis.",
      },
      {
        question: "Apakah pelatihan ini bisa dibuat in-house?",
        answer:
          "Ya, program risk management dapat disesuaikan untuk kebutuhan perusahaan, termasuk studi kasus, profil risiko industri, dan tingkat kematangan manajemen risiko organisasi.",
      },
    ],
    relatedTerms: ["risk management", "manajemen risiko", "ERM", "risk assessment", "risk maturity"],
  },
  {
    slug: "pelatihan-sustainability-esg",
    title: "Pelatihan Sustainability dan ESG",
    h1: "Pelatihan Sustainability dan ESG",
    eyebrow: "ESG dan Keberlanjutan Bisnis",
    description:
      "Program sustainability dan ESG GRCC membekali organisasi untuk menyusun strategi keberlanjutan, pelaporan ESG, roadmap implementasi, dan kepemimpinan keberlanjutan.",
    keywords: ["pelatihan sustainability", "pelatihan ESG", "training sustainability Indonesia"],
    audience: ["Sustainability officer", "Tim ESG", "Corporate secretary", "Investor relations", "Pemimpin unit bisnis"],
    outcomes: [
      "Memahami isu material ESG dan hubungannya dengan strategi bisnis.",
      "Menyusun roadmap dan prioritas program keberlanjutan.",
      "Meningkatkan kualitas komunikasi dan pelaporan keberlanjutan.",
    ],
    faqs: [
      {
        question: "Apa bedanya sustainability dan ESG?",
        answer:
          "Sustainability berfokus pada keberlanjutan nilai jangka panjang, sedangkan ESG adalah kerangka lingkungan, sosial, dan tata kelola yang sering digunakan untuk mengukur dan mengkomunikasikan kinerja keberlanjutan.",
      },
      {
        question: "Apakah GRCC menyediakan pelatihan sertifikasi sustainability?",
        answer:
          "GRCC menyediakan program terkait sustainability dan ESG, termasuk program sertifikasi seperti CSSL ketika jadwal tersedia.",
      },
    ],
    relatedTerms: ["sustainability", "ESG", "keberlanjutan", "CSSL", "laporan keberlanjutan", "IFRS S1 S2"],
  },
  {
    slug: "pelatihan-icofr",
    title: "Pelatihan ICoFR",
    h1: "Pelatihan ICoFR",
    eyebrow: "Internal Control over Financial Reporting",
    description:
      "Pelatihan ICoFR GRCC membantu peserta memahami kontrol internal atas pelaporan keuangan, pemetaan risiko proses bisnis, dokumentasi kontrol, dan kesiapan audit.",
    keywords: ["pelatihan ICoFR", "internal control over financial reporting", "pelatihan internal control"],
    audience: ["Manajer non-keuangan", "Finance dan accounting", "Risk owner", "Internal auditor", "Tim kepatuhan"],
    outcomes: [
      "Memahami konsep ICoFR dan relevansinya bagi pemilik proses.",
      "Mengidentifikasi risiko pelaporan keuangan dalam proses kerja.",
      "Menyusun dokumentasi kontrol internal yang lebih terstruktur.",
    ],
    faqs: [
      {
        question: "Apakah ICoFR hanya untuk akuntan?",
        answer:
          "Tidak. ICoFR juga penting untuk manajemen non-akuntan karena mereka sering menjadi pemilik proses dan risiko yang memengaruhi kualitas data keuangan.",
      },
      {
        question: "Apa yang dipelajari dalam pelatihan ICoFR?",
        answer:
          "Peserta mempelajari konsep kontrol internal, pemetaan proses dan risiko, dokumentasi kontrol, serta persiapan organisasi menghadapi audit dan pengujian kontrol.",
      },
    ],
    relatedTerms: ["ICoFR", "internal control", "financial reporting", "kontrol internal", "pelaporan keuangan"],
  },
  {
    slug: "pelatihan-compliance-anti-corruption",
    title: "Pelatihan Compliance dan Anti-Corruption",
    h1: "Pelatihan Compliance dan Anti-Corruption",
    eyebrow: "Compliance Program",
    description:
      "Pelatihan compliance dan anti-corruption GRCC membantu organisasi membangun budaya kepatuhan, mengelola risiko regulasi, dan memperkuat program anti-korupsi.",
    keywords: ["pelatihan compliance", "pelatihan anti corruption", "training kepatuhan perusahaan"],
    audience: ["Compliance officer", "Legal team", "Internal auditor", "Risk management", "Manajemen perusahaan"],
    outcomes: [
      "Memahami elemen utama program kepatuhan dan anti-korupsi.",
      "Mengidentifikasi risiko regulasi dan area rawan pelanggaran.",
      "Menyusun langkah penguatan budaya kepatuhan di organisasi.",
    ],
    faqs: [
      {
        question: "Mengapa compliance program penting?",
        answer:
          "Compliance program membantu organisasi mencegah pelanggaran, mengurangi risiko hukum dan reputasi, serta membangun budaya kerja yang lebih etis dan bertanggung jawab.",
      },
      {
        question: "Apakah pelatihan compliance bisa disesuaikan dengan industri?",
        answer:
          "Ya, materi compliance dapat disesuaikan dengan sektor, profil risiko, regulasi, dan kebutuhan organisasi.",
      },
    ],
    relatedTerms: ["compliance", "kepatuhan", "anti corruption", "anti-korupsi", "regulatory compliance"],
  },
];

export function getSeoLandingPage(slug: string) {
  return seoLandingPages.find((page) => page.slug === slug) ?? null;
}
