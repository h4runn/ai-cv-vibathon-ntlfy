import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

// Mengubah struktur TABS agar merender ID, icon akan ditentukan dinamis via SVG di bawah
const TABS = [
  { id: 'ai', label: 'AI yang Menulis' },
  { id: 'ats', label: 'Format ATS-Friendly' },
  { id: 'template', label: '3 Template Profesional' },
  { id: 'proses', label: 'Proses 3 Menit' },
]

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState('ai')
  const [sectionVisible, setSectionVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setSectionVisible(true)
      },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const scrollToPelajari = () => {
    document.getElementById('pelajari')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          {/* Mengganti 📄 dengan SVG Dokumen Minimalis */}
          <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-white font-bold text-xl tracking-wide">CVCraft AI</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 px-4 py-2 text-white/80 hover:text-white font-medium text-sm transition-colors"
          >
            {/* Mengganti 📄 dengan SVG Dokumen Kecil */}
            <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            CV Saya
          </Link>
          <Link
            to="/create"
            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium text-sm transition-all border border-white/20"
          >
            Buat CV
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-medium border border-blue-500/30 mb-8">
          {/* Mengganti ✨ dengan SVG Sparkles yang Elegan */}
          <svg className="w-4 h-4 text-blue-300 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <span>Harun Vibathon 2026 · Powered by Claude AI</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
          CV Profesional dalam{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
            Hitungan Detik
          </span>
        </h1>

        <p className="text-xl text-blue-100/80 mb-10 max-w-2xl mx-auto leading-relaxed">
          Buat CV yang ATS-friendly dan portofolio online impresif dengan bantuan AI.
          Gratis, tanpa perlu daftar akun atau input API key apapun.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/create"
            className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-2xl text-lg transition-all shadow-lg shadow-blue-500/30 hover:-translate-y-1"
          >
            Buat CV Sekarang — Gratis!
          </Link>
          <button
            onClick={scrollToPelajari}
            className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl text-lg transition-all border border-white/20"
          >
            Pelajari Lebih Lanjut ↓
          </button>
        </div>

        {/* Feature cards (Mengganti emoji dengan SVG Kustom murni) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 text-left">
          {[
            {
              id: 'ai',
              title: 'AI Menulis Untukmu',
              desc: 'Claude AI menganalisis data kamu dan menghasilkan CV profesional yang kuat dan ATS-friendly secara otomatis.',
            },
            {
              id: 'web',
              title: 'Portofolio Online',
              desc: 'Dapatkan halaman portofolio instan dengan URL unik berbasis nama Anda di perangkat ini. Fitur Cloud Sync untuk membagikan tautan secara publik ke rekruter akan tersedia pada versi Premium.',
            },
            {
              id: 'doc',
              title: 'Download PDF',
              desc: 'Pilih dari 3 template warna cantik dan download CV siap cetak dalam format A4.',
            },
          ].map((f) => (
            <div key={f.title} className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/10">
              <div className="text-blue-400 mb-4">
                {f.id === 'ai' && (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                )}
                {f.id === 'web' && (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9h18" />
                  </svg>
                )}
                {f.id === 'doc' && (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                )}
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-blue-200/70 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Section #pelajari */}
      <section
        id="pelajari"
        ref={sectionRef}
        className={`bg-slate-900/80 border-t border-white/10 py-20 px-6 transition-all duration-700 ${
          sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
              Bagaimana CV Craft AI Bekerja?
            </h2>
            <p className="text-blue-200/70 text-lg">
              Teknologi AI terdepan yang menulis CV terbaik untukmu
            </p>
          </div>

          {/* Tab buttons dengan Render SVG Minimalis menggantikan emoji */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {tab.id === 'ai' && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
                {tab.id === 'ats' && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>}
                {tab.id === 'template' && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                {tab.id === 'proses' && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            {/* Tab 1: AI yang Menulis */}
            {activeTab === 'ai' && (
              <div className="animate-fade-in">
                <h3 className="text-2xl font-bold text-white mb-3">Bukan Template Biasa</h3>
                <p className="text-blue-200/80 leading-relaxed mb-6">
                  CV Craft AI menggunakan Claude AI dari Anthropic — model bahasa terpintar di dunia —
                  untuk menulis setiap kalimat CV kamu dari nol. Bukan mengisi template kosong,
                  tapi benar-benar menulis ulang pengalamanmu menjadi narasi yang kuat dan meyakinkan.
                </p>
                <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-5 space-y-2">
                  <p className="text-violet-200 text-sm font-medium">✓ Action verbs otomatis</p>
                  <p className="text-violet-200 text-sm font-medium">✓ ATS-friendly format</p>
                  <p className="text-violet-200 text-sm font-medium">✓ Bahasa profesional Indonesia</p>
                </div>
              </div>
            )}

            {/* Tab 2: Format ATS-Friendly */}
            {activeTab === 'ats' && (
              <div className="animate-fade-in">
                <h3 className="text-2xl font-bold text-white mb-3">Lolos Sistem Seleksi Otomatis</h3>
                <p className="text-blue-200/80 leading-relaxed mb-6">
                  90% perusahaan besar menggunakan ATS (Applicant Tracking System) untuk menyaring CV
                  kemudian dibaca HRD. CV Craft AI memastikan CV kamu terstruktur dengan benar agar
                  tidak tersaring di tahap pertama.
                </p>
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5 space-y-2">
                  <p className="text-emerald-200 text-sm font-medium">✓ Struktur yang terbaca ATS</p>
                  <p className="text-emerald-200 text-sm font-medium">✓ Keyword yang relevan</p>
                  <p className="text-emerald-200 text-sm font-medium">✓ Format bersih tanpa tabel kompleks</p>
                </div>
              </div>
            )}

            {/* Tab 3: 3 Template Profesional */}
            {activeTab === 'template' && (
              <div className="animate-fade-in">
                <h3 className="text-2xl font-bold text-white mb-3">Tampilan yang Memikat HRD</h3>
                <p className="text-blue-200/80 leading-relaxed mb-6">
                  Pilih dari 3 template yang dirancang khusus oleh desainer profesional. Setiap
                  template dioptimalkan untuk keterbacaan dan kesan pertama yang kuat.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center">
                    <div className="w-10 h-10 rounded-full bg-blue-500 mx-auto mb-2 shadow-lg shadow-blue-500/30" />
                    <p className="text-blue-200 font-semibold text-sm">Biru</p>
                    <p className="text-blue-300/60 text-xs mt-1">Profesional & Terpercaya</p>
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 mx-auto mb-2 shadow-lg shadow-emerald-500/30" />
                    <p className="text-emerald-200 font-semibold text-sm">Hijau</p>
                    <p className="text-emerald-300/60 text-xs mt-1">Modern & Segar</p>
                  </div>
                  <div className="bg-gray-500/10 border border-gray-500/20 rounded-xl p-4 text-center">
                    <div className="w-10 h-10 rounded-full bg-gray-600 mx-auto mb-2 shadow-lg shadow-gray-500/30" />
                    <p className="text-gray-200 font-semibold text-sm">Minimal</p>
                    <p className="text-gray-300/60 text-xs mt-1">Elegan & Bersih</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Proses 3 Menit */}
            {activeTab === 'proses' && (
              <div className="animate-fade-in">
                <h3 className="text-2xl font-bold text-white mb-3">Dari Data ke CV Siap Kirim</h3>
                <div className="space-y-4 mb-8">
                  {[
                    { menit: '01', label: 'Menit 1', desc: 'Isi form data diri, pengalaman, skill' },
                    { menit: '02', label: 'Menit 2', desc: 'AI menulis dan menyusun CV kamu' },
                    { menit: '03', label: 'Menit 3', desc: 'Pilih template, download PDF, selesai!' },
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-violet-600/30 border border-violet-500/40 flex items-center justify-center shrink-0">
                        <span className="text-violet-300 font-bold text-sm">{step.menit}</span>
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">{step.label}</p>
                        <p className="text-blue-200/70 text-sm">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  to="/create"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-violet-500/30"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                  Coba Sekarang — Gratis!
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Kenapa CV Craft AI? (Bagian Grid Bawah dengan SVG Premium) */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Kenapa CV Craft AI?
          </h2>
          <p className="text-blue-200/70 text-lg">
            Dibuat khusus untuk pencari kerja Indonesia
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              id: 'kilat',
              title: 'Tanpa Daftar Akun',
              desc: 'Langsung buat CV tanpa perlu sign up atau login. Data tersimpan di browsermu sendiri.',
            },
            {
              id: 'aman',
              title: 'Data Tetap Pribadimu',
              desc: 'CV dan data kamu tersimpan di localStorage browser sendiri, bukan di server kami.',
            },
            {
              id: 'share',
              title: 'Portofolio Bisa Dibagikan',
              desc: 'Buat halaman portofolio online dengan URL unik yang bisa dikirim ke rekruter via link.',
            },
            {
              id: 'gratis',
              title: 'Core Features Gratis!',
              desc: 'Nikmati fitur utama pembuatan CV bertenaga AI dan Download PDF secara gratis tanpa biaya tersembunyi atau API key. Fitur lanjutan seperti Cloud Sync publik akan hadir Add-on Premium.',
            },
          ].map((f) => (
            <div key={f.title} className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10 flex items-start gap-4">
              <div className="text-blue-400 shrink-0 mt-0.5">
                {f.id === 'kilat' && (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )}
                {f.id === 'aman' && (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}
                {f.id === 'share' && (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                )}
                {f.id === 'gratis' && (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                )}
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1">{f.title}</h3>
                <p className="text-blue-200/70 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA bottom (Mengganti emoji dengan Sparkles SVG tipis) */}
        <div className="text-center mt-16">
          <Link
            to="/create"
            className="inline-flex items-center gap-2.5 px-10 py-5 bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white font-extrabold rounded-2xl text-xl transition-all shadow-2xl shadow-blue-500/30 hover:-translate-y-1"
          >
            <svg className="w-5 h-5 text-white fill-current animate-bounce" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            Mulai Buat CV
          </Link>
          <p className="text-blue-200/50 text-sm mt-4">Gratis · Tanpa daftar · Selesai dalam 3 menit</p>
        </div>
      </section>

      {/* Footer */}
      <div className="border-t border-white/10 py-6 text-center">
        <p className="text-blue-200/50 text-sm">
          Dibuat dengan CVCraft AI — Harun Vibathon 2026
        </p>
      </div>
    </div>
  )
}