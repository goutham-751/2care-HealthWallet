import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';
import LandingPage from './pages/LandingPage/LandingPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import ReportsListPage from './pages/Reports/ReportsListPage';
import ReportDetailPage from './pages/Reports/ReportDetailPage';
import UploadReportPage from './pages/Reports/UploadReportPage';
import VitalsPage from './pages/Vitals/VitalsPage';
import SharedWithMePage from './pages/Shared/SharedWithMePage';
import ProfilePage from './pages/Profile/ProfilePage';
import './App.css';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh'}}><div className="spinner spinner-lg"></div></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/reports" element={<ReportsListPage />} />
        <Route path="/reports/upload" element={<UploadReportPage />} />
        <Route path="/reports/:id" element={<ReportDetailPage />} />
        <Route path="/vitals" element={<VitalsPage />} />
        <Route path="/shared" element={<SharedWithMePage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
