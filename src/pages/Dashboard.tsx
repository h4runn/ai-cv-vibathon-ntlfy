import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
    // Load form data ke localStorage sebagai draft
    localStorage.setItem(DRAFT_KEY, JSON.stringify(cv.formData))
    // Set ID untuk tracking edit mode
    localStorage.setItem('cv_edit_id', cv.id)
    // Navigate ke CreateCV
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
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl">📄</span>
            <span className="font-bold text-gray-800">CVCraft AI</span>
          </Link>
          <Link
            to="/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-all"
          >
            Buat CV
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Heading */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">CV Kamu 📄</h1>
            <p className="text-gray-500 text-sm mt-1">
              {cvs.length > 0
                ? `${cvs.length} CV tersimpan di browser ini`
                : 'Belum ada CV yang tersimpan'}
            </p>
          </div>
          <Link
            to="/create"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/20 hover:-translate-y-0.5"
          >
            <span className="text-lg">✨</span>
            Buat CV Baru
          </Link>
        </div>

        {/* CV List */}
        {cvs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-bold text-gray-700 mb-2">Belum ada CV</h3>
            <p className="text-gray-400 text-sm mb-6">Yuk buat yang pertama!</p>
            <Link
              to="/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all text-sm"
            >
              ✨ Buat Sekarang
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cvs.map((cv) => (
              <div
                key={cv.id}
                className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <span className="text-xl">📄</span>
                  </div>
                  <span className="text-xs text-gray-400">{formatDate(cv.createdAt)}</span>
                </div>
                <h3 className="font-bold text-gray-800 mb-0.5">
                  {cv.aiResult?.profile?.name || cv.formData?.name || 'CV'}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {cv.aiResult?.profile?.jobTitle || cv.formData?.jobTitle || ''}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleView(cv)}
                    className="flex-1 text-center text-sm font-medium text-blue-600 hover:text-blue-700 py-2 border border-blue-100 hover:border-blue-200 rounded-xl transition-colors"
                  >
                    Lihat →
                  </button>
                  <button
                    onClick={() => handleEdit(cv)}
                    className="flex-1 text-center text-sm font-medium text-green-600 hover:text-green-700 py-2 border border-green-100 hover:border-green-200 rounded-xl transition-colors"
                    title="Edit CV"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cv.id)}
                    className="px-3 py-2 text-sm text-red-400 hover:text-red-500 border border-red-100 hover:border-red-200 rounded-xl transition-colors"
                    title="Hapus CV"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
