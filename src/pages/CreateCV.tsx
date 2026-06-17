import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
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
      const response = await fetch('/api/generate-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData: form }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.message || `Error ${response.status}`)
      }

      const { result } = await response.json()

      // Save to Supabase
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        await supabase.from('cvs').insert({
          user_id: session.user.id,
          form_data: form,
          ai_result: result,
        })
      }

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

  const inputClass = 'w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-gray-800 placeholder-gray-400 bg-white text-sm'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>📄</span>
            <span className="font-bold text-gray-800">CVCraft AI</span>
          </div>
          {draftSaved && (
            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
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
                    ? 'bg-blue-50 text-blue-600 cursor-pointer hover:bg-blue-100'
                    : 'bg-gray-100 text-gray-400 cursor-default'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                  i === step ? 'bg-white/20' : i < step ? 'bg-blue-200' : 'bg-gray-200'
                }`}>
                  {i < step ? '✓' : i + 1}
                </span>
                {s}
              </button>
              {i < STEPS.length - 1 && (
                <div className={`w-4 h-0.5 rounded ${i < step ? 'bg-blue-300' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          {/* Step 0: Data Pribadi */}
          {step === 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Data Pribadi</h2>
                {hasDraft && (
                  <button
                    onClick={clearDraft}
                    className="text-xs text-red-400 hover:text-red-500 font-medium"
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
              <h2 className="text-xl font-bold text-gray-800 mb-6">Pendidikan</h2>
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
              <h2 className="text-xl font-bold text-gray-800 mb-6">Pengalaman Kerja</h2>
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
                  <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-gray-600">Pengalaman {idx + 2}</h4>
                      <button
                        onClick={() => {
                          const exps = form.experiences.filter((_, i) => i !== idx)
                          updateForm({ experiences: exps })
                        }}
                        className="text-xs text-red-400 hover:text-red-500"
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
                  className="w-full py-2.5 border-2 border-dashed border-gray-200 text-gray-400 hover:border-blue-300 hover:text-blue-500 rounded-xl text-sm font-medium transition-all"
                >
                  + Tambah Pengalaman Lain
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Keahlian */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6">Keahlian & Lainnya</h2>
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
                  <p className="text-xs text-gray-400 mt-1">Pisahkan dengan koma</p>
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
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Siap Generate CV!
              </h2>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed max-w-sm mx-auto">
                AI akan menganalisis data kamu dan menghasilkan CV profesional yang kuat,
                ATS-friendly, dengan action verbs yang tepat.
              </p>

              {/* Summary */}
              <div className="bg-gray-50 rounded-xl p-4 text-left mb-6 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-600"><strong>Nama:</strong> {form.name || '—'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-600"><strong>Posisi:</strong> {form.jobTitle || '—'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-600"><strong>Pendidikan:</strong> {form.institution || '—'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-600"><strong>Pengalaman:</strong> {form.company || '—'}</span>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
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
                <p className="text-xs text-gray-400 mt-3">
                  Biasanya membutuhkan 10-20 detik...
                </p>
              )}
            </div>
          )}

          {/* Navigation */}
          {step < 4 && (
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-50">
              <button
                onClick={() => setStep(s => Math.max(0, s - 1))}
                className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  step === 0
                    ? 'opacity-0 pointer-events-none'
                    : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
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
