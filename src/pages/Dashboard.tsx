import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'
import type { SavedCV } from '../types/cv'

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [cvs, setCVs] = useState<SavedCV[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return navigate('/sign-in', { replace: true })
      setUser(session.user)

      const { data } = await supabase
        .from('cvs')
        .select('*')
        .order('created_at', { ascending: false })

      setCVs(data || [])
      setLoading(false)
    }
    init()
  }, [navigate])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/sign-in', { replace: true })
  }

  const avatarUrl = user?.user_metadata?.avatar_url
  const displayName = user?.user_metadata?.full_name || user?.email || 'Pengguna'
  const firstName = displayName.split(' ')[0]

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📄</span>
            <span className="font-bold text-gray-800">CVCraft AI</span>
          </div>
          <div className="flex items-center gap-3">
            {avatarUrl && (
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
              />
            )}
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-red-500 font-medium transition-colors"
            >
              Keluar
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Greeting */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-6">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                {firstName[0]?.toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Halo, {firstName}! 👋
              </h1>
              <p className="text-gray-500 text-sm mt-0.5">
                {cvs.length > 0
                  ? `Kamu sudah membuat ${cvs.length} CV`
                  : 'Belum ada CV yang dibuat'}
              </p>
            </div>
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
        <div>
          <h2 className="text-lg font-bold text-gray-700 mb-4">CV Saya</h2>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : cvs.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-lg font-bold text-gray-700 mb-2">Belum ada CV</h3>
              <p className="text-gray-400 text-sm mb-6">Yuk buat CV pertama kamu!</p>
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
                <div key={cv.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                      <span className="text-xl">📄</span>
                    </div>
                    <span className="text-xs text-gray-400">{formatDate(cv.created_at)}</span>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-0.5">
                    {cv.ai_result?.profile?.name || cv.form_data?.name || 'CV'}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {cv.ai_result?.profile?.jobTitle || cv.form_data?.jobTitle || ''}
                  </p>
                  <button
                    onClick={() => {
                      // Store CV data and navigate to result
                      sessionStorage.setItem('cv_result', JSON.stringify(cv.ai_result))
                      navigate('/result')
                    }}
                    className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700 py-2 border border-blue-100 hover:border-blue-200 rounded-xl transition-colors"
                  >
                    Lihat CV →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
