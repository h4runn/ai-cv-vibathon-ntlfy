# AGENTS.md — CVCraft AI Architecture Guide

## Project Overview

CVCraft AI adalah SPA (Single Page Application) React + Vite yang menggunakan Supabase sebagai backend-as-a-service dan Netlify Functions sebagai layer AI.

## Directory Structure

```
/
├── src/
│   ├── App.tsx                  # Router utama (BrowserRouter + Routes)
│   ├── main.tsx                 # Entry point React
│   ├── index.css                # Tailwind + custom utilities + print CSS
│   ├── pages/
│   │   ├── LandingPage.tsx      # Halaman publik beranda
│   │   ├── SignIn.tsx           # Google OAuth sign-in (tanpa form)
│   │   ├── AuthCallback.tsx     # Handler redirect OAuth → /dashboard
│   │   ├── Dashboard.tsx        # List CV user + tombol buat baru
│   │   ├── CreateCV.tsx         # Multi-step form (5 step) + auto-save localStorage
│   │   ├── Result.tsx           # Preview CV + template selector + portfolio
│   │   └── Portfolio.tsx        # Halaman publik /portfolio/:slug
│   ├── components/
│   │   ├── ProtectedRoute.tsx   # Guard: cek Supabase session → redirect /sign-in
│   │   └── CVPreview.tsx        # CV render (inline styles untuk print-safe)
│   ├── lib/
│   │   └── supabase.ts          # Supabase client (env vars)
│   └── types/
│       └── cv.ts                # TypeScript interfaces + defaultFormData
├── netlify/
│   └── functions/
│       └── generate-cv.mts     # POST /api/generate-cv → Anthropic AI Gateway
├── public/
│   └── favicon.svg
├── .env.example                 # Template env vars (isi sebelum run)
├── netlify.toml                 # Build config + SPA fallback redirect
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

## Key Architecture Decisions

### Auth
- **Hanya Google OAuth** via Supabase — tidak ada email/password
- `ProtectedRoute` membungkus semua halaman private, cek `supabase.auth.getSession()`
- `redirectTo` selalu pakai `window.location.origin` (tidak hardcode domain)
- `AuthCallback.tsx` di `/auth/callback` menunggu session valid lalu redirect

### AI Generation
- AI dipanggil via **Netlify Function** (`netlify/functions/generate-cv.mts`)
- Function menggunakan `@anthropic-ai/sdk` dengan `new Anthropic()` tanpa arg — Netlify AI Gateway inject `ANTHROPIC_API_KEY` dan `ANTHROPIC_BASE_URL` otomatis
- Model: `claude-sonnet-4-6` (dari supported models list)
- Frontend POST ke `/api/generate-cv` (mapped via `config.path`)
- User tidak pernah input API key

### Data Flow
```
CreateCV form → POST /api/generate-cv → Netlify Function → Anthropic
    → ai_result JSON → save to Supabase (cvs table) → sessionStorage → Result page
```

### Auto-save
- Setiap perubahan form di `CreateCV.tsx` → `localStorage.setItem('cv_form_draft', ...)`
- Load draft saat mount
- Hapus draft setelah generate berhasil

### CV Preview & Print
- `CVPreview.tsx` menggunakan **inline styles** (bukan Tailwind classes) agar print-safe
- Element `#cv-content` dengan `width: 210mm`, `min-height: 297mm`
- Print CSS di `index.css` menyembunyikan `.no-print`

### Portfolio
- Halaman publik `/portfolio/:slug` — tidak perlu login
- Slug generate dari nama (lowercase, strip non-alphanumeric, spasi → dash)
- Jika slug collision → append `-2`, `-3`, dst.
- RLS policy: `select` boleh siapa saja, `insert/update` hanya owner

### Supabase Database
- `cvs` table: `user_id`, `form_data` (jsonb), `ai_result` (jsonb)
- `portfolios` table: `user_id`, `slug` (unique), `cv_data` (jsonb)
- RLS enabled pada kedua tabel

## Environment Variables
```
VITE_SUPABASE_URL         → Supabase project URL (VITE_ prefix = client-side)
VITE_SUPABASE_ANON_KEY    → Supabase anon/public key
# AI Gateway vars diinject otomatis oleh Netlify — tidak perlu set manual
```

## Coding Conventions
- Komponen: functional components dengan TypeScript
- State management: React local state (useState/useEffect) — tidak ada Redux/Zustand
- Styling: Tailwind CSS utility classes; inline styles hanya di CVPreview untuk print
- File naming: PascalCase untuk komponen, camelCase untuk utilities
- Tidak ada barrel index.ts — import langsung dari file

## Local Development Notes
- `npm run dev` hanya jalan frontend — AI function tidak bisa dipanggil
- Gunakan `npx netlify dev` untuk full stack lokal (Function + Vite)
- Netlify AI Gateway vars hanya ada di Netlify environment (tidak lokal) — butuh deploy minimal 1x production sebelum AI Gateway aktif
