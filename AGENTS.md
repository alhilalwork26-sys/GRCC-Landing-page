# GRCC Website — Project Aktif

Ini adalah project website GRCC yang sedang aktif dikerjakan.

## Dev Server
Jalankan dev server dengan:
```bash
npm run dev
# Server berjalan di http://localhost:3000
```

**PENTING:** Pastikan tidak ada process `next dev` lain yang berjalan dari project lama di `/Users/macbook/Documents/Website GRCC`. Jika port 3000 sudah dipakai oleh project lama, matikan dulu:
```bash
pkill -f "next dev"
```
Lalu jalankan ulang dari direktori ini.

## Tech Stack
- Next.js 14 (App Router)
- Tailwind CSS + Framer Motion
- Supabase (URL & key ada di `.env.local`)

## Environment
File `.env.local` sudah ada dan berisi:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Jangan jalankan server tanpa `.env.local` — data training tidak akan muncul.
