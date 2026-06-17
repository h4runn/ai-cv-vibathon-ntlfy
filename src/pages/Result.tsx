import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { CVData, CVTemplate } from '../types/cv'
import CVPreview from '../components/CVPreview'

const TEMPLATES: { id: CVTemplate; label: string; color: string; bg: string }[] = [
  { id: 'blue', label: 'Biru Profesional', color: '#4F6EF7', bg: 'bg-blue-600' },
  { id: 'green', label: 'Hijau Modern', color: '#10B981', bg: 'bg-emerald-500' },
  { id: 'minimal', label: 'Minimal Elegan', color: '#374151', bg: 'bg-gray-700' },
]

export default function Result() {
  const navigate = useNavigate()
  const [cvData, setCVData] = useState<CVData | null>(null)
  const [template, setTemplate] = useState<CVTemplate>('blue')
  const [portfolioLoading, setPortfolioLoading] = useState(false)
  const [portfolioUrl, setPortfolioUrl] = useState('')
  const [portfolioModal, setPortfolioModal] = useState(false)
  const [copyDone, setCopyDone] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem('cv_result')
    if (!stored) {
      navigate('/dashboard')
      return
    }
    try {
      setCVData(JSON.parse(stored))
    } catch {
      navigate('/dashboard')
    }
  }, [navigate])

  const handleDownloadPDF = () => {
    window.print()
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .trim()
      .replace(/\s+/g, '-')
  }

  const handleCreatePortfolio = async () => {
    if (!cvData) return
    setPortfolioLoading(true)

    try {
      const baseSlug = generateSlug(cvData.profile.name || 'pengguna')

      // Check for existing slug and increment if needed
      let slug = baseSlug
      let counter = 1
      while (true) {
        const { data: existing } = await supabase
          .from('portfolios')
          .select('id')
          .eq('slug', slug)
          .maybeSingle()

        if (!existing) break
        counter++
        slug = `${baseSlug}-${counter}`
      }

      const { error } = await supabase.from('portfolios').insert({
        slug,
        cv_data: cvData,
      })

      if (error) throw error

      const url = `${window.location.origin}/portfolio/${slug}`
      setPortfolioUrl(url)
      setPortfolioModal(true)
    } catch (err) {
      console.error(err)
      alert('Gagal membuat portofolio. Coba lagi.')
    } finally {
      setPortfolioLoading(false)
    }
  }

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(portfolioUrl)
    setCopyDone(true)
    setTimeout(() => setCopyDone(false), 2000)
  }

  if (!cvData) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header no-print */}
      <header className="no-print bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>📄</span>
            <span className="font-bold text-gray-800">CVCraft AI</span>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm text-gray-500 hover:text-gray-700 font-medium"
          >
            ← Dashboard
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        {/* Left Panel — Controls */}
        <div className="no-print w-72 shrink-0 space-y-4">
          {/* Template Selector */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-bold text-gray-700 mb-4 text-sm">Pilih Template</h3>
            <div className="space-y-2">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                    template === t.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full ${t.bg} shadow-sm`} />
                  <span className="text-sm font-medium text-gray-700">{t.label}</span>
                  {template === t.id && <span className="ml-auto text-blue-500 text-xs">✓</span>}
                </button>
              ))}
            </div>
          </div>

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

          {/* CV Info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-bold text-gray-700 mb-3 text-sm">Info CV</h3>
            <div className="space-y-1.5 text-sm text-gray-500">
              <p><span className="font-medium text-gray-700">Nama:</span> {cvData.profile.name}</p>
              <p><span className="font-medium text-gray-700">Posisi:</span> {cvData.profile.jobTitle}</p>
              <p><span className="font-medium text-gray-700">Email:</span> {cvData.profile.email}</p>
            </div>
          </div>
        </div>

        {/* Right Panel — CV Preview */}
        <div className="flex-1 flex justify-center">
          <CVPreview data={cvData} template={template} />
        </div>
      </div>

      {/* Portfolio Modal */}
      {portfolioModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">✅</div>
              <h3 className="text-xl font-bold text-gray-800">Portofolio Siap!</h3>
              <p className="text-gray-500 text-sm mt-1">Halaman portofolio kamu sudah live</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 mb-4 flex items-center gap-2">
              <span className="text-sm text-gray-600 flex-1 truncate font-mono">{portfolioUrl}</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCopyLink}
                className="flex-1 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-all"
              >
                {copyDone ? '✓ Tersalin!' : '📋 Copy Link'}
              </button>
              <a
                href={portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl text-sm text-center transition-all"
              >
                Buka Portofolio →
              </a>
            </div>

            <button
              onClick={() => setPortfolioModal(false)}
              className="w-full mt-3 text-sm text-gray-400 hover:text-gray-600"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
