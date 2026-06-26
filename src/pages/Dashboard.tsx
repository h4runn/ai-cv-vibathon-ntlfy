import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FileText, Plus, Eye, Pencil, Trash2, Sparkles } from 'lucide-react'
import type { LocalCV } from '../types/cv'

const CV_LIST_KEY = 'cv_list'
const DRAFT_KEY = 'cv_form_draft'

export default function Dashboard() {
  const navigate = useNavigate()
  const [cvs, setCVs] = useState<LocalCV[]>([])

  useEffect(() => {
    const raw = localStorage.getItem(CV_LIST_KEY)
    if (raw) {
      try {
        setCVs(JSON.parse(raw))
      } catch {}
    }
  }, [])

  const handleView = (cv: LocalCV) => {
    sessionStorage.setItem('cv_result', JSON.stringify(cv.aiResult))
    localStorage.setItem('cv_current_id', cv.id)
    navigate('/result')
  }

  const handleEdit = (cv: LocalCV) => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(cv.formData))
    localStorage.setItem('cv_edit_id', cv.id)
    navigate('/create')
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus CV ini?')) {
      const updated = cvs.filter((cv) => cv.id !== id)
      setCVs(updated)
      localStorage.setItem(CV_LIST_KEY, JSON.stringify(updated))
    }
  }

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-40" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-lg block leading-none">CVCraft AI</span>
              <span className="text-xs text-slate-500 font-medium">Dashboard</span>
            </div>
          </Link>
          <Link
            to="/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-purple-500/30 hover:shadow-xl hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            Buat CV Baru
          </Link>
        </div>
      </header>

      <div className="relative max-w-7xl mx-auto px-6 py-12">
        {/* Stats & Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
            <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Your Portfolio</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-4xl font-black text-slate-900 mb-2">CV Collection</h1>
              <p className="text-slate-600 font-medium">
                {cvs.length > 0
                  ? `${cvs.length} CV profesional tersimpan`
                  : 'Mulai buat CV pertama Anda'}
              </p>
            </div>
            {cvs.length > 0 && (
              <Link
                to="/create"
                className="hidden md:inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-lg shadow-slate-900/20 hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4" />
                Generate dengan AI
              </Link>
            )}
          </div>
        </div>

        {/* CV Grid */}
        {cvs.length === 0 ? (
          <div className="text-center py-24 bg-white/60 backdrop-blur rounded-3xl border border-slate-200/60 shadow-xl">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center mx-auto mb-6">
              <FileText className="w-12 h-12 text-purple-600" strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Belum ada CV</h3>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              Mulai perjalanan karir Anda dengan membuat CV profesional pertama menggunakan AI
            </p>
            <Link
              to="/create"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-500/30 hover:shadow-xl hover:-translate-y-0.5"
            >
              <Sparkles className="w-5 h-5" />
              Buat CV Sekarang
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cvs.map((cv) => (
              <div
                key={cv.id}
                className="group bg-white/60 backdrop-blur rounded-2xl border border-slate-200/60 p-6 hover:shadow-xl hover:border-slate-300/60 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="w-7 h-7 text-purple-600" strokeWidth={2} />
                  </div>
                  <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
                    {formatDate(cv.createdAt)}
                  </span>
                </div>

                {/* Content */}
                <h3 className="font-bold text-slate-900 text-lg mb-1 line-clamp-1">
                  {cv.aiResult?.profile?.name || cv.formData?.name || 'Untitled CV'}
                </h3>
                <p className="text-sm text-slate-500 mb-6 line-clamp-2 min-h-[40px]">
                  {cv.aiResult?.profile?.jobTitle || cv.formData?.jobTitle || 'No job title'}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleView(cv)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold rounded-xl text-sm transition-colors border border-purple-200/60"
                    title="Lihat CV"
                  >
                    <Eye className="w-4 h-4" strokeWidth={2.5} />
                    Lihat
                  </button>
                  <button
                    onClick={() => handleEdit(cv)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-xl text-sm transition-colors border border-blue-200/60"
                    title="Edit CV"
                  >
                    <Pencil className="w-4 h-4" strokeWidth={2.5} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cv.id)}
                    className="px-3 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors border border-red-200/60"
                    title="Hapus CV"
                  >
                    <Trash2 className="w-4 h-4" strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer CTA */}
        {cvs.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              to="/create"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-500/30 hover:shadow-xl hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" strokeWidth={2.5} />
              Buat CV Baru dengan AI
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
