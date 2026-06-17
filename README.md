# CVCraft AI — AI Resume Builder

Aplikasi web untuk membuat CV profesional dan portofolio online dengan bantuan AI (Claude), dibangun untuk **Lomba Vibathon HSI BS 2026**.

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | React 18 + Vite + TypeScript + Tailwind CSS |
| Auth | Supabase Auth (Google OAuth) |
| Database | Supabase (PostgreSQL + RLS) |
| AI | Claude via Netlify AI Gateway (Netlify Function) |
| Hosting | Netlify |

## Fitur Utama

1. **Google Sign-In** — tidak ada form email/password sama sekali
2. **AI Generate CV** — tombol satu klik, tanpa API key dari user
3. **Auto-save Draft** — form tersimpan otomatis ke localStorage
4. **3 Template CV** — Biru, Hijau, Minimal; siap PDF
5. **Portofolio Online** — halaman publik `/portfolio/:slug`
6. **Dashboard** — riwayat semua CV yang pernah dibuat

## Cara Jalankan Lokal

### 1. Clone & Install

```bash
npm install
```

### 2. Setup Environment

```bash
cp .env.example .env
# Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY
```

### 3. Jalankan Dev Server

```bash
# Dengan Netlify CLI (rekomendasi — AI function berjalan)
npx netlify dev

# Atau hanya frontend
npm run dev
```

> **Catatan:** AI generation (`/api/generate-cv`) hanya berjalan via Netlify CLI atau setelah deploy ke Netlify karena menggunakan Netlify AI Gateway.

## Setup Supabase

### SQL Schema

Jalankan SQL berikut di Supabase SQL Editor:

```sql
-- Tabel CV
create table cvs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  form_data jsonb not null,
  ai_result jsonb not null,
  created_at timestamp with time zone default now()
);

-- Tabel Portfolio
create table portfolios (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  slug text unique not null,
  cv_data jsonb not null,
  created_at timestamp with time zone default now()
);

-- RLS
alter table cvs enable row level security;
alter table portfolios enable row level security;

create policy "Users can manage own cvs" on cvs
  for all using (auth.uid() = user_id);

create policy "Public can read portfolios" on portfolios
  for select using (true);
create policy "Users can manage own portfolios" on portfolios
  for insert with check (auth.uid() = user_id);
create policy "Users can update own portfolios" on portfolios
  for update using (auth.uid() = user_id);
```

### Google OAuth

1. Buat project di [Google Cloud Console](https://console.cloud.google.com)
2. Enable Google+ API
3. Buat OAuth 2.0 Client ID (Web application)
4. Authorized redirect URI: `https://[project-id].supabase.co/auth/v1/callback`
5. Masukkan Client ID & Secret ke Supabase Dashboard → Authentication → Providers → Google

## Deploy ke Netlify

Set environment variables di Netlify Dashboard → Site configuration → Environment variables:

```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

Tambahkan URL Netlify ke Supabase Auth → URL Configuration → Site URL dan Redirect URLs.
