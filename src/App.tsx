import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLayout } from './layouts/AdminLayout';
import { LoginPage } from './pages/Login/LoginPage';
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { CategoryManagerPage } from './pages/Categories/CategoryManagerPage';
import { ProviderManagerPage } from './pages/Providers/ProviderManagerPage';
import { UserManagerPage } from './pages/Users/UserManagerPage';
import { DownloadMonitorPage } from './pages/Downloads/DownloadMonitorPage';
import { QualityPricingPage } from './pages/QualityPricing/QualityPricingPage';
import { ReferralSettingsPage } from './pages/Referrals/ReferralSettingsPage';
import { BotSettingsPage } from './pages/BotSettings/BotSettingsPage';
import { BroadcastManagerPage } from './pages/Broadcast/BroadcastManagerPage';
import { AuditLogsPage } from './pages/Security/AuditLogsPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/categories" element={<CategoryManagerPage />} />
              <Route path="/providers" element={<ProviderManagerPage />} />
              <Route path="/users" element={<UserManagerPage />} />
              <Route path="/downloads" element={<DownloadMonitorPage />} />
              <Route path="/pricing" element={<QualityPricingPage />} />
              <Route path="/referrals" element={<ReferralSettingsPage />} />
              <Route path="/settings" element={<BotSettingsPage />} />
              <Route path="/broadcast" element={<BroadcastManagerPage />} />
              <Route path="/security" element={<AuditLogsPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;