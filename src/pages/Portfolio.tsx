import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import type { CVData } from '../types/cv'

export default function Portfolio() {
  const { slug } = useParams<{ slug: string }>()
  const [data, setData] = useState<CVData | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const load = async () => {
      if (!slug) {
        setNotFound(true)
        setLoading(false)
        return
      }

      try {
        const localPortfolios = JSON.parse(localStorage.getItem('local_portfolios') || '{}')
        const portfolio = localPortfolios[slug]

        if (portfolio && portfolio.cv_data) {
          setData(portfolio.cv_data)
        } else {
          setNotFound(true)
        }
      } catch (error) {
        console.error("Gagal membaca data portofolio:", error)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm font-medium">Memuat portofolio premium...</p>
        </div>
      </div>
    )
  }

  if (notFound || !data) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center max-w-sm p-6">
          <div className="text-7xl mb-6">🔍</div>
          <h1 className="text-2xl font-bold text-white mb-2">Portofolio Tidak Ditemukan</h1>
          <p className="text-slate-400 text-sm mb-8">
            Halaman portofolio <strong>/{slug}</strong> tidak ada atau telah dihapus.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl text-sm hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20"
          >
            ← Kembali ke CVCraft AI
          </Link>
        </div>
      </div>
    )
  }

  const { profile, experience, education, skills, languages, achievements } = data
  const mailtoHref = `mailto:${profile.email}`

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
      
      {/* 🚀 HERO SECTION PREMIUM (UKURAN BESAR & PAS SESUAI GAMBAR) */}
      <section className="relative bg-slate-900 text-white py-32 px-6 overflow-hidden border-b border-slate-800/80">
        {/* Latar Belakang Grid/Radial Halus */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]" />
        
        {/* Container Utama: Menggunakan flex-row-reverse agar Inisial Nama berada di KANAN */}
        <div className="relative max-w-5xl mx-auto flex flex-col md:flex-row-reverse items-center justify-between gap-12 md:gap-16">
          
          {/* ✅ SISI KANAN: Inisial Huruf Raksasa Bulat */}
          <div className="w-36 h-36 md:w-56 md:h-56 rounded-full bg-blue-600 border-4 border-blue-500 flex items-center justify-center text-6xl md:text-[110px] font-black text-white shrink-0 ...">
            {profile.name?.[0]?.toUpperCase() || '👤'}
          </div>
          
          {/* ✅ SISI KIRI: Detail Teks Informasi Rata Kiri */}
          <div className="flex-1 text-center md:text-left space-y-6 w-full">
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                {profile.name}
              </h1>
              <p className="text-sky-400 text-base md:text-lg font-extrabold tracking-wider uppercase">
                🚀 {profile.jobTitle || 'Professional'}
              </p>
            </div>
            
            {/* Informasi Kontak Bersusun Rapi ke Bawah */}
            <div className="text-sm md:text-base text-slate-300 bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-inner space-y-3 max-w-xl mx-auto md:mx-0">
              {profile.location && (
                <div className="flex items-center gap-3 justify-start">
                  <span className="text-slate-500 text-lg w-5 text-center">📍</span>
                  <span>{profile.location}</span>
                </div>
              )}
              {profile.phone && (
                <div className="flex items-center gap-3 justify-start">
                  <span className="text-slate-500 text-lg w-5 text-center">📞</span>
                  <span>{profile.phone}</span>
                </div>
              )}
              {profile.email && (
                <div className="flex items-center gap-3 justify-start">
                  <span className="text-slate-500 text-lg w-5 text-center">✉️</span>
                  <span className="truncate">{profile.email}</span>
                </div>
              )}
              
              {/* Deteksi Otomatis LinkedIn Profile */}
              {(profile as any).linkedin && (
                <div className="flex items-center gap-3 justify-start">
                  <span className="text-slate-500 text-lg w-5 text-center">🔗</span>
                  <a 
                    href={`https://${(profile as any).linkedin.replace('https://', '').replace('http://', '')}`}
                    target="_blank" 
                    rel="noreferrer"
                    className="text-sky-400 hover:underline font-bold truncate"
                  >
                    LinkedIn Profile
                  </a>
                </div>
              )}
            </div>

            {/* Tombol Aksi Kontat */}
            <div className="pt-2 flex justify-center md:justify-start w-full">
              <a
                href={mailtoHref}
                className="inline-flex items-center gap-2.5 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-blue-600/30 active:scale-95"
              >
                💼 Hubungi Saya Via Email
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* BODY CONTENT */}
      <div className="max-w-3xl mx-auto px-6 py-16 space-y-12">
        {/* ABOUT */}
        {profile.summary && (
          <section className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-8 shadow-xl backdrop-blur-sm hover:border-slate-700/60 transition-all duration-300">
            <SectionHeading emoji="✨">Tentang Saya</SectionHeading>
            <p className="text-slate-300 leading-relaxed text-base text-justify">{profile.summary}</p>
          </section>
        )}

        {/* SKILLS */}
        {(skills?.technical?.length > 0 || skills?.soft?.length > 0 || languages?.length > 0) && (
          <section className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-8 shadow-xl backdrop-blur-sm hover:border-slate-700/60 transition-all duration-300">
            <SectionHeading emoji="🛠️">Keahlian & Kompetensi</SectionHeading>
            <div className="space-y-6">
              {skills?.technical?.length > 0 && (
                <div>
                  <p className="text-xs font-black text-slate-500 mb-3 uppercase tracking-wider">Technical</p>
                  <div className="flex flex-wrap gap-2">
                    {skills.technical.map((s, i) => (
                      <span key={i} className="px-3 py-1.5 bg-slate-950 text-slate-200 border border-slate-800 rounded-xl text-xs font-medium shadow-sm hover:bg-blue-600 hover:border-blue-500 transition-all cursor-default">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {skills?.soft?.length > 0 && (
                <div>
                  <p className="text-xs font-black text-slate-500 mb-3 uppercase tracking-wider">Soft Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {skills.soft.map((s, i) => (
                      <span key={i} className="px-3 py-1.5 bg-blue-950/40 text-sky-400 border border-blue-900/50 font-medium rounded-xl text-xs">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {languages?.length > 0 && (
                <div className="pt-4 border-t border-slate-800/80">
                  <p className="text-xs font-black text-slate-500 mb-3 uppercase tracking-wider">🗣️ Bahasa</p>
                  <div className="flex flex-wrap gap-2">
                    {languages.map((l, i) => (
                      <span key={i} className="px-3 py-1.5 bg-emerald-950/40 text-emerald-400 border border-emerald-900/40 font-medium rounded-xl text-xs">
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* EXPERIENCE */}
        {experience?.length > 0 && (
          <section className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-8 shadow-xl backdrop-blur-sm hover:border-slate-700/60 transition-all duration-300">
            <SectionHeading emoji="💼">Pengalaman Kerja</SectionHeading>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-800" />
              <div className="space-y-8 pl-10">
                {experience.map((exp, i) => (
                  <div key={i} className="relative group">
                    <div className="absolute -left-[30px] top-1.5 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-slate-950 group-hover:bg-sky-400 transition-colors" />
                    <div className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-5 shadow-sm group-hover:border-slate-700/50 transition-all">
                      <div className="flex items-start justify-between flex-wrap gap-2 mb-3">
                        <div>
                          <h3 className="font-bold text-white text-base group-hover:text-blue-400 transition-colors">{exp.position}</h3>
                          <p className="text-sky-400 font-bold text-sm">{exp.company}</p>
                        </div>
                        <span className="text-xs font-semibold text-slate-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800 shadow-inner">
                          📅 {exp.period}
                        </span>
                      </div>
                      {exp.points?.length > 0 && (
                        <ul className="space-y-2">
                          {exp.points.map((pt, pi) => (
                            <li key={pi} className="text-sm text-slate-300 flex items-start gap-2.5">
                              <span className="text-blue-500 mt-1 text-xs">⚡</span>
                              <span className="leading-relaxed">{pt}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* EDUCATION */}
        {education?.length > 0 && (
          <section className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-8 shadow-xl backdrop-blur-sm hover:border-slate-700/60 transition-all duration-300">
            <SectionHeading emoji="🎓">Riwayat Pendidikan</SectionHeading>
            <div className="grid gap-4">
              {education.map((edu, i) => (
                <div key={i} className="bg-white/5 border border-slate-800/60 rounded-2xl p-5 shadow-sm flex items-start gap-4 hover:bg-slate-950/80 transition-all">
                  <div className="w-11 h-11 bg-blue-950 text-blue-400 rounded-xl flex items-center justify-center shrink-0 text-xl border border-blue-900/50 shadow-inner">🎓</div>
                  <div className="w-full">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <h3 className="font-bold text-white text-base leading-snug">{edu.institution}</h3>
                      <span className="text-[10px] text-slate-400 font-semibold bg-slate-900 px-2 py-0.5 rounded border border-slate-800 shadow-sm">{edu.year}</span>
                    </div>
                    <p className="text-sky-400 text-sm font-semibold">{edu.degree}</p>
                    {edu.description && <p className="text-slate-400 text-sm mt-2 pt-2 border-t border-dashed border-slate-800/80 leading-relaxed">{edu.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ACHIEVEMENTS */}
        {achievements?.length > 0 && (
          <section className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-8 shadow-xl backdrop-blur-sm hover:border-slate-700/60 transition-all duration-300">
            <SectionHeading emoji="🏆">Pencapaian & Penghargaan</SectionHeading>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {achievements.map((ach, i) => (
                <div key={i} className="bg-amber-950/20 border border-amber-900/40 rounded-2xl p-5 shadow-sm flex items-start gap-3 hover:border-amber-700/50 transition-colors">
                  <span className="text-2xl shrink-0">🏆</span>
                  <p className="text-amber-200/90 text-sm font-bold leading-snug self-center">{ach}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* FOOTER PREMIUM */}
      <footer className="border-t border-slate-900 bg-slate-900/40 backdrop-blur-sm py-12 text-center mt-20">
        <p className="text-slate-500 text-sm mb-3 font-medium">✨ Dibuat Otomatis dengan CVCraft AI — HSI BS Vibathon 2026</p>
        <Link to="/" className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-sm font-bold bg-slate-900 px-4 py-2 rounded-xl transition-all border border-slate-800 hover:border-slate-700">
          Buat Portofolio Kamu Sendiri →
        </Link>
      </footer>
    </div>
  )
}

function SectionHeading({ children, emoji }: { children: React.ReactNode; emoji: string }) {
  return (
    <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2.5 border-b border-slate-800 pb-3">
      <span className="text-2xl">{emoji}</span>
      {children}
    </h2>
  )
}