import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📄</span>
          <span className="text-white font-bold text-xl">CVCraft AI</span>
        </div>
        <Link
          to="/sign-in"
          className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium text-sm transition-all border border-white/20"
        >
          Masuk
        </Link>
      </nav>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-32 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-medium border border-blue-500/30 mb-8">
          <span>✨</span>
          <span>HSI BS Vibathon 2026 · Powered by Claude AI</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
          CV Profesional dalam{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
            Hitungan Detik
          </span>
        </h1>

        <p className="text-xl text-blue-100/80 mb-10 max-w-2xl mx-auto leading-relaxed">
          Buat CV yang ATS-friendly dan portofolio online impresif dengan bantuan AI.
          Gratis, tanpa perlu input API key apapun.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/sign-in"
            className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-2xl text-lg transition-all shadow-lg shadow-blue-500/30 hover:-translate-y-1"
          >
            Mulai Gratis — Masuk dengan Google
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 text-left">
          {[
            {
              icon: '🤖',
              title: 'AI Menulis Untukmu',
              desc: 'Claude AI menganalisis data kamu dan menghasilkan CV profesional yang kuat dan ATS-friendly secara otomatis.',
            },
            {
              icon: '🌐',
              title: 'Portofolio Online',
              desc: 'Dapatkan halaman portofolio publik dengan URL unik yang bisa dibagikan ke rekruter mana saja.',
            },
            {
              icon: '📄',
              title: 'Download PDF',
              desc: 'Pilih dari 3 template warna cantik dan download CV siap cetak dalam format A4.',
            },
          ].map((f) => (
            <div key={f.title} className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/10">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-blue-200/70 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 py-6 text-center">
        <p className="text-blue-200/50 text-sm">
          Dibuat dengan CVCraft AI — HSI BS Vibathon 2026
        </p>
      </div>
    </div>
  )
}
