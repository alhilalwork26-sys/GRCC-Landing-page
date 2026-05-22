import { createClient } from "@supabase/supabase-js";

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, key);

// ── Types ────────────────────────────────────────────────────────────────────
export interface PromoItem {
  id: string;
  active: boolean;
  badge: string;
  badge_color: string;
  tag: string;
  title: string;
  subtitle: string;
  accent_color: string;
  description: string;
  status: string; // "coming_soon" | "open" | "closed"
  highlights: { icon: string; text: string }[];
  facilitators: { name: string; role: string; org: string; img: string | null; main?: boolean }[];
  cta_label: string;
  cta_href: string;
  created_at: string;
  updated_at: string;
}

export interface InsightItem {
  id: string;
  type: "Kegiatan" | "Publikasi" | "Berita";
  tag: string;
  title: string;
  excerpt: string;
  date: string;
  location: string;
  img: string;
  color: string;
  featured: boolean;
  published: boolean;
  created_at: string;
}

export interface TrainingItem {
  id: string;
  title: string;
  category: string;
  date_start: string;
  date_end: string | null;
  time: string;
  format: string;
  location: string;
  price: number | null;
  price_label: string;
  max_participants: number | null;
  color: string;
  description: string;
  published: boolean;
  poster_url: string | null;
  brochure_url: string | null;
  custom_fields: CustomField[] | null;
  created_at: string;
}

export interface CustomField {
  id: string;
  label: string;
  type: "text" | "textarea" | "select" | "number" | "date";
  required: boolean;
  placeholder?: string;
  options?: string[]; // for select type
}

export interface Registration {
  id: string;
  training_id: string | null;
  nama_lengkap: string;
  instansi: string;
  jabatan: string;
  email: string;
  telepon: string;
  npwp: string | null;
  bukti_pembayaran_url: string | null;
  custom_data: Record<string, string>;
  status: "pending" | "confirmed" | "rejected";
  notes: string | null;
  created_at: string;
}

export interface TeamMember {
  id: string;
  num: string;
  name: string;
  role: string;
  photo: string;
  bio: string;
  order_index: number;
  active: boolean;
}
