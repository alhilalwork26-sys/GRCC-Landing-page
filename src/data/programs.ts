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
        name: "Pengembangan Soft Skill Tata Kelola",
        desc: `Program Pengembangan Soft Skill Tata Kelola dirancang untuk membangun kompetensi non-teknis yang menjadi fondasi efektivitas implementasi tata kelola di seluruh level perusahaan. Program ini meyakini bahwa tata kelola yang baik tidak hanya ditopang oleh sistem dan regulasi, tetapi juga oleh kapasitas individu mulai dari cara berkomunikasi, mengambil keputusan etis, memimpin dengan integritas, hingga membangun kolaborasi yang sehat di dalam dan antar unit kerja.

Keberhasilan implementasi tata kelola sangat bergantung pada kualitas sumber daya manusia yang menjalankannya. Keterampilan teknis saja tidak cukup dibutuhkan kemampuan interpersonal, kepemimpinan, dan etika yang kuat agar setiap individu mampu berkontribusi secara nyata terhadap budaya tata kelola yang sehat. Program ini hadir untuk menjembatani gap antara pemahaman teknis tata kelola dengan kemampuan menerapkannya secara efektif dalam interaksi dan dinamika perusahaan sehari-hari.`
      },
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
      {
        name: "Roadmap Implementasi Keberlanjutan",
        desc: `Program ini dirancang untuk membantu perusahaan merancang peta jalan keberlanjutan yang terstruktur, realistis, dan selaras dengan visi jangka panjang. Melalui pendekatan yang sistematis, peserta akan mampu menerjemahkan komitmen keberlanjutan menjadi rencana aksi konkret yang dapat dieksekusi secara bertahap dan terukur mulai dari pemetaan kondisi awal hingga penetapan target keberlanjutan jangka pendek, menengah, dan panjang.

Roadmap ini menjadi panduan praktis bagi perusahaan dalam menentukan target, program kerja, indikator keberhasilan, serta peran setiap unit kerja dalam mendukung agenda keberlanjutan. Dengan pendekatan yang sistematis, perusahaan dapat bergerak dari sekadar komitmen menuju implementasi nyata yang berdampak.`
      },
      {
        name: "Strategi Keberlanjutan",
        desc: `Program Strategi Keberlanjutan membekali pemimpin dan pengambil keputusan dengan kerangka berpikir dan alat analisis yang diperlukan untuk mengintegrasikan keberlanjutan ke dalam inti strategi bisnis. Keberlanjutan bukan lagi pilihan tambahan ia adalah faktor penentu daya saing jangka panjang. Program ini membantu perusahaan membangun strategi yang menciptakan nilai ekonomi sekaligus dampak positif bagi lingkungan dan masyarakat.

Melalui program ini, perusahaan akan didampingi dalam mengidentifikasi isu material, menyusun tujuan strategis, menentukan program prioritas, dan membangun kerangka pengukuran kinerja keberlanjutan. Hasilnya, strategi keberlanjutan tidak hanya menjadi dokumen, tetapi menjadi bagian dari arah bisnis dan pengambilan keputusan perusahaan.`
      },
      {
        name: "Inovasi Keberlanjutan",
        desc: `Program Inovasi Keberlanjutan mendorong perusahaan untuk melampaui kepatuhan dan menemukan cara-cara baru yang kreatif dalam menciptakan nilai melalui solusi berkelanjutan. Dari desain produk ramah lingkungan hingga model bisnis sirkular dan teknologi hijau, program ini menginspirasi dan membekali peserta dengan metodologi inovasi yang berorientasi pada dampak nyata bagi lingkungan dan masyarakat.

Melalui pendekatan inovatif, program ini membantu perusahaan menggali potensi pengembangan produk, layanan, proses bisnis, maupun kolaborasi yang lebih berkelanjutan. Dengan demikian, perusahaan dapat membangun keunggulan yang relevan dengan kebutuhan masa depan dan ekspektasi pelanggan yang semakin peduli terhadap praktik bisnis bertanggung jawab.`
      },
      {
        name: "Kepemimpinan Keberlanjutan",
        desc: `Program Kepemimpinan Keberlanjutan dirancang untuk mempersiapkan para pemimpin yang mampu menggerakkan transformasi keberlanjutan dari dalam perusahaan. Di tengah kompleksitas tantangan ESG yang semakin meningkat, dibutuhkan pemimpin yang tidak hanya memahami isu keberlanjutan secara mendalam, tetapi juga mampu menginspirasi, memobilisasi sumber daya, dan membuat keputusan sulit dengan perspektif jangka panjang yang berani.

Program ini membantu para pemimpin mengembangkan pola pikir, keterampilan, dan komitmen yang dibutuhkan untuk mendorong transformasi berkelanjutan. Dengan kepemimpinan yang kuat, agenda keberlanjutan dapat menjadi bagian dari budaya perusahaan, bukan sekadar program tambahan.`
      },
      {
        name: "Penyusunan Laporan Keberlanjutan",
        desc: `Program ini membekali peserta dengan pengetahuan dan keterampilan praktis dalam menyusun laporan keberlanjutan yang berkualitas, transparan, dan sesuai dengan standar pelaporan internasional yang diakui secara global. Laporan keberlanjutan yang baik bukan sekadar dokumen kepatuhan ia adalah media komunikasi strategis yang membangun kepercayaan investor, pelanggan, dan seluruh pemangku kepentingan terhadap komitmen ESG perusahaan.

Melalui pendampingan ini, perusahaan akan dibantu dalam mengidentifikasi data utama, menyusun narasi keberlanjutan, memetakan indikator kinerja, serta menyajikan informasi lingkungan, sosial, dan tata kelola secara lebih jelas. Laporan yang dihasilkan diharapkan dapat memperkuat reputasi, meningkatkan kepercayaan publik, dan menjadi dasar pengambilan keputusan strategis.`
      },
      {
        name: "Pengembangan Green Talent",
        desc: `Program Pengembangan Green Talent dirancang untuk mempersiapkan generasi profesional yang memiliki kompetensi, kepekaan, dan komitmen terhadap keberlanjutan. Di tengah meningkatnya kebutuhan pasar akan tenaga kerja yang melek isu ESG, program ini membantu perusahaan mengidentifikasi, mengembangkan, dan mempertahankan talenta yang mampu menjadi penggerak transformasi hijau dari dalam.

Program ini membantu perusahaan menyiapkan SDM yang tidak hanya memahami konsep sustainability, tetapi juga mampu berkontribusi dalam efisiensi sumber daya, inovasi hijau, pengelolaan risiko, dan penciptaan nilai jangka panjang. Dengan green talent yang kuat, keberlanjutan dapat tumbuh sebagai budaya kerja, bukan hanya sebagai program formal perusahaan.`
      },
      {
        name: "IFRS S1 & S2 Implementation",
        desc: `Program IFRS S1 & S2 Implementation memberikan pemahaman mendalam dan panduan praktis tentang implementasi standar pelaporan keberlanjutan terbaru dari International Sustainability Standards Board (ISSB). IFRS S1 mengatur pengungkapan informasi keberlanjutan secara umum, sementara IFRS S2 berfokus pada pengungkapan terkait iklim. Program ini mempersiapkan perusahaan untuk memenuhi ekspektasi investor global dan regulator dalam pengungkapan ESG yang berkualitas dan terstandar.

Melalui pendekatan yang praktis, perusahaan akan didampingi dalam memetakan risiko dan peluang keberlanjutan, menghubungkan informasi sustainability dengan laporan keuangan, serta memperkuat tata kelola pelaporan. Implementasi IFRS S1 dan S2 menjadi langkah penting bagi perusahaan yang ingin meningkatkan transparansi, kredibilitas, dan kesiapan menghadapi tuntutan investor maupun regulator.`
      },
      {
        name: "Double Materiality Assessment",
        desc: `Program Double Materiality Assessment membekali peserta dengan metodologi dan kerangka kerja untuk melakukan penilaian materialitas ganda sebuah pendekatan yang menilai dampak keberlanjutan dari dua perspektif sekaligus: bagaimana isu ESG mempengaruhi kinerja keuangan perusahaan (financial materiality), dan bagaimana aktivitas perusahaan berdampak terhadap lingkungan dan masyarakat (impact materiality). Pendekatan ini merupakan inti dari standar ESRS (European Sustainability Reporting Standards) dan semakin diadopsi sebagai praktik terbaik global.

Melalui proses asesmen yang terarah, perusahaan dapat memahami isu mana yang perlu diprioritaskan, bagaimana dampaknya terhadap pemangku kepentingan, dan bagaimana isu tersebut berhubungan dengan risiko serta peluang bisnis. Hasil asesmen ini dapat menjadi dasar penting dalam penyusunan strategi, laporan keberlanjutan, pengelolaan risiko, dan pengambilan keputusan jangka panjang.`
      },
      {
        name: "Climate Risk (TCFD-based)",
        desc: `Program Climate Risk berbasis TCFD membekali perusahaan dengan pemahaman mendalam dan kemampuan praktis dalam mengidentifikasi, menilai, mengelola, dan mengungkapkan risiko serta peluang yang timbul dari perubahan iklim. Menggunakan kerangka Task Force on Climate-related Financial Disclosures (TCFD) sebagai fondasi, program ini membantu perusahaan mengintegrasikan pertimbangan iklim ke dalam strategi bisnis, manajemen risiko, dan proses pengambilan keputusan keuangan.

Melalui program ini, perusahaan akan didampingi dalam memahami risiko fisik dan risiko transisi, memetakan dampaknya terhadap model bisnis, serta menyusun strategi mitigasi dan adaptasi yang lebih terukur. Pendekatan berbasis TCFD membantu perusahaan membangun kesiapan menghadapi perubahan iklim sekaligus meningkatkan kualitas pengungkapan kepada investor, regulator, dan pemangku kepentingan lainnya.`
      },
      {
        name: "Human Right Due Diligence",
        desc: `Program Human Rights Due Diligence (HRDD) mempersiapkan perusahaan untuk mengidentifikasi, mencegah, memitigasi, dan mempertanggungjawabkan dampak aktual maupun potensial terhadap hak asasi manusia dalam seluruh rantai nilai bisnisnya. Seiring meningkatnya regulasi wajib HRD di berbagai negara dan ekspektasi pemangku kepentingan yang semakin tinggi, kemampuan mengelola isu hak asasi manusia secara proaktif menjadi kompetensi esensial bagi setiap perusahaan yang bertanggung jawab.

Melalui pendampingan ini, perusahaan akan dibantu dalam memetakan potensi risiko HAM, meninjau kebijakan dan prosedur internal, mengidentifikasi kelompok terdampak, serta menyusun langkah perbaikan yang relevan. Dengan proses due diligence yang baik, perusahaan dapat memperkuat kepatuhan, menjaga reputasi, dan membangun hubungan yang lebih sehat dengan pekerja, mitra, komunitas, dan pemangku kepentingan lainnya.`
      },
      {
        name: "Certified Sustainability, Strategies and Leadership (CSSL)",
        desc: `Program Certified Sustainability Strategies and Leadership (CSSL) merupakan program sertifikasi profesional bergengsi yang dirancang untuk memvalidasi kompetensi terdepan di bidang strategi dan kepemimpinan keberlanjutan. CSSL mempersiapkan para pemimpin dan praktisi keberlanjutan untuk merancang, mengimplementasikan, dan mengkomunikasikan strategi ESG yang berdampak sekaligus memberikan pengakuan formal atas keahlian mereka melalui sertifikasi yang diakui secara nasional dan internasional.

Melalui program ini, peserta akan memperoleh bekal untuk memahami isu keberlanjutan secara lebih komprehensif, mulai dari strategi, tata kelola, inovasi, pelaporan, hingga kepemimpinan. CSSL menjadi pilihan tepat bagi perusahaan maupun individu yang ingin meningkatkan kompetensi, memperkuat kredibilitas profesional, dan mengambil peran lebih besar dalam transformasi keberlanjutan.`
      },
    ],
  },
  {
    id: "03", icon: BookOpen,
    title: "Accounting", short: "ACC",
    accent: "#F59E0B", bg: "#1C0E00",
    tagline: "Kuasai standar akuntansi modern untuk keputusan keuangan yang tepat.",
    desc: "Program akuntansi GRCC mencakup standar pelaporan keuangan internasional dan domestik, akuntansi manajemen berbasis kinerja, serta tata kelola keuangan sektor publik dan swasta.",
    subs: [
      {
        name: "Finance for Non-Finance Managers",
        desc: `Program ini dirancang khusus bagi manajer, supervisor, dan profesional non-keuangan yang ingin memahami bahasa keuangan secara lebih mudah dan praktis. Peserta akan dibekali kemampuan membaca laporan keuangan, memahami indikator kinerja keuangan, serta menggunakan informasi keuangan sebagai dasar pengambilan keputusan bisnis.

Melalui program ini, peserta tidak hanya memahami angka, tetapi juga mampu melihat makna strategis di balik angka tersebut. Program ini sangat relevan bagi pemimpin unit kerja yang ingin meningkatkan ketajaman analisis, mengelola anggaran dengan lebih baik, dan berkontribusi pada peningkatan kinerja perusahaan.`
      },
      {
        name: "Corporate Budgeting",
        desc: `Program Corporate Budgeting membantu perusahaan menyusun anggaran perusahaan secara lebih terstruktur, realistis, dan selaras dengan strategi bisnis. Peserta akan memahami proses perencanaan anggaran, pengendalian realisasi, analisis deviasi, serta cara menjadikan anggaran sebagai alat manajemen yang efektif.

Program ini cocok bagi perusahaan yang ingin meningkatkan disiplin keuangan, memperkuat koordinasi antar unit, dan memastikan setiap alokasi anggaran benar-benar mendukung pencapaian target perusahaan. Dengan sistem budgeting yang baik, perusahaan dapat bekerja lebih terarah dan responsif terhadap perubahan bisnis.`
      },
      {
        name: "ESG Budgeting",
        desc: `Program ESG Budgeting membantu organisasi mengintegrasikan aspek Environmental, Social, and Governance ke dalam proses perencanaan dan pengelolaan anggaran. Program ini dirancang untuk menjawab kebutuhan organisasi yang ingin memastikan bahwa komitmen keberlanjutan tidak hanya berhenti pada strategi, tetapi juga tercermin dalam alokasi sumber daya dan keputusan keuangan.

Melalui program ini, peserta akan memahami bagaimana menyusun anggaran yang mendukung program keberlanjutan, mengukur prioritas ESG, serta menghubungkan inisiatif ESG dengan nilai bisnis jangka panjang. Program ini menjadi pilihan tepat bagi organisasi yang ingin membangun praktik keuangan yang lebih bertanggung jawab, transparan, dan berorientasi masa depan.`
      },
      {
        name: "Financial Statement Analysis",
        desc: `Program ini membantu peserta memahami dan menganalisis laporan keuangan secara komprehensif untuk menilai kondisi, kinerja, dan prospek bisnis suatu organisasi. Peserta akan mempelajari cara membaca neraca, laporan laba rugi, arus kas, serta rasio-rasio keuangan penting yang digunakan dalam pengambilan keputusan.

Dengan mengikuti program ini, peserta akan mampu mengidentifikasi kekuatan dan kelemahan keuangan perusahaan, membaca tren kinerja, serta menyusun insight yang berguna bagi manajemen, investor, maupun pemangku kepentingan lainnya. Program ini sangat relevan bagi profesional yang ingin meningkatkan kemampuan analisis bisnis berbasis data keuangan.`
      },
      {
        name: "Business Valuation",
        desc: `Program Business Valuation dirancang untuk membantu peserta memahami cara menilai nilai suatu bisnis secara objektif dan profesional. Program ini membahas pendekatan valuasi yang umum digunakan, seperti asset-based approach, market approach, dan income approach, serta bagaimana menyesuaikannya dengan kondisi bisnis yang berbeda.

Program ini sangat bermanfaat bagi perusahaan, investor, konsultan, maupun profesional yang terlibat dalam merger, akuisisi, investasi, restrukturisasi, atau pengambilan keputusan strategis. Dengan pemahaman valuasi yang baik, organisasi dapat mengambil keputusan bisnis dengan lebih rasional, terukur, dan bernilai jangka panjang.`
      },
      {
        name: "Cost Accounting",
        desc: `Program Cost Accounting membantu peserta memahami bagaimana biaya diklasifikasikan, dihitung, dianalisis, dan digunakan untuk mendukung pengambilan keputusan manajerial. Peserta akan mempelajari konsep biaya produksi, biaya langsung dan tidak langsung, biaya tetap dan variabel, serta cara menentukan harga pokok secara lebih akurat.

Program ini penting bagi organisasi yang ingin meningkatkan efisiensi, mengendalikan biaya, dan memperkuat daya saing. Dengan sistem akuntansi biaya yang baik, manajemen dapat memahami sumber pemborosan, menentukan harga dengan lebih tepat, dan meningkatkan profitabilitas secara berkelanjutan.`
      },
      {
        name: "Activity Based Costing and Activity Based Management",
        desc: `Program Activity Based Costing and Activity Based Management membantu organisasi memahami biaya berdasarkan aktivitas yang benar-benar mengonsumsi sumber daya. Pendekatan ini memberikan gambaran biaya yang lebih akurat dibandingkan metode tradisional, terutama bagi organisasi dengan proses bisnis yang kompleks.

Melalui program ini, peserta akan belajar mengidentifikasi aktivitas utama, menentukan cost driver, menghitung biaya berbasis aktivitas, serta menggunakan informasi tersebut untuk perbaikan proses bisnis. Program ini sangat relevan bagi organisasi yang ingin meningkatkan efisiensi, mengurangi aktivitas yang tidak bernilai tambah, dan memperkuat pengambilan keputusan berbasis biaya yang lebih akurat.`
      },
      {
        name: "Management Control Systems",
        desc: `Program Management Control Systems membantu organisasi membangun sistem pengendalian manajemen yang mampu mengarahkan perilaku, kinerja, dan keputusan agar selaras dengan strategi organisasi. Peserta akan memahami bagaimana perencanaan, pengukuran kinerja, evaluasi, insentif, dan pengendalian digunakan untuk memastikan tujuan organisasi tercapai.

Program ini cocok bagi organisasi yang ingin memperkuat akuntabilitas, meningkatkan efektivitas manajerial, dan menciptakan sistem kerja yang lebih terukur. Dengan sistem pengendalian manajemen yang tepat, organisasi dapat menjaga konsistensi kinerja sekaligus tetap adaptif terhadap perubahan lingkungan bisnis.`
      },
      {
        name: "Praktik Perpajakan",
        desc: `Program Praktik Perpajakan dirancang untuk membantu peserta memahami aspek perpajakan secara praktis, mulai dari kewajiban administrasi, perhitungan pajak, pelaporan, hingga kepatuhan terhadap regulasi yang berlaku. Program ini memberikan pemahaman yang aplikatif agar peserta mampu menjalankan proses perpajakan dengan lebih tepat dan minim risiko.

Program ini sangat relevan bagi staf keuangan, akuntansi, administrasi, pelaku usaha, maupun manajer yang ingin memahami implikasi pajak dalam kegiatan bisnis. Dengan pengelolaan pajak yang baik, organisasi dapat menjaga kepatuhan, menghindari sanksi, dan mendukung tata kelola keuangan yang lebih sehat.`
      },
      {
        name: "Internal Control over Financial Reporting (ICoFR)",
        desc: `Program ICoFR membantu organisasi membangun dan mengevaluasi pengendalian internal atas pelaporan keuangan agar laporan yang dihasilkan lebih andal, akurat, dan dapat dipercaya. Program ini membahas bagaimana risiko dalam proses pelaporan keuangan diidentifikasi, dikendalikan, dan dimonitor secara efektif.

Melalui program ini, peserta akan memahami hubungan antara proses bisnis, risiko, kontrol, dokumentasi, dan pengujian pengendalian. Program ini sangat penting bagi organisasi yang ingin memperkuat tata kelola, meningkatkan kualitas laporan keuangan, serta membangun kepercayaan dari manajemen, auditor, regulator, dan pemangku kepentingan lainnya.`
      },
    ],
  },
  {
    id: "04", icon: Search,
    title: "Auditing", short: "AUD",
    accent: "#EF4444", bg: "#1A0A0A",
    tagline: "Tingkatkan kualitas audit untuk kepercayaan dan akuntabilitas yang lebih kuat.",
    desc: "Program auditing GRCC membekali auditor internal dan eksternal dengan metodologi audit terkini, dari audit berbasis risiko hingga forensic accounting dan IT audit sesuai standar IIA dan IAPI.",
    subs: [
      {
        name: "Sertifikasi Internal Audit BNSP",
        desc: `Program Sertifikasi Internal Audit BNSP dirancang untuk membekali peserta dengan kompetensi audit internal yang terstruktur, aplikatif, dan sesuai dengan kebutuhan dunia kerja. Program ini sangat relevan bagi auditor internal, staf pengawasan, manajer risiko, compliance officer, maupun profesional yang ingin meningkatkan kredibilitas di bidang audit.

Melalui program ini, peserta akan memahami proses audit internal mulai dari perencanaan, pelaksanaan, pengumpulan bukti, penyusunan temuan, hingga pelaporan hasil audit. Dengan sertifikasi yang diakui, peserta memiliki nilai tambah profesional sekaligus membantu organisasi membangun fungsi audit internal yang lebih kompeten, objektif, dan dapat dipercaya.`
      },
      {
        name: "Risk-Based Audit",
        desc: `Program Risk-Based Audit membantu peserta memahami bagaimana audit dilakukan dengan fokus pada risiko-risiko utama yang paling berdampak terhadap pencapaian tujuan organisasi. Pendekatan ini membuat proses audit menjadi lebih tajam, relevan, dan tidak sekadar memeriksa kepatuhan administratif.

Melalui program ini, peserta akan belajar mengidentifikasi risiko strategis, operasional, keuangan, dan kepatuhan, kemudian menghubungkannya dengan prioritas audit. Program ini sangat tepat bagi organisasi yang ingin meningkatkan efektivitas audit internal, mengoptimalkan sumber daya audit, dan memastikan pengawasan benar-benar diarahkan pada area yang paling penting.`
      },
      {
        name: "Management Audit",
        desc: `Program Management Audit dirancang untuk membantu organisasi mengevaluasi efektivitas manajemen dalam menjalankan fungsi perencanaan, pengorganisasian, pelaksanaan, dan pengendalian. Program ini tidak hanya melihat apakah suatu proses sudah berjalan, tetapi juga menilai apakah proses tersebut benar-benar efektif, efisien, dan mendukung pencapaian strategi organisasi.

Melalui program ini, peserta akan memahami cara menilai kinerja manajerial, mengevaluasi proses bisnis, mengidentifikasi kelemahan sistem, serta menyusun rekomendasi perbaikan yang bernilai strategis. Program ini sangat bermanfaat bagi organisasi yang ingin meningkatkan kualitas pengambilan keputusan, memperbaiki tata kelola, dan mendorong kinerja yang lebih berkelanjutan.`
      },
      {
        name: "Audit Investigation",
        desc: `Program Audit Investigation membantu peserta memahami teknik pemeriksaan khusus untuk mengungkap indikasi penyimpangan, kecurangan, konflik kepentingan, atau pelanggaran dalam organisasi. Program ini dirancang untuk membangun kemampuan peserta dalam melakukan investigasi secara objektif, sistematis, dan berbasis bukti.

Melalui program ini, peserta akan mempelajari tahapan investigasi, teknik pengumpulan dan analisis bukti, wawancara investigatif, dokumentasi temuan, hingga penyusunan laporan investigasi. Program ini sangat penting bagi organisasi yang ingin memperkuat sistem pengawasan, mencegah kerugian, menjaga integritas, dan membangun budaya kerja yang lebih transparan serta akuntabel.`
      },
    ],
  },
  {
    id: "05", icon: TrendingUp,
    title: "Organizational Competitiveness", short: "OC",
    accent: "#0EA5E9", bg: "#0A1520",
    tagline: "Transformasikan organisasi Anda menjadi entitas yang adaptif dan berdaya saing tinggi.",
    desc: "Program daya saing organisasi GRCC fokus pada penguatan kapabilitas strategis, transformasi bisnis, dan inovasi organisasi untuk menghadapi perubahan pasar dan lingkungan yang semakin dinamis.",
    subs: [
      {
        name: "Corporate Strategy",
        desc: `Program Corporate Strategy membantu organisasi merumuskan arah strategis jangka panjang yang selaras dengan visi, misi, sumber daya, dan dinamika lingkungan bisnis. Program ini membahas bagaimana organisasi menentukan prioritas pertumbuhan, mengelola portofolio bisnis, membaca peluang pasar, serta mengambil keputusan strategis yang berdampak pada keberlanjutan organisasi.

Melalui program ini, peserta akan memahami cara menyusun strategi korporasi yang tidak hanya bersifat konseptual, tetapi juga dapat diterjemahkan ke dalam keputusan nyata. Program ini sangat relevan bagi pimpinan, manajer, dan tim perencana strategis yang ingin memastikan organisasi bergerak dengan arah yang jelas, fokus, dan kompetitif.`
      },
      {
        name: "Competitive Strategy",
        desc: `Program Competitive Strategy dirancang untuk membantu organisasi memahami posisi persaingan dan membangun keunggulan yang sulit ditiru oleh kompetitor. Peserta akan mempelajari bagaimana menganalisis industri, memahami perilaku pesaing, menentukan proposisi nilai, serta memilih strategi bersaing yang paling sesuai dengan karakteristik organisasi.

Program ini membantu organisasi menjawab pertanyaan penting: bagaimana cara memenangkan pasar, mempertahankan pelanggan, dan menciptakan nilai yang berbeda dibandingkan kompetitor. Dengan strategi bersaing yang tepat, organisasi dapat meningkatkan posisi pasar, memperkuat diferensiasi, dan menciptakan pertumbuhan yang lebih berkelanjutan.`
      },
      {
        name: "Business Process Management and Engineering",
        desc: `Program Business Process Management and Engineering membantu organisasi menata, menganalisis, dan memperbaiki proses bisnis agar lebih efektif, efisien, dan adaptif terhadap perubahan. Program ini berfokus pada bagaimana proses kerja dapat dirancang ulang untuk mengurangi pemborosan, mempercepat layanan, meningkatkan kualitas output, dan mendukung pencapaian strategi organisasi.

Melalui program ini, peserta akan memahami cara memetakan proses bisnis, mengidentifikasi hambatan, merancang perbaikan proses, serta membangun sistem kerja yang lebih terintegrasi. Program ini sangat tepat bagi organisasi yang ingin meningkatkan produktivitas, memperkuat koordinasi antar unit, dan menciptakan proses kerja yang lebih ramping serta bernilai tambah.`
      },
      {
        name: "Supply Chain Management",
        desc: `Program Supply Chain Management dirancang untuk membantu organisasi mengelola rantai pasok secara lebih strategis, efisien, dan responsif. Peserta akan memahami bagaimana mengelola aliran barang, informasi, dan biaya mulai dari pemasok hingga pelanggan akhir, sehingga organisasi dapat meningkatkan kecepatan, kualitas, dan efisiensi operasional.

Program ini sangat relevan bagi organisasi yang ingin memperkuat ketahanan rantai pasok, mengurangi biaya operasional, meningkatkan kepuasan pelanggan, dan menghadapi risiko gangguan pasokan. Dengan pengelolaan supply chain yang baik, organisasi dapat menciptakan keunggulan kompetitif yang nyata dalam biaya, kualitas, dan kecepatan layanan.`
      },
      {
        name: "Organizational Performance Management",
        desc: `Program Organizational Performance Management membantu organisasi membangun sistem pengelolaan kinerja yang terarah, terukur, dan selaras dengan strategi. Program ini membahas bagaimana organisasi menetapkan indikator kinerja, memantau pencapaian target, mengevaluasi hasil, serta memastikan setiap unit kerja berkontribusi terhadap tujuan utama organisasi.

Melalui program ini, peserta akan memahami cara merancang sistem kinerja yang tidak hanya berfokus pada angka, tetapi juga mendorong akuntabilitas, perbaikan berkelanjutan, dan pengambilan keputusan berbasis data. Program ini cocok bagi organisasi yang ingin meningkatkan efektivitas kerja, memperkuat budaya kinerja, dan memastikan strategi benar-benar terlaksana di lapangan.`
      },
      {
        name: "Brand Plan & Brand Strategy",
        desc: `Program Brand Plan & Brand Strategy membantu organisasi membangun merek yang kuat, relevan, dan memiliki posisi yang jelas di benak pelanggan. Program ini membahas bagaimana merumuskan identitas merek, memahami target pasar, menyusun pesan utama, menentukan diferensiasi, serta mengembangkan rencana komunikasi yang konsisten.

Melalui program ini, organisasi dapat memperkuat citra, meningkatkan kepercayaan pelanggan, dan membangun hubungan yang lebih kuat dengan pasar. Program ini sangat relevan bagi perusahaan, institusi, maupun unit bisnis yang ingin meningkatkan daya tarik merek, memperluas jangkauan pasar, dan menciptakan brand yang tidak hanya dikenal, tetapi juga dipercaya.`
      },
      {
        name: "Profit Creation: Analytics and Strategy for Competitiveness and Efficiency",
        desc: `Program Profit Creation: Analytics and Strategy for Competitiveness and Efficiency dirancang untuk membantu organisasi menciptakan profitabilitas melalui kombinasi analisis data, strategi bisnis, efisiensi biaya, dan peningkatan nilai pelanggan. Program ini membantu peserta memahami sumber utama profit, membaca pola kinerja bisnis, mengidentifikasi area pemborosan, serta merancang strategi peningkatan margin.

Melalui pendekatan analitis dan strategis, peserta akan dibekali kemampuan untuk mengambil keputusan yang lebih tajam dalam pengelolaan biaya, harga, proses bisnis, dan peluang pertumbuhan. Program ini sangat tepat bagi organisasi yang ingin meningkatkan profit secara berkelanjutan tanpa hanya bergantung pada peningkatan penjualan, tetapi juga melalui efisiensi dan penciptaan nilai yang lebih cerdas.`
      },
    ],
  },
  {
    id: "06", icon: Users,
    title: "Human Capital Management", short: "HCM",
    accent: "#8B5CF6", bg: "#120A1E",
    tagline: "Optimalkan potensi sumber daya manusia sebagai aset strategis organisasi.",
    desc: "Program HCM GRCC membantu organisasi membangun sistem manajemen SDM yang terintegrasi — dari talent acquisition, pengembangan kepemimpinan, hingga human capital analytics berbasis data.",
    subs: [
      {
        name: "Talent Management",
        desc: `Program Talent Management membantu organisasi mengidentifikasi, mengembangkan, dan mempertahankan talenta terbaik agar mampu mendukung pencapaian strategi bisnis. Peserta akan memahami proses talent mapping, succession planning, pengembangan karier, serta strategi retensi talenta kunci.

Program ini sangat relevan bagi organisasi yang ingin memastikan posisi strategis diisi oleh orang yang tepat, dengan kompetensi dan kesiapan yang sesuai.`
      },
      {
        name: "Directory Competency Assessment",
        desc: `Program Directory Competency Assessment membantu organisasi menyusun dan mengevaluasi direktori kompetensi sebagai dasar pengembangan SDM. Melalui asesmen yang terstruktur, organisasi dapat mengetahui kesenjangan kompetensi, kebutuhan pelatihan, dan kesiapan individu terhadap tuntutan jabatan.

Program ini mendukung pengambilan keputusan SDM yang lebih objektif, mulai dari rekrutmen, promosi, rotasi, hingga pengembangan karier.`
      },
      {
        name: "Remuneration System",
        desc: `Program Remuneration System dirancang untuk membantu organisasi membangun sistem remunerasi yang adil, kompetitif, dan selaras dengan kinerja. Peserta akan memahami prinsip penyusunan struktur gaji, grading jabatan, benefit, insentif, serta keterkaitan remunerasi dengan strategi organisasi.

Dengan sistem remunerasi yang tepat, organisasi dapat meningkatkan motivasi, menjaga talenta terbaik, dan memperkuat keadilan internal.`
      },
      {
        name: "Individual Performance Management",
        desc: `Program Individual Performance Management membantu organisasi mengelola kinerja individu secara lebih terarah dan terukur. Peserta akan memahami cara menetapkan target kerja, indikator kinerja, monitoring pencapaian, evaluasi performa, serta pemberian umpan balik yang konstruktif.

Program ini penting untuk memastikan setiap individu memahami kontribusinya terhadap tujuan organisasi dan mampu meningkatkan kinerja secara berkelanjutan.`
      },
      {
        name: "Motivation and Leadership",
        desc: `Program Motivation and Leadership dirancang untuk memperkuat kemampuan pemimpin dalam membangun motivasi, menggerakkan tim, dan menciptakan lingkungan kerja yang produktif. Peserta akan memahami bagaimana gaya kepemimpinan, komunikasi, dan pemberdayaan karyawan dapat memengaruhi kinerja organisasi.

Program ini cocok bagi supervisor, manajer, dan calon pemimpin yang ingin meningkatkan pengaruh positif dalam tim.`
      },
      {
        name: "Human Capital Strategy",
        desc: `Program Human Capital Strategy membantu organisasi merancang strategi SDM yang selaras dengan arah bisnis. Peserta akan memahami bagaimana kebutuhan tenaga kerja, kompetensi, budaya organisasi, dan sistem kinerja dapat dirancang untuk mendukung daya saing organisasi.

Program ini sangat relevan bagi organisasi yang ingin menjadikan SDM sebagai aset strategis, bukan sekadar fungsi administratif.`
      },
      {
        name: "Competency Based Interview",
        desc: `Program Competency Based Interview membekali peserta dengan keterampilan wawancara berbasis kompetensi untuk mendapatkan kandidat yang paling sesuai dengan kebutuhan jabatan. Peserta akan mempelajari teknik menggali pengalaman, perilaku kerja, motivasi, dan potensi kandidat secara lebih objektif.

Program ini membantu organisasi meningkatkan kualitas rekrutmen dan mengurangi risiko salah pilih kandidat.`
      },
      {
        name: "Performance Management System",
        desc: `Program Performance Management System membantu organisasi merancang sistem manajemen kinerja yang terintegrasi, mulai dari perencanaan target, pengukuran, evaluasi, hingga tindak lanjut pengembangan. Program ini menekankan pentingnya keterkaitan antara kinerja individu, unit kerja, dan strategi organisasi.

Dengan sistem yang tepat, organisasi dapat membangun budaya kerja berbasis pencapaian, akuntabilitas, dan perbaikan berkelanjutan.`
      },
      {
        name: "Remuneration Management",
        desc: `Program Remuneration Management membantu organisasi mengelola kebijakan kompensasi dan benefit secara lebih strategis. Peserta akan memahami bagaimana remunerasi dapat digunakan untuk menarik, memotivasi, dan mempertahankan SDM unggul.

Program ini cocok bagi organisasi yang ingin memperkuat daya saing paket kompensasi sekaligus menjaga efisiensi biaya tenaga kerja.`
      },
      {
        name: "Workload Analysis",
        desc: `Program Workload Analysis membantu organisasi menghitung dan mengevaluasi beban kerja secara lebih objektif. Peserta akan memahami cara menganalisis kebutuhan tenaga kerja, efektivitas jabatan, distribusi pekerjaan, serta potensi kelebihan atau kekurangan SDM.

Program ini sangat penting untuk mendukung perencanaan SDM, efisiensi organisasi, dan peningkatan produktivitas kerja.`
      },
      {
        name: "Managing The Organization's Talent",
        desc: `Program Managing The Organization's Talent membantu pemimpin dan tim HR dalam mengelola talenta organisasi secara lebih sistematis. Program ini membahas strategi pengembangan talenta, pemetaan potensi, pengelolaan kinerja, serta penyiapan kader pemimpin masa depan.

Melalui program ini, organisasi dapat membangun pipeline talenta yang kuat dan memastikan keberlanjutan kepemimpinan.`
      },
      {
        name: "HR Business Partner",
        desc: `Program HR Business Partner dirancang untuk membantu profesional HR bertransformasi dari fungsi administratif menjadi mitra strategis bisnis. Peserta akan memahami cara membaca kebutuhan bisnis, memberikan solusi SDM yang relevan, serta mendukung pencapaian target organisasi.

Program ini cocok bagi tim HR yang ingin meningkatkan peran strategisnya dalam pengambilan keputusan organisasi.`
      },
      {
        name: "Design Competency Model",
        desc: `Program Design Competency Model membantu organisasi merancang model kompetensi yang sesuai dengan kebutuhan jabatan, budaya, dan strategi organisasi. Peserta akan memahami cara menyusun kompetensi inti, kompetensi manajerial, dan kompetensi teknis secara sistematis.

Model kompetensi yang baik dapat menjadi dasar penting untuk rekrutmen, asesmen, pelatihan, promosi, dan manajemen kinerja.`
      },
      {
        name: "Managing Emotional Well-Being at Work",
        desc: `Program Managing Emotional Well-Being at Work dirancang untuk membantu organisasi menciptakan lingkungan kerja yang lebih sehat secara emosional. Peserta akan memahami faktor-faktor yang mempengaruhi kesejahteraan psikologis, stres kerja, keterlibatan karyawan, dan produktivitas.

Program ini relevan bagi organisasi yang ingin meningkatkan kualitas kehidupan kerja, menurunkan risiko burnout, dan membangun budaya kerja yang lebih suportif.`
      },
      {
        name: "The Art of Performance Monitoring & Coaching",
        desc: `Program The Art of Performance Monitoring & Coaching membantu pemimpin meningkatkan kemampuan dalam memantau kinerja dan memberikan coaching yang efektif kepada anggota tim. Peserta akan mempelajari teknik komunikasi, pemberian feedback, penyusunan rencana perbaikan, dan pendampingan kinerja.

Program ini sangat bermanfaat untuk membangun tim yang lebih mandiri, terarah, dan konsisten dalam mencapai target kerja.`
      },
      {
        name: "Digital Leadership",
        desc: `Program Digital Leadership dirancang untuk membekali pemimpin dengan kemampuan memimpin organisasi di era transformasi digital. Peserta akan memahami bagaimana teknologi, data, inovasi, dan perubahan perilaku kerja mempengaruhi gaya kepemimpinan modern.

Program ini cocok bagi pemimpin yang ingin memperkuat kesiapan organisasi dalam menghadapi digitalisasi, perubahan pasar, dan tuntutan kerja yang semakin dinamis.`
      },
      {
        name: "Continuous Improvement (Kaizen)",
        desc: `Program Continuous Improvement atau Kaizen membantu organisasi membangun budaya perbaikan berkelanjutan melalui langkah-langkah kecil yang konsisten dan berdampak. Peserta akan memahami cara mengidentifikasi pemborosan, memperbaiki proses kerja, meningkatkan efisiensi, serta melibatkan karyawan dalam inovasi operasional.

Program ini sangat relevan bagi organisasi yang ingin meningkatkan produktivitas, kualitas layanan, dan daya saing melalui budaya kerja yang lebih adaptif dan solutif.`
      },
    ],
  },
  {
    id: "07", icon: Cpu,
    title: "Digital and Technology in Finance", short: "DTF",
    accent: "#06B6D4", bg: "#071A1E",
    tagline: "Manfaatkan teknologi digital untuk transformasi fungsi keuangan Anda.",
    desc: "Program ini mempersiapkan profesional keuangan untuk menghadapi era digital — mulai dari FinTech, AI dalam akuntansi, analisis data keuangan, hingga keamanan siber dalam sistem keuangan.",
    subs: [
      {
        name: "AI for Digital Products",
        desc: `Program AI for Digital Products membantu organisasi memahami bagaimana AI dapat digunakan untuk merancang, mengembangkan, dan meningkatkan produk digital. Peserta akan belajar melihat AI bukan hanya sebagai fitur tambahan, tetapi sebagai bagian dari strategi penciptaan nilai bagi pengguna.

Melalui program ini, peserta akan memahami cara mengidentifikasi kebutuhan pengguna, merancang use case AI, meningkatkan pengalaman pelanggan, serta mengembangkan produk digital yang lebih personal, responsif, dan kompetitif. Program ini sangat relevan bagi perusahaan, startup, institusi, maupun unit bisnis yang ingin mempercepat inovasi produk berbasis teknologi.`
      },
      {
        name: "AI in Finance",
        desc: `Program AI in Finance dirancang untuk membantu profesional keuangan memanfaatkan AI dalam analisis, pelaporan, perencanaan, dan pengambilan keputusan finansial. Peserta akan memahami bagaimana AI dapat membantu membaca data keuangan, mengidentifikasi tren, menyusun insight, serta mendukung proses kerja finance yang lebih cepat dan akurat.

Program ini sangat cocok bagi tim finance, accounting, budgeting, business analyst, maupun manajemen yang ingin meningkatkan kualitas analisis keuangan. Dengan pemanfaatan AI yang tepat, organisasi dapat mempercepat proses kerja, meningkatkan ketajaman keputusan, dan mengurangi pekerjaan manual yang berulang.`
      },
      {
        name: "AI in HRD",
        desc: `Program AI in HRD membantu organisasi memahami penerapan AI dalam pengelolaan sumber daya manusia, mulai dari rekrutmen, pemetaan kompetensi, pengembangan karyawan, manajemen kinerja, hingga employee engagement. Program ini dirancang agar fungsi HR tidak hanya administratif, tetapi semakin strategis dan berbasis data.

Melalui program ini, peserta akan belajar bagaimana AI dapat digunakan untuk membaca kebutuhan talenta, menyusun program pengembangan, menganalisis kinerja, serta mendukung pengambilan keputusan SDM yang lebih objektif. Program ini relevan bagi organisasi yang ingin membangun sistem HR yang lebih modern, efisien, dan adaptif terhadap perubahan dunia kerja.`
      },
      {
        name: "AI in ESG",
        desc: `Program AI in ESG dirancang untuk membantu organisasi memanfaatkan AI dalam pengelolaan aspek Environmental, Social, and Governance. Peserta akan memahami bagaimana AI dapat mendukung pengumpulan data ESG, analisis risiko keberlanjutan, pemantauan indikator, penyusunan laporan, serta pengambilan keputusan berbasis sustainability.

Program ini sangat relevan bagi organisasi yang ingin memperkuat tata kelola keberlanjutan, meningkatkan kualitas pelaporan ESG, dan mengelola risiko lingkungan maupun sosial secara lebih terukur. Dengan dukungan AI, proses ESG dapat dilakukan secara lebih efisien, berbasis data, dan selaras dengan tuntutan pemangku kepentingan.`
      },
      {
        name: "ChatGPT untuk Finance",
        desc: `Program Chat GPT untuk Finance dirancang untuk membantu peserta menggunakan Chat GPT secara praktis dalam pekerjaan keuangan sehari-hari. Peserta akan mempelajari cara menyusun prompt yang tepat untuk membaca laporan keuangan, merangkum dokumen, membantu analisis rasio, menyusun insight manajerial, mendukung budgeting, hingga membuat draft laporan keuangan yang lebih rapi dan komunikatif.

Program ini cocok bagi profesional finance, accounting, audit, analis bisnis, manajer, maupun staf administrasi keuangan yang ingin bekerja lebih efisien tanpa kehilangan ketelitian. Dalam konteks penggunaan profesional, ChatGPT dapat membantu proses analisis laporan keuangan, KPI, arus kas, financial modeling, riset, sintesis dokumen, dan dukungan workflow Excel, BI, maupun ERP.`
      },
    ],
  },
  {
    id: "08", icon: FlaskConical,
    title: "Penelitian", short: "RES",
    accent: "#F97316", bg: "#1A0D00",
    tagline: "Perkuat kapasitas riset untuk menghasilkan temuan yang berdampak.",
    desc: "Program penelitian GRCC dirancang untuk meningkatkan kompetensi metodologi riset, analisis data, dan penulisan ilmiah bagi akademisi, praktisi, dan mahasiswa pascasarjana.",
    subs: [
      {
        name: "Pelatihan Riset Kuantitatif dengan Data Sekunder menggunakan SPSS",
        desc: `Program ini membantu peserta memahami proses penelitian kuantitatif berbasis data sekunder dengan menggunakan SPSS sebagai alat analisis. Peserta akan dibimbing mulai dari penyusunan kerangka penelitian, pengolahan data, uji asumsi, analisis statistik, hingga interpretasi hasil secara akademik.

Pelatihan ini sangat cocok bagi mahasiswa, dosen, maupun peneliti yang ingin mengolah data sekunder seperti laporan keuangan, data statistik pemerintah, indeks ekonomi, data perusahaan, atau dataset publik lainnya. Dengan pendekatan yang aplikatif, peserta dapat menghasilkan analisis yang lebih rapi, terukur, dan siap digunakan dalam karya ilmiah.`
      },
      {
        name: "Pelatihan Riset Kuantitatif dengan Data Sekunder menggunakan Stata",
        desc: `Program ini dirancang untuk peserta yang ingin menguasai analisis data sekunder menggunakan Stata, khususnya untuk kebutuhan penelitian kuantitatif yang lebih kompleks. Peserta akan mempelajari cara mengelola dataset, melakukan analisis deskriptif, regresi, data panel, serta interpretasi output penelitian secara sistematis.

Pelatihan ini relevan bagi peneliti yang menggunakan data ekonomi, keuangan, kebijakan publik, perusahaan, maupun sosial. Dengan Stata, peserta dapat mengolah data dalam jumlah besar secara lebih efisien dan menghasilkan analisis yang kuat untuk kebutuhan tesis, disertasi, publikasi ilmiah, maupun laporan riset profesional.`
      },
      {
        name: "Pelatihan Riset Kuantitatif dengan Smart PLS",
        desc: `Program ini membantu peserta memahami penelitian kuantitatif berbasis Structural Equation Modeling atau SEM dengan pendekatan Partial Least Squares menggunakan SmartPLS. Peserta akan dibimbing mulai dari penyusunan model penelitian, pengujian validitas dan reliabilitas, analisis inner model dan outer model, hingga interpretasi hasil hipotesis.

Program ini sangat cocok bagi mahasiswa, dosen, dan peneliti yang menggunakan variabel laten seperti kepemimpinan, kinerja, kepuasan, strategi, inovasi, sustainability, maupun human capital. Melalui pelatihan ini, peserta dapat menyusun analisis SmartPLS secara lebih tepat, akademik, dan sesuai standar publikasi ilmiah.`
      },
      {
        name: "Pelatihan Riset Kualitatif dengan NVivo",
        desc: `Program ini dirancang untuk membantu peserta mengelola dan menganalisis data kualitatif secara lebih sistematis menggunakan NVivo. Peserta akan mempelajari cara mengorganisasi data wawancara, observasi, dokumen, artikel, maupun transkrip, kemudian melakukan coding, kategorisasi tema, visualisasi temuan, dan penarikan kesimpulan.

Pelatihan ini cocok bagi peneliti yang menggunakan pendekatan studi kasus, fenomenologi, etnografi, grounded theory, maupun penelitian kualitatif lainnya. Dengan dukungan NVivo, proses analisis kualitatif menjadi lebih tertata, transparan, dan mudah dipertanggungjawabkan secara akademik.`
      },
      {
        name: "Pelatihan Publikasi Artikel Scopus Q1 dan Top Tier",
        desc: `Program ini membantu peserta memahami strategi menulis dan mempersiapkan artikel ilmiah agar lebih siap diajukan ke jurnal bereputasi, termasuk Scopus Q1 dan jurnal top tier. Peserta akan dibimbing dalam menyusun struktur artikel, memperkuat novelty, membangun argumentasi teoritis, memilih jurnal target, memahami gaya penulisan akademik internasional, serta menyiapkan respons terhadap reviewer.

Program ini sangat relevan bagi dosen, mahasiswa doktoral, peneliti, dan profesional akademik yang ingin meningkatkan kualitas publikasi. Melalui pelatihan ini, peserta tidak hanya belajar menulis artikel, tetapi juga memahami logika publikasi bereputasi, mulai dari pemilihan topik, penguatan kontribusi, penyusunan metodologi, hingga strategi meningkatkan peluang diterima di jurnal tujuan.`
      },
    ],
  },
];
