# 🚀 CVCraft AI — AI-Powered Resume Builder

**Aplikasi web untuk membuat CV profesional dengan bantuan AI**, dibangun untuk **Lomba Vibathon HSI BS 2026**.

Buat CV ATS-friendly dalam hitungan menit tanpa perlu input API key. Powered by OpenRouter AI Gateway.

---

## ✨ Fitur Utama

### 🤖 **AI Generate CV**
- Generate CV profesional dengan satu klik tombol
- Menggunakan model AI terbaik via OpenRouter (DeepSeek)
- AI menulis summary, memperkuat poin pengalaman dengan action verbs
- Output bahasa Indonesia profesional dan ATS-friendly

### 💾 **Auto-save Draft**
- Form tersimpan otomatis ke localStorage
- Resume kapan saja tanpa kehilangan progress
- Edit CV yang sudah dibuat

### 🎨 **3 Template CV Premium**
- **Biru Profesional** — Terpercaya dan formal
- **Hijau Modern** — Fresh dan kreatif
- **Minimal Elegan** — Bersih dan sophisticated
- Download langsung ke PDF format A4

### 📊 **ATS Score Checker**
- Real-time scoring saat mengisi form
- Tips untuk meningkatkan skor ATS
- Optimasi keyword dan struktur CV

### 🌐 **Portfolio Online (Demo)**
- Generate halaman portfolio dengan URL unik
- Bento grid layout modern & responsive
- Copy contact info dengan satu klik
- *Note: Saat ini disimpan di browser (localStorage). Fitur cloud sync akan hadir di versi premium.*

### 🌓 **Dark/Light Mode**
- Theme switcher dengan animasi smooth
- Preferensi tersimpan otomatis

---

## 🛠️ Tech Stack

| Layer              | Teknologi                                          |
|--------------------|----------------------------------------------------|
| **Frontend**       | React 18 + Vite + TypeScript + Tailwind CSS       |
| **Styling**        | Tailwind CSS + Custom CSS (print-safe)            |
| **AI Integration** | OpenRouter API (DeepSeek Chat)                     |
| **Serverless**     | Vercel Serverless Functions                        |
| **Hosting**        | Vercel                                             |
| **Storage**        | LocalStorage (browser)                             |
| **PDF Export**     | html2pdf.js                                        |

---

## 📦 Instalasi & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/h4runn/ai-cv-vibathon-ntlfy.git
cd ai-cv-vibathon-ntlfy
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Setup Environment Variables

Buat file `.env` di root project:

```env
# OpenRouter API Key (untuk AI generation)
OPENROUTER_API_KEY=sk-or-v1-your-api-key-here
```

**Cara mendapatkan API Key:**
1. Daftar di [OpenRouter.ai](https://openrouter.ai/)
2. Top up credits minimal $5
3. Copy API key dari dashboard
4. Paste ke `.env`

> **Note:** Untuk production di Vercel, tambahkan `OPENROUTER_API_KEY` di **Vercel Dashboard → Settings → Environment Variables**

### 4️⃣ Jalankan Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

### 5️⃣ Build untuk Production

```bash
npm run build
```

Output ada di folder `dist/`

---

## 🚀 Deployment ke Vercel

### Via GitHub (Recommended)

1. Push code ke GitHub repository
2. Import project di [Vercel Dashboard](https://vercel.com/new)
3. Tambahkan environment variable:
   - Key: `OPENROUTER_API_KEY`
   - Value: `sk-or-v1-your-api-key`
4. Deploy!

### Via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
```

---

## 📁 Struktur Project

```
ai-cv-vibathon/
├── api/
│   └── generate-cv.ts          # Vercel Serverless Function (AI endpoint)
├── src/
│   ├── pages/
│   │   ├── LandingPage.tsx     # Halaman utama
│   │   ├── Dashboard.tsx       # List CV user
│   │   ├── CreateCV.tsx        # Form multi-step + AI generate
│   │   ├── Result.tsx          # Preview CV + download PDF
│   │   └── Portfolio.tsx       # Public portfolio page
│   ├── components/
│   │   └── CVPreview.tsx       # CV template renderer (print-safe)
│   ├── types/
│   │   └── cv.ts               # TypeScript interfaces
│   ├── App.tsx                 # Router utama
│   ├── main.tsx                # Entry point
│   └── index.css               # Tailwind + print CSS
├── public/
│   └── favicon.svg
├── .env                        # Environment variables (git ignored)
├── .env.example                # Template env vars
├── index.html                  # HTML entry point
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── vercel.json                 # Vercel config
```

---

## 🎯 Cara Menggunakan

1. **Buka Landing Page** → Klik "Buat CV Sekarang"
2. **Isi Form 5 Step:**
   - Step 1: Data Pribadi (Nama, Email, Phone, Location, Job Title)
   - Step 2: Pendidikan (Institusi, Gelar, Tahun)
   - Step 3: Pengalaman Kerja (Company, Position, Period, Achievements)
   - Step 4: Keahlian (Technical Skills, Soft Skills, Languages)
   - Step 5: Generate AI (Klik tombol dan tunggu 5-10 detik)
3. **Preview & Download** → Pilih template (Biru/Hijau/Minimal) → Download PDF
4. **Buat Portfolio** → (Opsional) Generate portfolio page dengan URL unik

---

## 🧪 Fitur Demo / Prototype

Beberapa fitur saat ini masih dalam tahap **demo/simulasi**:

- **Premium Feature Toggle** — Tombol "Aktifkan Premium" di halaman Result hanya alert demo untuk menunjukkan alur monetisasi
- **Portfolio Cloud Sync** — Portfolio saat ini tersimpan di localStorage browser, belum persistent ke database cloud

Fitur-fitur ini akan dikembangkan lebih lanjut pada fase berikutnya.

---

## 🛣️ Roadmap Pengembangan

### 🔜 Coming Soon (Post-Vibathon)

- [ ] **Authentication & Cloud Sync**
  - Implementasi Supabase + Google OAuth
  - Persistent database untuk CV dan portfolio
  - Multi-device sync

- [ ] **Premium Features**
  - Custom domain untuk portfolio
  - Advanced AI customization (tone, length, style)
  - Analytics dashboard (portfolio views, CV downloads)
  - Priority support

- [ ] **Payment Integration**
  - Stripe/Midtrans untuk subscription
  - Tiered pricing (Free, Pro, Enterprise)

- [ ] **Advanced Features**
  - Export ke Word (.docx)
  - Multi-language support (English, Indonesia)
  - AI Cover Letter Generator
  - LinkedIn profile sync

- [ ] **Testing & Quality**
  - Unit tests dengan Vitest
  - E2E tests dengan Playwright
  - Accessibility audit (WCAG AA)

---

## 🤝 Contributing

Project ini dibuat untuk **Lomba Vibathon HSI BS 2026**. Kontribusi terbuka setelah periode lomba selesai.

---

## 📄 License

MIT License - Copyright (c) 2026 Harun

---

## 👨‍💻 Developer

**Harun** — Vibathon HSI BS 2026 Participant

- GitHub: [@h4runn](https://github.com/h4runn)
- Project Repository: [ai-cv-vibathon-ntlfy](https://github.com/h4runn/ai-cv-vibathon-ntlfy)

---

## 🙏 Credits

- **AI Provider**: [OpenRouter.ai](https://openrouter.ai/)
- **UI Components**: Custom with Tailwind CSS
- **Icons**: [Lucide React](https://lucide.dev/)
- **Fonts**: [Inter](https://fonts.google.com/specimen/Inter)
- **PDF Export**: [html2pdf.js](https://github.com/eKoopmans/html2pdf.js)

---

**Built with ❤️ for Vibathon HSI BS 2026**