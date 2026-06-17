-- =============================================
-- CVCraft AI — Supabase SQL Schema
-- Jalankan ini di Supabase SQL Editor
-- =============================================

-- Tabel CV
create table if not exists cvs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  form_data jsonb not null,
  ai_result jsonb not null,
  created_at timestamp with time zone default now()
);

-- Tabel Portfolio
create table if not exists portfolios (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  slug text unique not null,
  cv_data jsonb not null,
  created_at timestamp with time zone default now()
);

-- RLS Policies
alter table cvs enable row level security;
alter table portfolios enable row level security;

-- User hanya bisa akses CV miliknya sendiri
create policy "Users can manage own cvs" on cvs
  for all using (auth.uid() = user_id);

-- Portfolio bisa dibaca siapa saja (publik)
create policy "Public can read portfolios" on portfolios
  for select using (true);

-- Hanya owner yang bisa insert/update portfolio
create policy "Users can manage own portfolios" on portfolios
  for insert with check (auth.uid() = user_id);
create policy "Users can update own portfolios" on portfolios
  for update using (auth.uid() = user_id);
