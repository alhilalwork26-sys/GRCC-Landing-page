-- ============================================================
-- GRCC Website — Supabase Schema
-- Jalankan di: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. PROMO MODAL
create table if not exists promo (
  id            uuid primary key default gen_random_uuid(),
  active        boolean default true,
  badge         text default 'Coming Soon',
  badge_color   text default '#EF4444',
  tag           text default 'GRCC × AILG · Universitas Airlangga',
  title         text not null,
  subtitle      text,
  accent_color  text default '#4F46E5',
  description   text,
  status        text default 'coming_soon', -- coming_soon | open | closed
  highlights    jsonb default '[]',
  facilitators  jsonb default '[]',
  cta_label     text default 'Daftar & Info Lengkap',
  cta_href      text default 'mailto:info@grcc.org',
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- 2. INSIGHTS (Kegiatan, Publikasi, Berita)
create table if not exists insights (
  id          uuid primary key default gen_random_uuid(),
  type        text not null check (type in ('Kegiatan','Publikasi','Berita')),
  tag         text not null,
  title       text not null,
  excerpt     text,
  date        text,
  location    text,
  img         text,
  color       text default '#4F46E5',
  featured    boolean default false,
  published   boolean default true,
  created_at  timestamptz default now()
);

-- 3. UPCOMING TRAINING
create table if not exists training (
  id                uuid primary key default gen_random_uuid(),
  title             text not null,
  category          text,
  date_start        text,
  date_end          text,
  time              text,
  format            text default 'Online',
  location          text,
  price             integer,
  price_label       text,
  max_participants  integer,
  color             text default '#4F46E5',
  description       text,
  published         boolean default true,
  created_at        timestamptz default now()
);

-- 4. TEAM MEMBERS
create table if not exists team_members (
  id           uuid primary key default gen_random_uuid(),
  num          text,
  name         text not null,
  role         text,
  photo        text,
  bio          text,
  order_index  integer default 0,
  active       boolean default true
);

-- ── RLS: allow public read, authenticated write ──────────────────────────────
alter table promo        enable row level security;
alter table insights     enable row level security;
alter table training     enable row level security;
alter table team_members enable row level security;

-- Public can read published content
create policy "Public read promo"        on promo        for select using (true);
create policy "Public read insights"     on insights     for select using (published = true);
create policy "Public read training"     on training     for select using (published = true);
create policy "Public read team"         on team_members for select using (active = true);

-- Authenticated users (admin) can do everything
create policy "Admin all promo"        on promo        for all using (auth.role() = 'authenticated');
create policy "Admin all insights"     on insights     for all using (auth.role() = 'authenticated');
create policy "Admin all training"     on training     for all using (auth.role() = 'authenticated');
create policy "Admin all team"         on team_members for all using (auth.role() = 'authenticated');

-- ── Seed: promo data awal ────────────────────────────────────────────────────
insert into promo (title, subtitle, description, status, highlights, facilitators, cta_href) values (
  'Internal Control over Financial Reporting',
  'For Non-Akuntan',
  'ICoFR menjadi krusial bagi manajemen non-akuntan karena mereka berperan sebagai pemilik proses dan risiko. Keputusan dan aktivitas operasional mereka secara langsung memengaruhi keakuratan data keuangan dan kepatuhan organisasi.',
  'coming_soon',
  '[{"icon":"Users","text":"Untuk Manajemen Non-Akuntan"},{"icon":"Award","text":"Sertifikat GRCC · AILG · UNAIR"},{"icon":"Sparkles","text":"Program Eksklusif · Segera Hadir"}]',
  '[{"name":"Dina Heriyati, S.E., M.ForAccy","role":"Fasilitator ICoFR","org":"GRCC, AILG Universitas Airlangga","img":null},{"name":"Prof. Dr. Bambang Tjahjadi, SE., MBA., Ak., CMA., CPM., CA., CSSL.","role":"Guru Besar & Coordinator Fasilitator ICoFR","org":"GRCC, AILG Universitas Airlangga","img":null,"main":true},{"name":"Tantri Sun Estuning Dasih, S.A., M.A.","role":"Fasilitator ICoFR","org":"GRCC, AILG Universitas Airlangga","img":null}]',
  'mailto:info@grcc.org'
);

-- Seed: beberapa insights awal
insert into insights (type, tag, title, excerpt, date, location, img, color, featured) values
('Kegiatan','Workshop','Workshop Nasional: Implementasi GCG di Era Transformasi Digital','Workshop intensif dua hari bagi 80+ eksekutif dari perusahaan publik dan BUMN.','14–15 Maret 2025','Surabaya','https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=90&fit=crop','#4F46E5',true),
('Kegiatan','Seminar','Seminar ESG: Menuju Bisnis Berkelanjutan Berbasis Standar GRI & ISSB','Pakar ESG dari OJK, BEI, dan praktisi sustainability multinasional.','28 Februari 2025','Jakarta','https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=900&q=85&fit=crop','#10B981',false),
('Berita','Kerjasama','GRCC dan BPKP Jalin MoU untuk Penguatan Audit Pemerintahan','Penandatanganan MoU untuk program pelatihan auditor dan riset bersama.','10 Maret 2025','Jakarta','https://images.unsplash.com/photo-1521791136064-7986c2920216?w=900&q=85&fit=crop','#EF4444',false);
