import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import type { CVFormData } from '../types/cv'
import { defaultFormData } from '../types/cv'

const DRAFT_KEY = 'cv_form_draft'
const STEPS = ['Data Pribadi', 'Pendidikan', 'Pengalaman', 'Keahlian', 'Generate AI']

export default function CreateCV() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<CVFormData>(defaultFormData)
  const [draftSaved, setDraftSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasDraft, setHasDraft] = useState(false)

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY)
    if (draft) {
      try {
        setForm(JSON.parse(draft))
        setHasDraft(true)
      } catch {}
    }
  }, [])

  // Auto-save to localStorage
  const saveDraft = useCallback((data: CVFormData) => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data))
    setDraftSaved(true)
    setTimeout(() => setDraftSaved(false), 2000)
  }, [])

  const updateForm = (updates: Partial<CVFormData>) => {
    const next = { ...form, ...updates }
    setForm(next)
    saveDraft(next)
  }

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY)
    setForm(defaultFormData)
    setHasDraft(false)
    setStep(0)
  }

  const handleGenerate = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-haiku-3-5-20241022",
          max_tokens: 2000,
          messages: [
            {
              role: "user",
              content: `Kamu adalah expert HR dan CV writer profesional Indonesia.
Buatkan CV yang profesional, menarik, dan ATS-friendly berdasarkan data berikut:
${JSON.stringify(form)}

Balas HANYA dengan JSON valid ini, tanpa markdown, tanpa backtick:
{
  "profile": { "name": "", "email": "", "phone": "", "location": "", "jobTitle": "", "summary": "" },
  "education": [{ "institution": "", "degree": "", "year": "", "description": "" }],
  "experience": [{ "company": "", "position": "", "period": "", "points": [] }],
  "skills": { "technical": [], "soft": [] },
  "languages": [],
  "achievements": []
}`
            }
          ]
        })
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error?.message || `Error ${response.status}`)
      }

      const data = await response.json()
      const text = data.content[0].text
      const clean = text.replace(/```json|```/g, "").trim()
      const result = JSON.parse(clean)

      // Save to localStorage cv_list
      const newCV = {
        id: 'cv_' + Date.now(),
        formData: form,
        aiResult: result,
        createdAt: new Date().toISOString(),
        templateColor: 'blue',
      }
      const existing = JSON.parse(localStorage.getItem('cv_list') || '[]')
      existing.unshift(newCV)
      localStorage.setItem('cv_list', JSON.stringify(existing))

      // Clear draft
      localStorage.removeItem(DRAFT_KEY)

      // Store result and navigate
      sessionStorage.setItem('cv_result', JSON.stringify(result))
      navigate('/result')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Terjadi kesalahan. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full px-4 py-3 rounded-xl border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-white placeholder:text-gray-500 bg-gray-800 text-sm'
  const labelClass = 'block text-sm font-medium text-gray-300 mb-1.5'

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>📄</span>
            <span className="font-bold text-white">CVCraft AI</span>
          </div>
          {draftSaved && (
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
              💾 Draft tersimpan otomatis
            </span>
          )}
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Steps indicator */}
        <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => i < step && setStep(i)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  i === step
                    ? 'bg-blue-600 text-white shadow-sm'
                    : i < step
                    ? 'bg-blue-500/20 text-blue-400 cursor-pointer hover:bg-blue-500/30'
                    : 'bg-gray-800 text-gray-500 cursor-default'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                  i === step ? 'bg-white/20' : i < step ? 'bg-blue-500/30' : 'bg-gray-700'
                }`}>
                  {i < step ? '✓' : i + 1}
                </span>
                {s}
              </button>
              {i < STEPS.length - 1 && (
                <div className={`w-4 h-0.5 rounded ${i < step ? 'bg-blue-500/50' : 'bg-gray-700'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-gray-900 rounded-2xl border border-white/10 p-6">
          {/* Step 0: Data Pribadi */}
          {step === 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Data Pribadi</h2>
                {hasDraft && (
                  <button
                    onClick={clearDraft}
                    className="text-xs text-red-400 hover:text-red-300 font-medium"
                  >
                    Hapus Draft & Mulai Baru
                  </button>
                )}
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Nama Lengkap *</label>
                    <input
                      className={inputClass}
                      placeholder="Ahmad Fauzi"
                      value={form.name}
                      onChange={e => updateForm({ name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Posisi / Jabatan *</label>
                    <input
                      className={inputClass}
                      placeholder="Software Engineer"
                      value={form.jobTitle}
                      onChange={e => updateForm({ jobTitle: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Email *</label>
                    <input
                      type="email"
                      className={inputClass}
                      placeholder="ahmad@email.com"
                      value={form.email}
                      onChange={e => updateForm({ email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Nomor HP</label>
                    <input
                      className={inputClass}
                      placeholder="+62 812 3456 7890"
                      value={form.phone}
                      onChange={e => updateForm({ phone: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Kota / Lokasi</label>
                  <input
                    className={inputClass}
                    placeholder="Jakarta, Indonesia"
                    value={form.location}
                    onChange={e => updateForm({ location: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Pendidikan */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6">Pendidikan</h2>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Nama Institusi *</label>
                  <input
                    className={inputClass}
                    placeholder="Universitas Indonesia"
                    value={form.institution}
                    onChange={e => updateForm({ institution: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Jurusan / Program Studi *</label>
                    <input
                      className={inputClass}
                      placeholder="Teknik Informatika"
                      value={form.degree}
                      onChange={e => updateForm({ degree: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Tahun Lulus</label>
                    <input
                      className={inputClass}
                      placeholder="2022"
                      value={form.graduationYear}
                      onChange={e => updateForm({ graduationYear: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Keterangan Tambahan (opsional)</label>
                  <textarea
                    className={inputClass}
                    rows={3}
                    placeholder="IPK 3.8/4.0, Aktif di organisasi HMI..."
                    value={form.educationDesc}
                    onChange={e => updateForm({ educationDesc: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Pengalaman */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6">Pengalaman Kerja</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Nama Perusahaan *</label>
                    <input
                      className={inputClass}
                      placeholder="PT Teknologi Nusantara"
                      value={form.company}
                      onChange={e => updateForm({ company: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Posisi *</label>
                    <input
                      className={inputClass}
                      placeholder="Backend Developer"
                      value={form.position}
                      onChange={e => updateForm({ position: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Periode Kerja</label>
                  <input
                    className={inputClass}
                    placeholder="Jan 2022 – Des 2023"
                    value={form.period}
                    onChange={e => updateForm({ period: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelClass}>Pencapaian & Tanggung Jawab</label>
                  <textarea
                    className={inputClass}
                    rows={5}
                    placeholder="Jelaskan pencapaian dan tanggung jawabmu. AI akan memperkuat setiap poin dengan action verbs yang kuat.

Contoh:
- Membangun API microservices menggunakan Go
- Meningkatkan performa database 40%
- Memimpin tim 5 developer"
                    value={form.experiencePoints}
                    onChange={e => updateForm({ experiencePoints: e.target.value })}
                  />
                </div>

                {/* Additional experiences */}
                {form.experiences.map((exp, idx) => (
                  <div key={idx} className="p-4 bg-gray-800 rounded-xl border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-gray-400">Pengalaman {idx + 2}</h4>
                      <button
                        onClick={() => {
                          const exps = form.experiences.filter((_, i) => i !== idx)
                          updateForm({ experiences: exps })
                        }}
                        className="text-xs text-red-400 hover:text-red-300"
                      >
                        Hapus
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        className={inputClass}
                        placeholder="Nama Perusahaan"
                        value={exp.company}
                        onChange={e => {
                          const exps = [...form.experiences]
                          exps[idx] = { ...exps[idx], company: e.target.value }
                          updateForm({ experiences: exps })
                        }}
                      />
                      <input
                        className={inputClass}
                        placeholder="Posisi"
                        value={exp.position}
                        onChange={e => {
                          const exps = [...form.experiences]
                          exps[idx] = { ...exps[idx], position: e.target.value }
                          updateForm({ experiences: exps })
                        }}
                      />
                    </div>
                    <input
                      className={inputClass}
                      placeholder="Periode"
                      value={exp.period}
                      onChange={e => {
                        const exps = [...form.experiences]
                        exps[idx] = { ...exps[idx], period: e.target.value }
                        updateForm({ experiences: exps })
                      }}
                    />
                    <textarea
                      className={inputClass}
                      rows={3}
                      placeholder="Pencapaian..."
                      value={exp.points}
                      onChange={e => {
                        const exps = [...form.experiences]
                        exps[idx] = { ...exps[idx], points: e.target.value }
                        updateForm({ experiences: exps })
                      }}
                    />
                  </div>
                ))}

                <button
                  onClick={() => updateForm({
                    experiences: [...form.experiences, { company: '', position: '', period: '', points: '' }]
                  })}
                  className="w-full py-2.5 border-2 border-dashed border-gray-700 text-gray-500 hover:border-blue-500/50 hover:text-blue-400 rounded-xl text-sm font-medium transition-all"
                >
                  + Tambah Pengalaman Lain
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Keahlian */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6">Keahlian & Lainnya</h2>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Technical Skills</label>
                  <textarea
                    className={inputClass}
                    rows={3}
                    placeholder="JavaScript, TypeScript, React, Node.js, Go, PostgreSQL, Docker, AWS..."
                    value={form.technicalSkills}
                    onChange={e => updateForm({ technicalSkills: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 mt-1">Pisahkan dengan koma</p>
                </div>
                <div>
                  <label className={labelClass}>Soft Skills</label>
                  <textarea
                    className={inputClass}
                    rows={2}
                    placeholder="Kepemimpinan, Komunikasi, Problem Solving, Teamwork..."
                    value={form.softSkills}
                    onChange={e => updateForm({ softSkills: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelClass}>Bahasa</label>
                  <input
                    className={inputClass}
                    placeholder="Bahasa Indonesia (Native), Bahasa Inggris (Profesional)"
                    value={form.languages}
                    onChange={e => updateForm({ languages: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelClass}>Pencapaian / Awards (opsional)</label>
                  <textarea
                    className={inputClass}
                    rows={3}
                    placeholder="Juara 1 Hackathon XYZ 2023&#10;Google Scholar 2022&#10;Speaker di konferensi ABC"
                    value={form.achievements}
                    onChange={e => updateForm({ achievements: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Generate */}
          {step === 4 && (
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
                <span className="text-4xl">✨</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Siap Generate CV!
              </h2>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed max-w-sm mx-auto">
                AI akan menganalisis data kamu dan menghasilkan CV profesional yang kuat,
                ATS-friendly, dengan action verbs yang tepat.
              </p>

              {/* Summary */}
              <div className="bg-gray-800/50 rounded-xl p-4 text-left mb-6 space-y-2 border border-white/10">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-400">✓</span>
                  <span className="text-gray-300"><strong>Nama:</strong> {form.name || '—'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-400">✓</span>
                  <span className="text-gray-300"><strong>Posisi:</strong> {form.jobTitle || '—'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-400">✓</span>
                  <span className="text-gray-300"><strong>Pendidikan:</strong> {form.institution || '—'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-400">✓</span>
                  <span className="text-gray-300"><strong>Pengalaman:</strong> {form.company || '—'}</span>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={loading || !form.name || !form.jobTitle}
                className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {loading ? (
                  <>
                    <span className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="animate-pulse">AI sedang menulis CV kamu...</span>
                  </>
                ) : (
                  <>
                    <span className="text-xl animate-sparkle">✨</span>
                    Generate CV dengan AI
                  </>
                )}
              </button>

              {loading && (
                <p className="text-xs text-gray-500 mt-3">
                  Biasanya membutuhkan 10-20 detik...
                </p>
              )}
            </div>
          )}

          {/* Navigation */}
          {step < 4 && (
            <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
              <button
                onClick={() => setStep(s => Math.max(0, s - 1))}
                className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  step === 0
                    ? 'opacity-0 pointer-events-none'
                    : 'text-gray-300 bg-gray-800 hover:bg-gray-700'
                }`}
              >
                ← Sebelumnya
              </button>
              <button
                onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-all"
              >
                {step === 3 ? 'Lanjut ke Generate →' : 'Selanjutnya →'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
