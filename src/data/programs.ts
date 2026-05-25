import { Shield, Leaf, BookOpen, Search, TrendingUp, Users, Cpu, FlaskConical, type LucideIcon } from "lucide-react";

export interface SubProgram { name: string; desc: string; }
export interface Program {
  id: string;
  icon: LucideIcon;
  title: string;
  short: string;
  accent: string;
  bg: string;
  tagline: string;
  desc: string;
  subs: SubProgram[];
}

export function toSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export const programs: Program[] = [
  {
    id: "01", icon: Shield,
    title: "Governance, Risk, and Compliance", short: "GRC",
    accent: "#4F46E5", bg: "#1A1A2E",
    tagline: "Bangun fondasi tata kelola yang kokoh dan sistem kepatuhan yang terukur.",
    desc: "Program GRC GRCC dirancang untuk memperkuat kapasitas organisasi dalam menerapkan prinsip-prinsip tata kelola yang baik, mengelola risiko secara strategis, dan memastikan kepatuhan terhadap regulasi serta standar internasional.",
    subs: [
      {
        name: "Penyusunan Roadmap Implementasi Tata Kelola",
        desc: `Program ini merupakan upaya sistematis untuk merancang peta jalan implementasi tata kelola perusahaan secara menyeluruh dan terstruktur. Melalui serangkaian proses yang melibatkan berbagai pemangku kepentingan, kegiatan ini menghasilkan dokumen roadmap yang menjadi acuan strategis bagi perusahaan dalam mewujudkan tata kelola yang baik, akuntabel, dan berkelanjutan.

Penerapan tata kelola yang baik (good governance) merupakan pondasi utama bagi keberlangsungan dan kepercayaan publik terhadap suatu perusahaan. Namun, implementasi tata kelola seringkali terkendala oleh tidak adanya perencanaan yang jelas, terukur, dan realistis. Kegiatan Penyusunan Roadmap Implementasi Tata Kelola hadir untuk menjawab kebutuhan tersebut membantu perusahaan mengidentifikasi kondisi eksisting, menetapkan target capaian, serta merancang langkah-langkah konkret yang dapat dilaksanakan secara bertahap.`
      },
      {
        name: "Audit dan Evaluasi Sistem Tata Kelola",
        desc: `Kegiatan Audit dan Evaluasi Sistem Tata Kelola merupakan proses penilaian independen dan menyeluruh terhadap efektivitas, kepatuhan, serta kualitas implementasi tata kelola perusahaan. Melalui pendekatan yang sistematis dan berbasis bukti, kegiatan ini memberikan gambaran objektif tentang sejauh mana sistem tata kelola telah berjalan sesuai dengan kebijakan, standar, dan regulasi yang berlaku sekaligus mengidentifikasi area perbaikan untuk peningkatan berkelanjutan.

Implementasi tata kelola yang telah direncanakan perlu dievaluasi secara berkala untuk memastikan bahwa setiap program dan kebijakan yang dijalankan benar-benar memberikan dampak yang diharapkan. Tanpa mekanisme audit dan evaluasi yang terstruktur, perusahaan berisiko menghadapi penyimpangan, inefisiensi, dan ketidakpatuhan yang tidak terdeteksi. Kegiatan ini hadir sebagai instrumen kontrol kualitas sekaligus alat pembelajaran perusahaan — memastikan tata kelola tidak hanya ada di atas kertas, tetapi benar-benar hidup dalam praktik sehari-hari.`
      },
      {
        name: "Pengembangan Soft Skill Tata Kelola", desc: `Program Pengembangan Soft Skill Tata Kelola dirancang untuk membangun kompetensi non-teknis yang menjadi fondasi efektivitas implementasi tata kelola di seluruh level perusahaan. Program ini meyakini bahwa tata kelola yang baik tidak hanya ditopang oleh sistem dan regulasi, tetapi juga oleh kapasitas individu mulai dari cara berkomunikasi, mengambil keputusan etis, memimpin dengan integritas, hingga membangun kolaborasi yang sehat di dalam dan antar unit kerja. 
Keberhasilan implementasi tata kelola sangat bergantung pada kualitas sumber daya manusia yang menjalankannya.Keterampilan teknis saja tidak cukup dibutuhkan kemampuan interpersonal, kepemimpinan, dan etika yang kuat agar setiap individu mampu berkontribusi secara nyata terhadap budaya tata kelola yang sehat.Program ini hadir untuk menjembatani gap antara pemahaman teknis tata kelola dengan kemampuan menerapkannya secara efektif dalam interaksi dan dinamika perusahaan sehari- hari.
` },
      {
        name: "The Essential of Good Corporate Governance / Governance Fundamentals",
        desc: `Program The Essential of Good Corporate Governance atau dikenal sebagai Governance Fundamental merupakan program literasi tata kelola yang dirancang untuk membangun pemahaman dasar yang kuat dan komprehensif tentang prinsip, kerangka, serta praktik Good Corporate Governance (GCG). Program ini menjadi titik masuk yang tepat bagi siapa saja yang ingin memahami tata kelola bukan sekadar sebagai kewajiban regulasi, melainkan sebagai nilai dan budaya yang menggerakkan perusahaan menuju kinerja yang berkelanjutan. 
Pemahaman yang kuat tentang prinsip-prinsip dasar tata kelola merupakan prasyarat utama bagi setiap individu yang terlibat dalam pengelolaan perusahaan. Tanpa fondasi pengetahuan yang solid, implementasi tata kelola kerap berjalan tanpa arah dan rentan terhadap penyimpangan. Program Governance Fundamental hadir untuk memastikan setiap pelaku perusahaan dari jajaran komisaris hingga pelaksana operasional memiliki pemahaman yang selaras tentang apa itu tata kelola yang baik, mengapa ia penting, dan bagaimana menerapkannya secara nyata. 
`},
      {
        name: "Risk Assessment",
        desc: `Program identifikasi dan analisis risiko yang dihadapi organisasi sebagai dasar pengelolaan risiko.
Pemahaman yang kuat tentang prinsip-prinsip dasar tata kelola merupakan prasyarat utama bagi setiap individu yang terlibat dalam pengelolaan perusahaan. Tanpa fondasi pengetahuan yang solid, implementasi tata kelola kerap berjalan tanpa arah dan rentan terhadap penyimpangan. Program Governance Fundamental hadir untuk memastikan setiap pelaku perusahaan dari jajaran komisaris hingga pelaksana operasional memiliki pemahaman yang selaras tentang apa itu tata kelola yang baik, mengapa ia penting, dan bagaimana menerapkannya secara nyata.
` },
      { name: "Enterprise Risk Management (ERM)", desc: "Program pengembangan dan penerapan sistem manajemen risiko terintegrasi di tingkat organisasi." },
      { name: "Financial Risk Management", desc: "Program pengelolaan risiko keuangan untuk mendukung stabilitas dan keberlanjutan kinerja organisasi." },
      { name: "Risk Maturity Assessment", desc: "Program penilaian tingkat kematangan penerapan manajemen risiko dalam organisasi." },
      { name: "Business Continuity Management (BCM)", desc: "Program perancangan dan penguatan sistem keberlanjutan operasional organisasi dalam kondisi gangguan dan krisis." },
      { name: "GRC (Governance, Risk, and Compliance) Awareness", desc: "Program peningkatan pemahaman mengenai konsep dan penerapan tata kelola, manajemen risiko, dan kepatuhan secara terintegrasi." },
      { name: "GRCC BNSP Certification", desc: "Program sertifikasi kompetensi GRC sesuai dengan standar Badan Nasional Sertifikasi Profesi (BNSP)." },
    ],
  },
  {
    id: "02", icon: Leaf,
    title: "ESG dan Keberlanjutan Bisnis", short: "ESG",
    accent: "#10B981", bg: "#071A0F",
    tagline: "Integrasikan keberlanjutan ke dalam inti strategi bisnis Anda.",
    desc: "Program ESG GRCC mempersiapkan organisasi untuk mengukur, mengelola, dan mengkomunikasikan kinerja lingkungan, sosial, dan tata kelola secara kredibel sesuai standar global GRI, TCFD, dan ISSB.",
    subs: [
      { name: "Roadmap Implementasi Keberlanjutan", desc: "Program pendampingan penyusunan roadmap implementasi keberlanjutan sesuai dengan strategi dan kebutuhan organisasi." },
      { name: "Strategi Keberlanjutan", desc: "Program perancangan strategi keberlanjutan yang terintegrasi dengan arah dan tujuan organisasi." },
      { name: "Inovasi Keberlanjutan", desc: "Program pengembangan dan penerapan inovasi yang mendukung pencapaian keberlanjutan organisasi." },
      { name: "Kepemimpinan Keberlanjutan", desc: "Program penguatan peran kepemimpinan dalam mendorong dan mengelola agenda keberlanjutan organisasi." },
      { name: "Penyusunan Laporan Keberlanjutan", desc: "Program pendampingan penyusunan laporan keberlanjutan sesuai dengan standar dan kebutuhan organisasi." },
      { name: "Pengembangan Green Talent", desc: "Program pengembangan kompetensi sumber daya manusia untuk mendukung implementasi keberlanjutan." },
      { name: "IFRS S1 & S2 Implementation", desc: "Program pendampingan penerapan standar IFRS S1 dan S2 dalam pelaporan keberlanjutan organisasi." },
      { name: "Double Materiality Assessment", desc: "Program identifikasi dan penilaian isu material keberlanjutan dari perspektif dampak dan finansial." },
      { name: "Climate Risk (TCFD-based)", desc: "Program identifikasi dan pengelolaan risiko iklim berdasarkan kerangka Task Force on Climate-related Financial Disclosures (TCFD)." },
      { name: "Human Right Due Diligence", desc: "Program penerapan uji tuntas hak asasi manusia dalam aktivitas dan rantai nilai organisasi." },
      { name: "Certified Sustainability, Strategies and Leadership (CSSL)", desc: "Program sertifikasi kompetensi keberlanjutan, strategi, dan kepemimpinan bagi profesional." },
    ],
  },
  {
    id: "03", icon: BookOpen,
    title: "Accounting", short: "ACC",
    accent: "#F59E0B", bg: "#1C0E00",
    tagline: "Kuasai standar akuntansi modern untuk keputusan keuangan yang tepat.",
    desc: "Program akuntansi GRCC mencakup standar pelaporan keuangan internasional dan domestik, akuntansi manajemen berbasis kinerja, serta tata kelola keuangan sektor publik dan swasta.",
    subs: [
      { name: "Finance for Non-Finance Managers", desc: "Program penguatan pemahaman dasar keuangan bagi pimpinan dan manajer non-keuangan." },
      { name: "Corporate Budgeting", desc: "Program penyusunan dan pengelolaan anggaran perusahaan untuk mendukung perencanaan dan pengendalian kinerja." },
      { name: "ESG Budgeting", desc: "Program pengintegrasian aspek ESG dalam proses penganggaran organisasi." },
      { name: "Financial Statement Analysis", desc: "Program analisis laporan keuangan untuk mendukung evaluasi kinerja dan pengambilan keputusan." },
      { name: "Business Valuation", desc: "Program penilaian nilai bisnis untuk keperluan strategis, investasi, dan pengambilan keputusan." },
      { name: "Cost Accounting", desc: "Program pengelolaan dan analisis biaya untuk mendukung efisiensi dan pengendalian biaya." },
      { name: "Activity Based Costing and Activity Based Management", desc: "Program penerapan sistem perhitungan dan pengelolaan biaya berbasis aktivitas." },
      { name: "Management Control Systems", desc: "Program pengembangan sistem pengendalian manajemen untuk mendukung pencapaian tujuan organisasi." },
      { name: "Praktik Perpajakan", desc: "Program pemahaman dan penerapan aspek perpajakan dalam aktivitas bisnis dan organisasi." },
      { name: "Internal Control over Financial Reporting (ICoFR)", desc: "Program penguatan sistem pengendalian internal atas pelaporan keuangan organisasi." },
    ],
  },
  {
    id: "04", icon: Search,
    title: "Auditing", short: "AUD",
    accent: "#EF4444", bg: "#1A0A0A",
    tagline: "Tingkatkan kualitas audit untuk kepercayaan dan akuntabilitas yang lebih kuat.",
    desc: "Program auditing GRCC membekali auditor internal dan eksternal dengan metodologi audit terkini, dari audit berbasis risiko hingga forensic accounting dan IT audit sesuai standar IIA dan IAPI.",
    subs: [
      { name: "Sertifikasi Internal Audit BNSP", desc: "Program sertifikasi kompetensi auditor internal sesuai standar Badan Nasional Sertifikasi Profesi (BNSP)." },
      { name: "Risk-Based Audit", desc: "Program penerapan audit berbasis risiko untuk meningkatkan efektivitas fungsi audit internal." },
      { name: "Management Audit", desc: "Program evaluasi kinerja manajemen dan efektivitas operasional organisasi." },
      { name: "Audit Investigation", desc: "Program pelaksanaan audit investigatif untuk mendukung penanganan indikasi penyimpangan dan kecurangan." },
    ],
  },
  {
    id: "05", icon: TrendingUp,
    title: "Organizational Competitiveness", short: "OC",
    accent: "#0EA5E9", bg: "#0A1520",
    tagline: "Transformasikan organisasi Anda menjadi entitas yang adaptif dan berdaya saing tinggi.",
    desc: "Program daya saing organisasi GRCC fokus pada penguatan kapabilitas strategis, transformasi bisnis, dan inovasi organisasi untuk menghadapi perubahan pasar dan lingkungan yang semakin dinamis.",
    subs: [
      { name: "Corporate Strategy", desc: "Program perumusan dan penguatan strategi korporasi untuk mendukung arah dan tujuan organisasi." },
      { name: "Competitive Strategy", desc: "Program pengembangan strategi bersaing guna meningkatkan posisi dan keunggulan organisasi." },
      { name: "Business Process Management and Engineering", desc: "Program perancangan dan perbaikan proses bisnis untuk meningkatkan efisiensi dan efektivitas operasional." },
      { name: "Supply Chain Management", desc: "Program pengelolaan rantai pasok untuk mendukung kelancaran operasional dan kinerja organisasi." },
      { name: "Organizational Performance Management", desc: "Program pengembangan sistem pengelolaan kinerja organisasi secara terintegrasi." },
      { name: "Brand Plan & Brand Strategy", desc: "Program perencanaan dan pengembangan strategi merek untuk memperkuat identitas dan daya saing organisasi." },
      { name: "Profit Creation: Analytics and Strategy for Competitiveness and Efficiency", desc: "Program pengembangan strategi dan analisis penciptaan laba untuk meningkatkan daya saing dan efisiensi organisasi." },
    ],
  },
  {
    id: "06", icon: Users,
    title: "Human Capital Management", short: "HCM",
    accent: "#8B5CF6", bg: "#120A1E",
    tagline: "Optimalkan potensi sumber daya manusia sebagai aset strategis organisasi.",
    desc: "Program HCM GRCC membantu organisasi membangun sistem manajemen SDM yang terintegrasi — dari talent acquisition, pengembangan kepemimpinan, hingga human capital analytics berbasis data.",
    subs: [
      { name: "Talent Management", desc: "Program pengelolaan talenta untuk mendukung ketersediaan dan pengembangan sumber daya manusia strategis." },
      { name: "Directory Competency Assessment", desc: "Program penilaian kompetensi jabatan untuk mendukung pengelolaan SDM berbasis kompetensi." },
      { name: "Remuneration System", desc: "Program perancangan sistem remunerasi yang selaras dengan kinerja dan kebijakan organisasi." },
      { name: "Individual Performance Management", desc: "Program pengelolaan kinerja individu untuk mendukung pencapaian target organisasi." },
      { name: "Motivation and Leadership", desc: "Program pengembangan motivasi dan kepemimpinan dalam organisasi." },
      { name: "Human Capital Strategy", desc: "Program perumusan strategi pengelolaan sumber daya manusia yang selaras dengan strategi organisasi." },
      { name: "Competency Based Interview", desc: "Program penguatan teknik wawancara berbasis kompetensi dalam proses seleksi dan pengembangan SDM." },
      { name: "Performance Management System", desc: "Program pengembangan sistem manajemen kinerja organisasi." },
      { name: "Remuneration Management", desc: "Program pengelolaan remunerasi untuk mendukung keadilan dan daya saing organisasi." },
      { name: "Workload Analysis", desc: "Program analisis beban kerja sebagai dasar perencanaan dan pengelolaan SDM." },
      { name: "Managing The Organization's Talent", desc: "Program penguatan pengelolaan talenta organisasi secara terintegrasi." },
      { name: "HR Business Partner", desc: "Program penguatan peran strategis fungsi SDM sebagai mitra bisnis organisasi." },
      { name: "Design Competency Model", desc: "Program perancangan model kompetensi sebagai dasar pengelolaan SDM." },
      { name: "Managing Emotional Well-Being at Work", desc: "Program pengelolaan kesejahteraan emosional karyawan di lingkungan kerja." },
      { name: "The Art of Performance Monitoring & Coaching", desc: "Program pengembangan kemampuan pemantauan kinerja dan coaching." },
      { name: "Digital Leadership", desc: "Program pengembangan kepemimpinan dalam menghadapi transformasi digital." },
      { name: "Continuous Improvement (Kaizen)", desc: "Program penerapan perbaikan berkelanjutan untuk meningkatkan kinerja organisasi." },
    ],
  },
  {
    id: "07", icon: Cpu,
    title: "Digital and Technology in Finance", short: "DTF",
    accent: "#06B6D4", bg: "#071A1E",
    tagline: "Manfaatkan teknologi digital untuk transformasi fungsi keuangan Anda.",
    desc: "Program ini mempersiapkan profesional keuangan untuk menghadapi era digital — mulai dari FinTech, AI dalam akuntansi, analisis data keuangan, hingga keamanan siber dalam sistem keuangan.",
    subs: [
      { name: "AI for Digital Products", desc: "Program pemanfaatan kecerdasan buatan dalam pengembangan dan pengelolaan produk digital." },
      { name: "AI in Finance", desc: "Program penerapan kecerdasan buatan untuk mendukung analisis, pengelolaan, dan pengambilan keputusan di bidang keuangan." },
      { name: "AI in HRD", desc: "Program penerapan kecerdasan buatan dalam pengelolaan dan pengembangan sumber daya manusia." },
      { name: "AI in ESG", desc: "Program pemanfaatan kecerdasan buatan untuk mendukung pengelolaan dan pelaporan aspek ESG." },
      { name: "ChatGPT untuk Finance", desc: "Program pemanfaatan ChatGPT dalam mendukung analisis dan aktivitas keuangan organisasi." },
    ],
  },
  {
    id: "08", icon: FlaskConical,
    title: "Penelitian", short: "RES",
    accent: "#F97316", bg: "#1A0D00",
    tagline: "Perkuat kapasitas riset untuk menghasilkan temuan yang berdampak.",
    desc: "Program penelitian GRCC dirancang untuk meningkatkan kompetensi metodologi riset, analisis data, dan penulisan ilmiah bagi akademisi, praktisi, dan mahasiswa pascasarjana.",
    subs: [
      { name: "Pelatihan Riset Kuantitatif dengan Data Sekunder menggunakan SPSS", desc: "Program pelatihan metode riset kuantitatif berbasis data sekunder menggunakan perangkat lunak SPSS." },
      { name: "Pelatihan Riset Kuantitatif dengan Data Sekunder menggunakan Stata", desc: "Program pelatihan metode riset kuantitatif berbasis data sekunder menggunakan perangkat lunak Stata." },
      { name: "Pelatihan Riset Kuantitatif dengan Smart PLS", desc: "Program pelatihan analisis data kuantitatif menggunakan aplikasi Smart PLS." },
      { name: "Pelatihan Riset Kualitatif dengan NVivo", desc: "Program pelatihan metode riset kualitatif menggunakan perangkat lunak NVivo." },
      { name: "Pelatihan Publikasi Artikel Scopus Q1 dan Top Tier", desc: "Program pelatihan penulisan dan publikasi artikel ilmiah pada jurnal Scopus Q1 dan jurnal bereputasi tinggi." },
    ],
  },
];
