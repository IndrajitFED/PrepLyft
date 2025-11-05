import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import CandidateDashboard from './pages/CandidateDashboard'
import MentorDashboard from './pages/MentorDashboard'
import AdminDashboard from './pages/AdminDashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import BookingPage from './pages/BookingPage'
import SessionPage from './pages/SessionPage'
import CompanySheets from './pages/CompanySheets'
import FrontendSheets from './pages/FrontendSheets'
import FrontendSolutionPage from './pages/FrontendSolutionPage'
import Leaderboard from './pages/Leaderboard'
import ContactUs from './pages/ContactUs'
import TermsAndConditions from './pages/TermsAndConditions'
import ShippingPolicy from './pages/ShippingPolicy'
import CancellationAndRefunds from './pages/CancellationAndRefunds'
import PrivacyPolicy from './pages/PrivacyPolicy'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Public Policy Pages */}
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/shipping" element={<ShippingPolicy />} />
          <Route path="/cancellation" element={<CancellationAndRefunds />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <CandidateDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/mentor" element={
            <ProtectedRoute>
              <MentorDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/book" element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          } />
          
          <Route path="/session/:id" element={
            <ProtectedRoute>
              <SessionPage />
            </ProtectedRoute>
          } />
          
          <Route path="/company-sheets-dsa" element={
            <ProtectedRoute>
              <CompanySheets />
            </ProtectedRoute>
          } />
          
                  <Route path="/company-sheets-frontend" element={
                    <ProtectedRoute>
                      <FrontendSheets />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/company-sheets-frontend/:topicId" element={
                    <ProtectedRoute>
                      <FrontendSheets />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/company-sheets-frontend/:topicId/:questionId" element={
                    <ProtectedRoute>
                      <FrontendSolutionPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/leaderboard" element={
                    <ProtectedRoute>
                      <Leaderboard />
                    </ProtectedRoute>
                  } />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App 