import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { CVData } from '../types/cv'

interface PortfolioRow {
  cv_data: CVData
}

export default function Portfolio() {
  const { slug } = useParams<{ slug: string }>()
  const [data, setData] = useState<CVData | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data: row, error } = await supabase
        .from('portfolios')
        .select('cv_data')
        .eq('slug', slug)
        .maybeSingle()

      if (error || !row) {
        setNotFound(true)
      } else {
        setData((row as PortfolioRow).cv_data)
      }
      setLoading(false)
    }
    load()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Memuat portofolio...</p>
        </div>
      </div>
    )
  }

  if (notFound || !data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="text-7xl mb-6">🔍</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Portofolio Tidak Ditemukan</h1>
          <p className="text-gray-500 text-sm mb-8">
            Halaman portofolio <strong>/{slug}</strong> tidak ada atau telah dihapus.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl text-sm hover:bg-blue-700 transition-all"
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
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <section className="bg-gradient-to-br from-slate-900 to-blue-900 text-white py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-24 h-24 rounded-full bg-blue-500/20 border-4 border-blue-400/30 flex items-center justify-center mx-auto mb-6 text-4xl">
            {profile.name?.[0]?.toUpperCase() || '👤'}
          </div>
          <h1 className="text-4xl font-extrabold mb-2">{profile.name}</h1>
          <p className="text-blue-200 text-lg font-medium mb-1">{profile.jobTitle}</p>
          {profile.location && <p className="text-blue-300/70 text-sm">📍 {profile.location}</p>}

          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <a
              href={mailtoHref}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl text-sm transition-all"
            >
              📧 Hubungi Saya
            </a>
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-16 space-y-16">
        {/* ABOUT */}
        {profile.summary && (
          <section>
            <SectionHeading>Tentang Saya</SectionHeading>
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <p className="text-gray-600 leading-relaxed">{profile.summary}</p>
            </div>
          </section>
        )}

        {/* SKILLS */}
        {(skills?.technical?.length > 0 || skills?.soft?.length > 0 || languages?.length > 0) && (
          <section>
            <SectionHeading>Keahlian</SectionHeading>
            <div className="space-y-4">
              {skills?.technical?.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Technical</p>
                  <div className="flex flex-wrap gap-2">
                    {skills.technical.map((s, i) => (
                      <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-sm font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {skills?.soft?.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Soft Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {skills.soft.map((s, i) => (
                      <span key={i} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-sm font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {languages?.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Bahasa</p>
                  <div className="flex flex-wrap gap-2">
                    {languages.map((l, i) => (
                      <span key={i} className="px-3 py-1.5 bg-gray-100 text-gray-600 border border-gray-200 rounded-full text-sm font-medium">
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
          <section>
            <SectionHeading>Pengalaman</SectionHeading>
            <div className="relative">
              {/* vertical line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
              <div className="space-y-8 pl-12">
                {experience.map((exp, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-8 top-1 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-white" />
                    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                      <div className="flex items-start justify-between flex-wrap gap-2 mb-3">
                        <div>
                          <h3 className="font-bold text-gray-800">{exp.position}</h3>
                          <p className="text-blue-600 font-semibold text-sm">{exp.company}</p>
                        </div>
                        <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                          {exp.period}
                        </span>
                      </div>
                      {exp.points?.length > 0 && (
                        <ul className="space-y-1.5">
                          {exp.points.map((pt, pi) => (
                            <li key={pi} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="text-blue-400 mt-0.5 shrink-0">▸</span>
                              {pt}
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
          <section>
            <SectionHeading>Pendidikan</SectionHeading>
            <div className="grid gap-4">
              {education.map((edu, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 text-xl">🎓</div>
                  <div>
                    <h3 className="font-bold text-gray-800">{edu.institution}</h3>
                    <p className="text-blue-600 text-sm font-medium">{edu.degree}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{edu.year}</p>
                    {edu.description && <p className="text-gray-500 text-sm mt-2">{edu.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ACHIEVEMENTS */}
        {achievements?.length > 0 && (
          <section>
            <SectionHeading>Pencapaian</SectionHeading>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {achievements.map((ach, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-start gap-3">
                  <span className="text-2xl">🏆</span>
                  <p className="text-gray-700 text-sm font-medium">{ach}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 py-8 text-center">
        <p className="text-gray-400 text-sm mb-2">Dibuat dengan CVCraft AI — HSI BS Vibathon 2026</p>
        <Link to="/" className="text-blue-500 hover:text-blue-600 text-sm font-medium">
          Buat CV & Portofoliomu →
        </Link>
      </footer>
    </div>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl font-extrabold text-gray-800 mb-6 flex items-center gap-3">
      <div className="w-1 h-8 bg-blue-500 rounded-full" />
      {children}
    </h2>
  )
}
