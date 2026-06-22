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
  cta_href      text default 'mailto:grcc.ailg@gmail.com',
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

alter table training add column if not exists poster_url text;
alter table training add column if not exists brochure_url text;
alter table training add column if not exists custom_fields jsonb default '[]';
alter table training add column if not exists program_id text;

-- 4. TRAINING REGISTRATIONS
create table if not exists registrations (
  id                    uuid primary key default gen_random_uuid(),
  training_id           uuid references training(id) on delete set null,
  nama_lengkap          text not null,
  instansi              text not null,
  jabatan               text not null,
  email                 text not null,
  telepon               text not null,
  npwp                  text,
  bukti_pembayaran_url  text,
  custom_data           jsonb default '{}',
  status                text default 'pending' check (status in ('pending','confirmed','rejected')),
  notes                 text,
  created_at            timestamptz default now()
);

alter table registrations add column if not exists promo_code text;
alter table registrations add column if not exists original_price integer;
alter table registrations add column if not exists discount_amount integer;
alter table registrations add column if not exists final_price integer;
alter table registrations add column if not exists selected_session text;
alter table registrations add column if not exists participant_count integer default 1;
alter table registrations add column if not exists is_group boolean default false;
alter table registrations add column if not exists participants jsonb default '[]';

-- 5. PROMO CODES / VOUCHER
create table if not exists promo_codes (
  id              uuid primary key default gen_random_uuid(),
  code            text not null unique,
  description     text,
  discount_type   text not null check (discount_type in ('percentage','fixed')),
  discount_value  integer not null default 0,
  min_price       integer not null default 0,
  max_uses        integer,
  used_count      integer not null default 0,
  expires_at      timestamptz,
  active          boolean not null default true,
  created_at      timestamptz default now()
);

-- 6. TEAM MEMBERS
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
alter table registrations enable row level security;
alter table promo_codes  enable row level security;
alter table team_members enable row level security;

drop policy if exists "Public read promo" on promo;
drop policy if exists "Public read insights" on insights;
drop policy if exists "Public read training" on training;
drop policy if exists "Public read team" on team_members;
drop policy if exists "Public insert registrations" on registrations;
drop policy if exists "Public read active promo codes" on promo_codes;
drop policy if exists "Admin all promo" on promo;
drop policy if exists "Admin all promo codes" on promo_codes;
drop policy if exists "Admin all insights" on insights;
drop policy if exists "Admin all training" on training;
drop policy if exists "Admin all registrations" on registrations;
drop policy if exists "Admin all team" on team_members;

-- Public can read published content
create policy "Public read promo"        on promo        for select using (true);
create policy "Public read insights"     on insights     for select using (published = true);
create policy "Public read training"     on training     for select using (published = true);
create policy "Public read team"         on team_members for select using (active = true);
create policy "Public insert registrations" on registrations for insert with check (true);
create policy "Public read active promo codes" on promo_codes for select using (active = true);

-- Authenticated users (admin) can do everything
create policy "Admin all promo"        on promo        for all using (auth.role() = 'authenticated');
create policy "Admin all promo codes"  on promo_codes  for all using (auth.role() = 'authenticated');
create policy "Admin all insights"     on insights     for all using (auth.role() = 'authenticated');
create policy "Admin all training"     on training     for all using (auth.role() = 'authenticated');
create policy "Admin all registrations" on registrations for all using (auth.role() = 'authenticated');
create policy "Admin all team"         on team_members for all using (auth.role() = 'authenticated');

-- Storage bucket for payment proofs.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'payment-proofs',
  'payment-proofs',
  false,
  5242880,
  array['image/jpeg','image/png','image/webp','application/pdf']
)
on conflict (id) do update set
  public = false,
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg','image/png','image/webp','application/pdf'];

drop policy if exists "Public upload payment proofs" on storage.objects;
drop policy if exists "Admin read payment proofs" on storage.objects;

create policy "Public upload payment proofs"
on storage.objects for insert
with check (
  bucket_id = 'payment-proofs'
  and array_length(storage.foldername(name), 1) >= 2
);

create policy "Admin read payment proofs"
on storage.objects for select
using (bucket_id = 'payment-proofs' and auth.role() = 'authenticated');

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'training-posters',
  'training-posters',
  true,
  5242880,
  array['image/jpeg','image/png','image/webp']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg','image/png','image/webp'];

drop policy if exists "Admin upload training posters" on storage.objects;
drop policy if exists "Admin update training posters" on storage.objects;
drop policy if exists "Admin delete training posters" on storage.objects;
drop policy if exists "Public read training posters" on storage.objects;

create policy "Public read training posters"
on storage.objects for select
using (bucket_id = 'training-posters');

create policy "Admin upload training posters"
on storage.objects for insert
with check (bucket_id = 'training-posters' and auth.role() = 'authenticated');

create policy "Admin update training posters"
on storage.objects for update
using (bucket_id = 'training-posters' and auth.role() = 'authenticated');

create policy "Admin delete training posters"
on storage.objects for delete
using (bucket_id = 'training-posters' and auth.role() = 'authenticated');

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'insight-images',
  'insight-images',
  true,
  15728640,
  array['image/jpeg','image/png','image/webp']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 15728640,
  allowed_mime_types = array['image/jpeg','image/png','image/webp'];

drop policy if exists "Public read insight images" on storage.objects;
drop policy if exists "Admin upload insight images" on storage.objects;
drop policy if exists "Admin update insight images" on storage.objects;
drop policy if exists "Admin delete insight images" on storage.objects;

create policy "Public read insight images"
on storage.objects for select
using (bucket_id = 'insight-images');

create policy "Admin upload insight images"
on storage.objects for insert
with check (bucket_id = 'insight-images' and auth.role() = 'authenticated');

create policy "Admin update insight images"
on storage.objects for update
using (bucket_id = 'insight-images' and auth.role() = 'authenticated');

create policy "Admin delete insight images"
on storage.objects for delete
using (bucket_id = 'insight-images' and auth.role() = 'authenticated');

-- ── Seed: promo data awal ────────────────────────────────────────────────────
insert into promo (title, subtitle, description, status, highlights, facilitators, cta_href) values (
  'Internal Control over Financial Reporting',
  'For Non-Akuntan',
  'ICoFR menjadi krusial bagi manajemen non-akuntan karena mereka berperan sebagai pemilik proses dan risiko. Keputusan dan aktivitas operasional mereka secara langsung memengaruhi keakuratan data keuangan dan kepatuhan organisasi.',
  'coming_soon',
  '[{"icon":"Users","text":"Untuk Manajemen Non-Akuntan"},{"icon":"Award","text":"Sertifikat GRCC · AILG · UNAIR"},{"icon":"Sparkles","text":"Program Eksklusif · Segera Hadir"}]',
  '[{"name":"Dina Heriyati, S.E., M.ForAccy","role":"Fasilitator ICoFR","org":"GRCC, AILG Universitas Airlangga","img":null},{"name":"Prof. Dr. Bambang Tjahjadi, SE., MBA., Ak., CMA., CPM., CA., CSSL.","role":"Guru Besar & Coordinator Fasilitator ICoFR","org":"GRCC, AILG Universitas Airlangga","img":null,"main":true},{"name":"Tantri Sun Estuning Dasih, S.A., M.A.","role":"Fasilitator ICoFR","org":"GRCC, AILG Universitas Airlangga","img":null}]',
  '/training/3b2f7f0a-665c-46fc-b8ae-3359abaa47ec'
);

-- Seed: beberapa insights awal
insert into insights (type, tag, title, excerpt, date, location, img, color, featured) values
('Kegiatan','Workshop','Workshop Nasional: Implementasi GCG di Era Transformasi Digital','Workshop intensif dua hari bagi 80+ eksekutif dari perusahaan publik dan BUMN.','14–15 Maret 2025','Surabaya','https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=90&fit=crop','#4F46E5',true),
('Kegiatan','Seminar','Seminar ESG: Menuju Bisnis Berkelanjutan Berbasis Standar GRI & ISSB','Pakar ESG dari OJK, BEI, dan praktisi sustainability multinasional.','28 Februari 2025','Surabaya','https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=900&q=85&fit=crop','#10B981',false),
('Berita','Kerjasama','GRCC dan BPKP Jalin MoU untuk Penguatan Audit Pemerintahan','Penandatanganan MoU untuk program pelatihan auditor dan riset bersama.','10 Maret 2025','Surabaya','https://images.unsplash.com/photo-1521791136064-7986c2920216?w=900&q=85&fit=crop','#EF4444',false);
