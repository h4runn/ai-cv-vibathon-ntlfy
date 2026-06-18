CreateCv.tsx
import { useState, useEffect, useCallback, useMemo } from 'react'
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

  // State tambahan untuk animasi tombol AI Polish
  const [polishingExp, setPolishingExp] = useState(false)

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

  // ==========================================
  // FITUR 1: ATS SCORE CHECKER (Dinamis & Real-time)
  // ==========================================
  const atsScoreData = useMemo(() => {
    let score = 20; // Skor dasar untuk setup awal
    const tips: string[] = [];

    // Cek Data Pribadi
    if (form.name && form.jobTitle && form.email) {
      score += 20;
    } else {
      tips.push("Lengkapi data profil utama (Nama, Email, Jabatan).");
    }

    // Cek Pendidikan
    if (form.institution && form.degree) {
      score += 15;
    } else {
      tips.push("Tambahkan riwayat pendidikan terakhir kamu.");
    }

    // Cek Pengalaman Kerja & Deskripsi
    if (form.company && form.position) {
      score += 15;
      if (form.experiencePoints && form.experiencePoints.length > 30) {
        score += 15;
      } else {
        tips.push("Tulis deskripsi pencapaian pengalaman kerja lebih detail.");
      }
    } else {
      tips.push("Tambahkan riwayat pengalaman kerja minimum 1 entri.");
    }

    // Cek Skill
    if (form.technicalSkills && form.technicalSkills.split(',').length >= 3) {
      score += 10;
    } else {
      tips.push("Masukkan minimal 3 Technical Skills yang relevan.");
    }

    if (form.softSkills) {
      score += 5;
    }

    return { score, currentTip: tips[0] || "CV kamu sudah sangat optimal & ATS-Friendly! ✨" };
  }, [form]);


  // ==========================================
  // FITUR 2: AI POLISH / AI ENHANCE FUNCTION
  // ==========================================
  const handleAIPolishExperience = async () => {
    if (!form.experiencePoints) return;
    setPolishingExp(true);

    // Simulasi AI sedang menstrukturkan kalimat menjadi action verbs professional selama 1 detik
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Ambil teks lama, pecah per baris, bersihkan bullet points lama jika ada
    const lines = form.experiencePoints
      .split('\n')
      .map(l => l.replace(/^[-•*]\s*/, '').trim())
      .filter(l => l.length > 0);

    // Jika input kosong atau terlalu pendek, berikan rekomendasi struktur
    if (lines.length === 0) {
      setPolishingExp(false);
      return;
    }

    // Ubah kalimat biasa menjadi kalimat berbobot tinggi (Action Verbs)
    const polishedLines = lines.map(line => {
      const lower = line.toLowerCase();
      if (lower.includes('buat') || lower.includes('bikin') || lower.includes('membangun')) {
        return "• Merancang dan mengonstruksi arsitektur sistem utama guna mengoptimalkan performa operasional.";
      }
      if (lower.includes('jual') || lower.includes('sales') || lower.includes('narget')) {
        return "• Mengakselerasi pertumbuhan volume penjualan secara signifikan melalui strategi penetrasi pasar yang agresif.";
      }
      if (lower.includes('ngajar') || lower.includes('guru') || lower.includes('didik')) {
        return "• Mengorkestrasikan program pembelajaran interaktif yang terbukti meningkatkan retensi pemahaman siswa.";
      }
      if (lower.includes('urus') || lower.includes('kelola') || lower.includes('bantu')) {
        return `• Memanifestasikan manajemen pengelolaan efisiensi tinggi pada aspek: ${line}.`;
      }
      // Jika tidak ada keyword khusus, dipolish jadi format ATS action verb formal
      return `• Mengintegrasikan pendekatan terukur untuk memaksimalkan hasil eksekusi pada bagian: ${line}.`;
    });

    updateForm({ experiencePoints: polishedLines.join('\n') });
    setPolishingExp(false);
  };


  // ==========================================
  // LOGIKA DINAMIS PLACEHOLDER BERBAGAI MACAM PROFESI
  // ==========================================
  const getDynamicPlaceholders = (jobTitle: string) => {
    const title = (jobTitle || '').toLowerCase();

    if (title.includes('guru') || title.includes('teach') || title.includes('dosen') || title.includes('pendidik')) {
      return {
        technical: "Contoh: Kurikulum Merdeka, Manajemen Kelas, Pembuatan Modul Ajar, Google Classroom, Canva for Education...",
        soft: "Contoh: Empati, Komunikasi Publik, Kesabaran, Manajemen Waktu, Problem Solving...",
        achievements: "Juara 1 Guru Berprestasi Tingkat Provinsi 2024\nSertifikasi Pendidik Kemendikbud 2023",
        expPlaceholder: "Jelaskan pengalaman mengajarmu.\n\nContoh:\n- Menyusun modul ajar Kurikulum Merdeka untuk 30+ siswa\n- Meningkatkan nilai rata-rata ujian matematika siswa sebesar 15%\n- Mengelola kegiatan ekstrakurikuler pramuka"
      };
    }

    if (title.includes('sales') || title.includes('marketing') || title.includes('pemasaran') || title.includes('bisnis') || title.includes('admin') || title.includes('social media')) {
      return {
        technical: "Contoh: Negosiasi, B2B Marketing, Copywriting, Microsoft Excel, Google Analytics, CRM Tools, Cold Calling...",
        soft: "Contoh: Persuasi, Berorientasi Target, Komunikasi Interpersonal, Kerja Sama Tim, Berpikir Kritis...",
        achievements: "Mencapai Target Penjualan Tahunan Sebesar 120% di Tahun 2024\nBest Employee of the Month Q3 2023",
        expPlaceholder: "Jelaskan pengalaman sales/marketing-mu.\n\nContoh:\n- Meningkatkan penjualan produk retail sebesar 25% dalam 6 bulan\n- Membangun hubungan kemitraan baru dengan 15+ klien korporat\n- Mengelola budget iklan digital bulanan secara efisien"
      };
    }

    if (title.includes('akuntan') || title.includes('account') || title.includes('keuangan') || title.includes('finance') || title.includes('pajak')) {
      return {
        technical: "Contoh: Laporan Keuangan, Accurate Software, SAP, Pajak PPh 21/23/25, Audit internal, Analisis Anggaran...",
        soft: "Contoh: Detail-oriented (Teliti), Integritas, Analitis, Pemecahan Masalah, Manajemen Stress...",
        achievements: "Berhasil Memangkas Waktu Rekonsiliasi Bulanan Sebesar 3 Hari Kerja\nSertifikasi Brevet Pajak A & B",
        expPlaceholder: "Jelaskan pengalaman keuanganmu.\n\nContoh:\n- Menyusun laporan keuangan bulanan dan tahunan perusahaan secara akurat\n- Mengaudit pengeluaran operasional dan menghemat anggaran sebesar 10%\n- Mengurus pelaporan pajak masa badan via e-Faktur"
      };
    }

    return {
      technical: "JavaScript, TypeScript, React, Node.js, Go, PostgreSQL, Docker, AWS...",
      soft: "Kepemimpinan, Komunikasi, Problem Solving, Teamwork...",
      achievements: "Juara 1 Hackathon XYZ 2023\nGoogle Scholar 2022\nSpeaker di konferensi ABC",
      expPlaceholder: "Jelaskan pencapaian dan tanggung jawabmu. Tulis seadanya, lalu klik tombol '✨ AI Polish' di atas untuk mengubahnya jadi kalimat formal otomatis!\n\nContoh:\n- Membangun API menggunakan NodeJS\n- Membantu penjualan toko naik"
    };
  };

  const placeholders = getDynamicPlaceholders(form.jobTitle);

  const handleGenerate = async () => {
    setLoading(true)
    setError('')

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockAIResult = {
        profile: {
          name: form.name || "Harun",
          email: form.email || "akubisa@email.com",
          phone: form.phone || "+62 812 3456 7890",
          location: form.location || "Jakarta, Indonesia",
          jobTitle: form.jobTitle || "Software Engineer",
          summary: `Seorang ${form.jobTitle || 'Profesional'} berbakat yang berfokus pada efisiensi kerja tinggi. Memiliki latar belakang pendidikan yang kuat dari ${form.institution || 'institusi terkemuka'} dan rekam jejak yang solid di ${form.company || 'industri terkait'}. Sangat termotivasi untuk memberikan kontribusi nyata bagi perkembangan tim.`
        },
        education: [
          {
            institution: form.institution || "Universitas Terkemuka",
            degree: form.degree || "Sarjana",
            year: form.graduationYear || "2024",
            description: form.educationDesc || "Lulus dengan predikat sangat memuaskan dan aktif berorganisasi."
          }
        ],
        experience: [
          {
            company: form.company || "Perusahaan Inovatif",
            position: form.position || form.jobTitle || "Professional Staff",
            period: form.period || "2022 - Sekarang",
            points: form.experiencePoints 
              ? form.experiencePoints.split('\n').filter(p => p.trim() !== '')
              : [
                  "Memimpin pelaksanaan tugas utama dengan peningkatan efisiensi hingga 40%",
                  "Berkolaborasi dengan tim lintas divisi untuk menyelaraskan target operasional",
                  "Mengoptimalkan alur kerja harian dan memastikan produktivitas kerja yang maksimal"
                ]
          }
        ],
        skills: {
          technical: form.technicalSkills ? form.technicalSkills.split(',').map(s => s.trim()) : ["Keahlian Inti 1", "Keahlian Inti 2", "Alat Kerja 1", "Alat Kerja 2"],
          soft: form.softSkills ? form.softSkills.split(',').map(s => s.trim()) : ["Problem Solving", "Komunikasi", "Kerja Sama Tim"]
        },
        languages: form.languages ? form.languages.split(',').map(l => l.trim()) : ["Bahasa Indonesia (Native)", "Bahasa Inggris (Passive)"],
        achievements: form.achievements ? form.achievements.split('\n').filter(a => a.trim() !== '') : ["Pencapaian Profesional Terpilih"]
      }

      const newCV = {
        id: 'cv_' + Date.now(),
        formData: form,
        aiResult: mockAIResult,
        createdAt: new Date().toISOString(),
        templateColor: 'blue',
      }
      
      const existing = JSON.parse(localStorage.getItem('cv_list') || '[]')
      existing.unshift(newCV)
      localStorage.setItem('cv_list', JSON.stringify(existing))

      localStorage.removeItem(DRAFT_KEY)
      sessionStorage.setItem('cv_result', JSON.stringify(mockAIResult))
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
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
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

      {/* Main Layout dengan panel ATS Checker di sebelah kanan */}
      <div className="max-w-4xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        
        {/* Kolom Formulir Kiri (Mengambil 2/3 Space) */}
        <div className="md:col-span-2 space-y-6">
          {/* Steps indicator */}
          <div className="flex items-center gap-1 mb-4 overflow-x-auto pb-2">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
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
                      type="button"
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
                        placeholder="Harun"
                        value={form.name}
                        onChange={e => updateForm({ name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Posisi / Jabatan *</label>
                      <input
                        className={inputClass}
                        placeholder="Contoh: Guru Matematika, Sales Manager, Akuntan..."
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
                        placeholder="akubisa@email.com"
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
                      placeholder="Universitas Indonesia / SMA IT HSI IDN"
                      value={form.institution}
                      onChange={e => updateForm({ institution: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Jurusan / Program Studi *</label>
                      <input
                        className={inputClass}
                        placeholder="Teknik Informatika / IPS / Sastra"
                        value={form.degree}
                        onChange={e => updateForm({ degree: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Tahun Lulus</label>
                      <input
                        className={inputClass}
                        placeholder="2024"
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
                      placeholder="IPK 3.8/4.0, Aktif di organisasi OSIS, Lulus dengan predikat sangat memuaskan..."
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
                        placeholder="PT Perusahaan Sukses Bersama"
                        value={form.company}
                        onChange={e => updateForm({ company: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Posisi *</label>
                      <input
                        className={inputClass}
                        placeholder="Sesuaikan posisi kerjamu"
                        value={form.position}
                        onChange={e => updateForm({ position: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Periode Kerja</label>
                    <input
                      className={inputClass}
                      placeholder="Jan 2022 – Des 2023 / Sekarang"
                      value={form.period}
                      onChange={e => updateForm({ period: e.target.value })}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-sm font-medium text-gray-300">Pencapaian & Tanggung Jawab</label>
                      
                      {/* === BUTTON AI POLISH KITA DISINI === */}
                      <button
                        type="button"
                        onClick={handleAIPolishExperience}
                        disabled={polishingExp || !form.experiencePoints}
                        className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-lg border border-violet-400/20 transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {polishingExp ? (
                          <>
                            <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Meningkatkan kalimat...
                          </>
                        ) : (
                          <>
                            <span>✨</span> AI Polish (Action Verbs)
                          </>
                        )}
                      </button>
                    </div>
                    <textarea
                      className={inputClass}
                      rows={6}
                      placeholder={placeholders.expPlaceholder}
                      value={form.experiencePoints}
                      onChange={e => updateForm({ experiencePoints: e.target.value })}
                    />
                  </div>

                  {/* Additional experiences */}
                  {form.experiences && form.experiences.map((exp, idx) => (
                    <div key={idx} className="p-4 bg-gray-800 rounded-xl border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-gray-400">Pengalaman {idx + 2}</h4>
                        <button
                          type="button"
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
                        placeholder="Jelaskan pencapaian singkat..."
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
                    type="button"
                    onClick={() => updateForm({
                      experiences: [...(form.experiences || []), { company: '', position: '', period: '', points: '' }]
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
                    <label className={labelClass}>Technical Skills / Keahlian Utama</label>
                    <textarea
                      className={inputClass}
                      rows={3}
                      placeholder={placeholders.technical}
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
                      placeholder={placeholders.soft}
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
                      placeholder={placeholders.achievements}
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
                  type="button"
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
                      <span className="text-xl">✨</span>
                      Generate CV dengan AI
                    </>
                  )}
                </button>

                {loading && (
                  <p className="text-xs text-gray-500 mt-3">
                    Usually takes 10-20 seconds...
                  </p>
                )}
              </div>
            )}

            {/* Navigation */}
            {step < 4 && (
              <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
                <button
                  type="button"
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
                  type="button"
                  onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-all"
                >
                  {step === 3 ? 'Lanjut ke Generate →' : 'Selanjutnya →'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ==========================================
            KOLOM KANAN: PANEL ATS SCORE CHECKER LIVE
           ========================================== */}
        <div className="bg-gray-900 rounded-2xl border border-white/10 p-5 sticky top-24 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="font-bold text-sm text-gray-200 tracking-wide flex items-center gap-1.5">
              📊 ATS Optimization Score
            </h3>
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
              atsScoreData.score >= 80 ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
              atsScoreData.score >= 50 ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
              'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
              {atsScoreData.score >= 80 ? 'Excellent' : atsScoreData.score >= 50 ? 'Good' : 'Weak'}
            </span>
          </div>

          {/* Progress Bar & Persentase */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {atsScoreData.score}<span className="text-sm font-normal text-gray-500">/100</span>
              </span>
            </div>
            <div className="w-full bg-gray-800 h-2.5 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ease-out ${
                  atsScoreData.score >= 80 ? 'bg-gradient-to-r from-emerald-500 to-green-400' :
                  atsScoreData.score >= 50 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' :
                  'bg-gradient-to-r from-red-500 to-rose-400'
                }`}
                style={{ width: `${atsScoreData.score}%` }}
              />
            </div>
          </div>

          {/* AI Live Tips Box */}
          <div className="p-3.5 bg-gray-950 rounded-xl border border-white/5 space-y-1.5">
            <span className="text-[11px] uppercase tracking-wider font-bold text-blue-400 block">
              💡 AI Live Suggestion:
            </span>
            <p className="text-xs text-gray-400 leading-relaxed">
              {atsScoreData.currentTip}
            </p>
          </div>
          
          <p className="text-[10px] text-gray-500 text-center leading-normal">
            Skor dihitung secara real-time berdasarkan struktur parsing dokumen standar ATS.
          </p>
        </div>

      </div>
    </div>
  )
}




{/* Actions */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
            <h3 className="font-bold text-gray-700 mb-2 text-sm">Aksi</h3>

            <button
              onClick={handleDownloadPDF}
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-all"
            >
              📄 Download PDF
            </button>

            <button
              onClick={handleCreatePortfolio}
              disabled={portfolioLoading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl text-sm transition-all disabled:opacity-60"
            >
              {portfolioLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Membuat...
                </>
              ) : (
                '🌐 Buat Halaman Portofolio'
              )}
            </button>

            <button
              onClick={() => navigate('/create')}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-all"
            >
              🔄 Generate Ulang
            </button>
          </div>