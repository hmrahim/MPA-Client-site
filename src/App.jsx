import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import CursorGlow from './components/effects/CursorGlow'
import ScrollProgress from './components/effects/ScrollProgress'
import Confetti from './components/effects/Confetti'
import { LanguageProvider } from './context/LanguageContext'
import SchoolBackgroundAnimation from './components/SchoolBackgroundAnimation'

// Page Components
import HomePage from './pages/HomePage'
import NoticesPage from './pages/NoticesPage'
import ResultsPage from './pages/ResultsPage'
import ToppersPage from './pages/ToppersPage'
import AcademicsPage from './pages/AcademicsPage'
import EventsPage from './pages/EventsPage'
import TeachersPage from './pages/TeachersPage'
import AdmissionPage from './pages/AdmissionPage'
import ContactPage from './pages/ContactPage'
import DashboardPage from './pages/DashboardPage'
import StudentPortalApp from './student-portal/StudentPortalApp'

function AppContent() {
  const location = useLocation()
  const isDashboard = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin') || location.pathname.startsWith('/student-dashboard')

  return (
    <>
      <ScrollToTop />

      {!isDashboard && (
        <>
          <CursorGlow />
          <ScrollProgress />
          <SchoolBackgroundAnimation />
          <Header />
        </>
      )}

      <main className={isDashboard ? 'min-h-screen' : 'min-h-[80vh]'}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/*" element={<DashboardPage />} />
          <Route path="/admin" element={<Navigate to="/dashboard" replace />} />
          <Route path="/notices" element={<NoticesPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/toppers" element={<ToppersPage />} />
          <Route path="/academics" element={<AcademicsPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/teachers" element={<TeachersPage />} />
          <Route path="/admission" element={<AdmissionPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/student-portal" element={<Navigate to="/student-dashboard" replace />} />
          <Route path="/student-dashboard" element={<StudentPortalApp />} />
          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isDashboard && (
        <>
          <Footer />
          <Confetti />
        </>
      )}
    </>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </LanguageProvider>
  )
}
