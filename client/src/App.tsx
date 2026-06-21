import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ResumeProvider } from './context/ResumeContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ResumeBuilderPage from './pages/ResumeBuilderPage';
import ATSAnalyzerPage from './pages/ATSAnalyzerPage';
import JobMatcherPage from './pages/JobMatcherPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ResumeProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes with sidebar layout */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/builder" element={<ResumeBuilderPage />} />
              <Route path="/builder/new" element={<ResumeBuilderPage />} />
              <Route path="/builder/:id" element={<ResumeBuilderPage />} />
              <Route path="/ats-analyzer" element={<ATSAnalyzerPage />} />
              <Route path="/job-matcher" element={<JobMatcherPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </ResumeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
