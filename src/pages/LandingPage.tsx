import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Moon, Sun } from "lucide-react";

const TABS = [
  { id: "ai", label: "AI yang Menulis" },
  { id: "ats", label: "Format ATS-Friendly" },
  { id: "template", label: "3 Template Profesional" },
  { id: "proses", label: "Proses 3 Menit" },
];

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("ai");
  const [sectionVisible, setSectionVisible] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("theme-mode");
    if (saved) setIsDark(saved === "dark");
  }, []);

  useEffect(() => {
    localStorage.setItem("theme-mode", isDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setSectionVisible(true);
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const scrollToPelajari = () => {
    document.getElementById("pelajari")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark
        ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900"
        : "bg-gradient-to-br from-slate-50 via-white to-slate-50"
    }`}>
      {/* Navbar */}
      <nav className={`sticky top-0 z-50 backdrop-blur-md transition-colors duration-300 ${
        isDark 
          ? "bg-slate-900/80 border-b border-slate-800/50" 
          : "bg-white/80 border-b border-slate-200/50"
      }`}>
        <div className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <svg
              className={`w-5 h-5 ${isDark ? "text-purple-400" : "text-purple-600"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className={`font-bold text-xl tracking-wide ${isDark ? "text-white" : "text-slate-900"}`}>
              CVCraft AI
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2.5 rounded-lg transition-all ${
                isDark
                  ? "bg-slate-800 hover:bg-slate-700 text-yellow-400"
                  : "bg-slate-200 hover:bg-slate-300 text-slate-700"
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link
              to="/dashboard"
              className={`flex items-center gap-1.5 px-4 py-2 font-medium text-sm transition-colors ${
                isDark
                  ? "text-slate-300 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              CV Saya
            </Link>
            <Link
              to="/create"
              className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all border ${
                isDark
                  ? "bg-purple-600 hover:bg-purple-700 text-white border-purple-500"
                  : "bg-purple-600 hover:bg-purple-700 text-white border-purple-500"
              }`}
            >
              Buat CV
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 pt-28 pb-24 text-center">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border mb-8 ${
          isDark
            ? "bg-purple-500/15 text-purple-300 border-purple-500/30"
            : "bg-purple-100 text-purple-700 border-purple-300/50"
        }`}>
          <svg
            className={`w-4 h-4 animate-pulse ${isDark ? "text-purple-300" : "text-purple-600"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            />
          </svg>
          <span>Harun Vibathon 2026 · Powered by Claude AI</span>
        </div>

        <h1 className={`text-5xl md:text-7xl font-extrabold mb-6 leading-tight ${isDark ? "text-white" : "text-slate-900"}`}>
          CV Profesional dalam{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            Hitungan Detik
          </span>
        </h1>

        <p className={`text-xl mb-10 max-w-2xl mx-auto leading-relaxed ${
          isDark ? "text-slate-300" : "text-slate-600"
        }`}>
          Buat CV yang ATS-friendly dan portofolio online impresif dengan bantuan AI. 
          Langsung pakai tanpa perlu daftar akun atau input API key.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/create"
            className={`px-8 py-4 font-bold rounded-2xl text-lg transition-all shadow-lg hover:-translate-y-1 ${
              isDark
                ? "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/30"
                : "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/30"
            }`}
          >
            Buat CV Sekarang!
          </Link>
          <button
            onClick={scrollToPelajari}
            className={`px-8 py-4 font-semibold rounded-2xl text-lg transition-all border ${
              isDark
                ? "bg-slate-800/50 hover:bg-slate-700/50 text-white border-slate-700"
                : "bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300"
            }`}
          >
            Pelajari Lebih Lanjut ↓
          </button>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 text-left">
          {[
            {
              id: "ai",
              title: "AI Menulis Untukmu",
              desc: "Claude AI menganalisis data kamu dan menghasilkan CV profesional yang kuat dan ATS-friendly secara otomatis.",
            },
            {
              id: "web",
              title: "Portofolio Online",
              desc: "Dapatkan halaman portofolio instan dengan URL unik berbasis nama Anda di perangkat ini. Fitur Cloud Sync untuk membagikan tautan secara publik ke rekruter akan tersedia pada versi Premium.",
            },
            {
              id: "doc",
              title: "Download PDF",
              desc: "Pilih dari 3 template warna cantik dan download CV siap cetak dalam format A4.",
            },
          ].map((f) => (
            <div
              key={f.id}
              className={`backdrop-blur rounded-2xl p-6 border transition-all ${
                isDark
                  ? "bg-slate-800/50 border-slate-700 hover:border-purple-500/50 hover:bg-slate-800/80"
                  : "bg-white/70 border-slate-200 hover:border-purple-300/50 hover:bg-white"
              }`}
            >
              <div className={`inline-block p-3 rounded-lg mb-4 ${isDark ? "bg-purple-500/20" : "bg-purple-100"}`}>
                {f.id === "ai" && (
                  <svg
                    className={`w-8 h-8 ${isDark ? "text-purple-400" : "text-purple-600"}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                )}
                {f.id === "web" && (
                  <svg
                    className={`w-8 h-8 ${isDark ? "text-purple-400" : "text-purple-600"}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9h18"
                    />
                  </svg>
                )}
                {f.id === "doc" && (
                  <svg
                    className={`w-8 h-8 ${isDark ? "text-purple-400" : "text-purple-600"}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                )}
              </div>
              <h3 className={`font-bold text-lg mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>{f.title}</h3>
              <p className={`text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Section #pelajari */}
      <section
        id="pelajari"
        ref={sectionRef}
        className={`border-t transition-all duration-700 py-20 px-6 ${
          isDark
            ? "bg-slate-900/40 border-slate-800/50"
            : "bg-slate-100/40 border-slate-200/50"
        } ${
          sectionVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-extrabold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>
              Bagaimana CV Craft AI Bekerja?
            </h2>
            <p className={`text-lg ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              Teknologi AI terdepan yang menulis CV terbaik untukmu
            </p>
          </div>

          {/* Tab buttons */}
          <div className="flex overflow-x-auto pb-4 -mx-6 px-6 gap-3 mb-8 snap-x snap-mandatory scrollbar-hide">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? isDark
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                      : "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                    : isDark
                      ? "bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700"
                      : "bg-slate-200 text-slate-600 hover:bg-slate-300 hover:text-slate-900 border border-slate-300"
                }`}
              >
                {tab.id === "ai" && (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                )}
                {tab.id === "ats" && (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                )}
                {tab.id === "template" && (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                )}
                {tab.id === "proses" && (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className={`border rounded-2xl p-8 overflow-hidden ${
            isDark
              ? "bg-slate-800/30 border-slate-700"
              : "bg-white/60 border-slate-200"
          }`}>
            {/* Tab 1: AI yang Menulis */}
            {activeTab === "ai" && (
              <div className="animate-fade-in">
                <h3 className={`text-2xl font-bold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>
                  Bukan Template Biasa
                </h3>
                <p className={`leading-relaxed mb-6 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                  CV Craft AI menggunakan Claude AI dari Anthropic — model
                  bahasa terpintar di dunia — untuk menulis setiap kalimat CV
                  kamu dari nol. Bukan mengisi template kosong, tapi benar-benar
                  menulis ulang pengalamanmu menjadi narasi yang kuat dan
                  meyakinkan.
                </p>
                <div className={`border rounded-xl p-5 space-y-2 ${
                  isDark
                    ? "bg-purple-500/10 border-purple-500/20"
                    : "bg-purple-100 border-purple-300/50"
                }`}>
                  <p className={`text-sm font-medium ${isDark ? "text-purple-200" : "text-purple-700"}`}>
                    ✓ Action verbs otomatis
                  </p>
                  <p className={`text-sm font-medium ${isDark ? "text-purple-200" : "text-purple-700"}`}>
                    ✓ ATS-friendly format
                  </p>
                  <p className={`text-sm font-medium ${isDark ? "text-purple-200" : "text-purple-700"}`}>
                    ✓ Bahasa profesional Indonesia
                  </p>
                </div>
              </div>
            )}

            {/* Tab 2: Format ATS-Friendly */}
            {activeTab === "ats" && (
              <div className="animate-fade-in">
                <h3 className={`text-2xl font-bold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>
                  Lolos Sistem Seleksi Otomatis
                </h3>
                <p className={`leading-relaxed mb-6 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                  90% perusahaan besar menggunakan ATS (Applicant Tracking
                  System) untuk menyaring CV kemudian dibaca HRD. CV Craft AI
                  memastikan CV kamu terstruktur dengan benar agar tidak
                  tersaring di tahap pertama.
                </p>
                <div className={`border rounded-xl p-5 space-y-2 ${
                  isDark
                    ? "bg-green-500/10 border-green-500/20"
                    : "bg-green-100 border-green-300/50"
                }`}>
                  <p className={`text-sm font-medium ${isDark ? "text-green-200" : "text-green-700"}`}>
                    ✓ Struktur yang terbaca ATS
                  </p>
                  <p className={`text-sm font-medium ${isDark ? "text-green-200" : "text-green-700"}`}>
                    ✓ Keyword yang relevan
                  </p>
                  <p className={`text-sm font-medium ${isDark ? "text-green-200" : "text-green-700"}`}>
                    ✓ Format bersih tanpa tabel kompleks
                  </p>
                </div>
              </div>
            )}

            {/* Tab 3: 3 Template Profesional */}
            {activeTab === "template" && (
              <div className="animate-fade-in">
                <h3 className={`text-2xl font-bold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>
                  Tampilan yang Memikat HRD
                </h3>
                <p className={`leading-relaxed mb-6 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                  Pilih dari 3 template yang dirancang khusus oleh desainer
                  profesional. Setiap template dioptimalkan untuk keterbacaan
                  dan kesan pertama yang kuat.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 min-w-0">
                  <div className={`border rounded-xl p-4 text-center ${
                    isDark
                      ? "bg-blue-500/10 border-blue-500/20"
                      : "bg-blue-100 border-blue-300/50"
                  }`}>
                    <div className={`w-10 h-10 rounded-full mx-auto mb-2 shadow-lg ${
                      isDark ? "bg-blue-500 shadow-blue-500/30" : "bg-blue-500 shadow-blue-500/30"
                    }`} />
                    <p className={`font-semibold text-sm ${isDark ? "text-blue-200" : "text-blue-700"}`}>Biru</p>
                    <p className={`text-xs mt-1 ${isDark ? "text-blue-300/60" : "text-blue-600/60"}`}>
                      Profesional & Terpercaya
                    </p>
                  </div>
                  <div className={`border rounded-xl p-4 text-center ${
                    isDark
                      ? "bg-green-500/10 border-green-500/20"
                      : "bg-green-100 border-green-300/50"
                  }`}>
                    <div className={`w-10 h-10 rounded-full mx-auto mb-2 shadow-lg ${
                      isDark ? "bg-green-500 shadow-green-500/30" : "bg-green-500 shadow-green-500/30"
                    }`} />
                    <p className={`font-semibold text-sm ${isDark ? "text-green-200" : "text-green-700"}`}>
                      Hijau
                    </p>
                    <p className={`text-xs mt-1 ${isDark ? "text-green-300/60" : "text-green-600/60"}`}>
                      Modern & Segar
                    </p>
                  </div>
                  <div className={`border rounded-xl p-4 text-center ${
                    isDark
                      ? "bg-gray-500/10 border-gray-500/20"
                      : "bg-gray-100 border-gray-300/50"
                  }`}>
                    <div className={`w-10 h-10 rounded-full mx-auto mb-2 shadow-lg ${
                      isDark ? "bg-gray-600 shadow-gray-500/30" : "bg-gray-600 shadow-gray-500/30"
                    }`} />
                    <p className={`font-semibold text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                      Minimal
                    </p>
                    <p className={`text-xs mt-1 ${isDark ? "text-gray-300/60" : "text-gray-600/60"}`}>
                      Elegan & Bersih
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Proses 3 Menit */}
            {activeTab === "proses" && (
              <div className="animate-fade-in">
                <h3 className={`text-2xl font-bold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>
                  Dari Data ke CV Siap Kirim
                </h3>
                <div className="space-y-4 mb-6">
                  {[
                    { menit: "~1", label: "Buka Aplikasi", desc: "Kunjungi CVCraft AI dan mulai dari nol" },
                    { menit: "~1", label: "Isi Data Kamu", desc: "Input pengalaman, skill, dan pendidikan" },
                    { menit: "~1", label: "Download CV", desc: "Pilih template dan download PDF" },
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full border flex items-center justify-center shrink-0 ${
                        isDark
                          ? "bg-purple-600/30 border-purple-500/40"
                          : "bg-purple-100 border-purple-300/50"
                      }`}>
                        <span className={`font-bold text-sm ${isDark ? "text-purple-300" : "text-purple-700"}`}>
                          {step.menit}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className={`font-semibold text-sm ${isDark ? "text-white" : "text-slate-900"}`}>
                          {step.label}
                        </p>
                        <p className={`text-sm truncate ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  to="/create"
                  className={`inline-flex items-center gap-2 px-6 py-3 font-bold rounded-xl transition-all shadow-lg ${
                    isDark
                      ? "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/30"
                      : "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/30"
                  }`}
                >
                  Coba Sekarang!
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Kenapa CV Craft AI? */}

      {/* Feature Comparison Cards */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h3 className={`text-2xl font-bold text-center mb-10 ${isDark ? "text-white" : "text-slate-900"}`}>
          Rencana Pengembangan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Gratis */}
          <div className={`p-8 rounded-3xl border ${isDark ? "bg-slate-800 border-slate-700 shadow-xl" : "bg-white border-slate-200"}`}>
            <h4 className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>Gratis (Beta)</h4>
            <p className={`text-sm mb-6 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Untuk langkah awal karier kamu</p>
            <ul className="space-y-4">
              {["Pembuatan CV AI", "Download PDF", "3 Template Utama"].map((f) => (
                <li key={f} className={`flex items-center gap-3 text-sm font-medium ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                  <span className="text-green-500 font-bold">✓</span> {f}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Card Pro */}
          <div className={`p-8 rounded-3xl border relative overflow-hidden ${isDark ? "bg-slate-800 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.15)]" : "bg-purple-50 border-purple-200"}`}>
            <div className="absolute top-4 right-4 bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
              Segera
            </div>
            <h4 className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>CVCraft Pro</h4>
            <p className={`text-sm mb-6 ${isDark ? "text-purple-300" : "text-purple-700"}`}>Untuk level profesional</p>
            <ul className="space-y-4">
              {["Cloud Sync Portofolio", "Kustomisasi Domain", "Dukungan Prioritas"].map((f) => (
                <li key={f} className={`flex items-center gap-3 text-sm font-medium ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                  <span className="text-purple-500 font-bold">✦</span> {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className={`max-w-6xl mx-auto px-6 py-20 ${isDark ? "" : "bg-slate-50/30"}`}>
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-extrabold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>
            Kenapa CV Craft AI?
          </h2>
          <p className={`text-lg ${isDark ? "text-slate-300" : "text-slate-600"}`}>
            Dibuat khusus untuk pencari kerja Indonesia
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              id: 1,
              title: "Tanpa Batasan Fitur",
              desc: "Kami percaya setiap pencari kerja berhak mendapatkan kemudahan. Gunakan semua fitur profesional kami secara gratis selama periode prototipe ini.",
            },
            {
              id: 2,
              title: "Bahasa Indonesia Native",
              desc: "AI-nya dilatih untuk menulis CV bahasa Indonesia yang profesional, bukan hanya terjemahan.",
            },
            {
              id: 3,
              title: "Tanpa Email & Password",
              desc: "Mulai langsung tanpa perlu daftar akun. Data disimpan di device kamu sendiri (local storage).",
            },
            {
              id: 4,
              title: "Powered by Claude AI",
              desc: "Menggunakan Claude 3.5 Sonnet — model AI paling powerful untuk penulisan profesional.",
            },
          ].map((f) => (
            <div
              key={f.id}
              className={`backdrop-blur rounded-2xl p-6 border flex items-start gap-4 transition-all ${
                isDark
                  ? "bg-slate-800/30 border-slate-700 hover:bg-slate-800/50"
                  : "bg-white/70 border-slate-200 hover:bg-white"
              }`}
            >
              <div className={`shrink-0 mt-0.5 ${isDark ? "text-purple-400" : "text-purple-600"}`}>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className={`font-bold text-lg mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>{f.title}</h3>
                <p className={`text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA bottom */}
        <div className="text-center mt-16">
          <Link
            to="/create"
            className={`inline-flex items-center gap-2.5 px-10 py-5 font-extrabold rounded-2xl text-xl transition-all shadow-2xl hover:-translate-y-1 ${
              isDark
                ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-purple-500/30"
                : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-purple-500/30"
            }`}
          >
            <svg
              className="w-5 h-5 text-white fill-current animate-bounce"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                clipRule="evenodd"
              />
            </svg>
            Mulai Buat CV
          </Link>
          <p className={`text-sm mt-4 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Tanpa daftar · Selesai dalam 3 menit · Langsung pakai
          </p>
        </div>
      </section>

      {/* Footer */}
      <div className={`border-t py-6 text-center ${
        isDark
          ? "border-slate-800/50"
          : "border-slate-200/50"
      }`}>
        <p className={`text-sm ${isDark ? "text-slate-500" : "text-slate-500"}`}>
          Dibuat dengan CVCraft AI — Harun Vibathon 2026
        </p>
      </div>
    </div>
  );
}
