import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, ShieldAlert } from 'lucide-react';

export const ProtectedRoute: React.FC = () => {
  const { currentUser, isAuthorizedAdmin, isLoading, signOut } = useAuth();
  if (isLoading) return <div className="h-screen flex items-center justify-center bg-slate-950 text-white"><Loader2 className="animate-spin w-8 h-8"/></div>;
  if (!currentUser) return <Navigate to="/login" replace />;
  if (!isAuthorizedAdmin) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-4 text-center">
      <ShieldAlert className="w-12 h-12 text-red-500 mb-2"/>
      <h1 className="text-xl font-bold">Unauthorized Administrator</h1>
      <p className="text-sm text-slate-400 mt-1 max-w-sm">Your account UID is not configured in /admins.</p>
      <button onClick={signOut} className="mt-4 px-4 py-2 bg-slate-800 rounded-xl text-sm">Sign Out</button>
    </div>
  );
  return <Outlet />;
};