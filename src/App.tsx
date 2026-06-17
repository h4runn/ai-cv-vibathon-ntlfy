import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import CreateCV from './pages/CreateCV'
import Result from './pages/Result'
import Portfolio from './pages/Portfolio'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create" element={<CreateCV />} />
        <Route path="/result" element={<Result />} />
        <Route path="/portfolio/:slug" element={<Portfolio />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
