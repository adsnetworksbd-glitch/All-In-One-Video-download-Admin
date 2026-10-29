import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Layers, Cpu, Users, DownloadCloud, Coins, Share2, Settings, ShieldCheck, Send, LogOut, Menu, X } from 'lucide-react';

const NAV = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Categories', path: '/categories', icon: Layers },
  { name: 'API Providers', path: '/providers', icon: Cpu },
  { name: 'Users', path: '/users', icon: Users },
  { name: 'Downloads', path: '/downloads', icon: DownloadCloud },
  { name: 'Pricing', path: '/pricing', icon: Coins },
  { name: 'Referrals', path: '/referrals', icon: Share2 },
  { name: 'Settings', path: '/settings', icon: Settings },
  { name: 'Broadcast', path: '/broadcast', icon: Send },
  { name: 'Audit Logs', path: '/security', icon: ShieldCheck },
];

export const AdminLayout: React.FC = () => {
  const { adminProfile, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      <header className="md:hidden h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between sticky top-0 z-40">
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-1.5 rounded-lg bg-slate-800 text-slate-200">
          {mobileOpen ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
        </button>
        <span className="font-bold text-sm text-white">Downloader Admin</span>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-400 uppercase">{adminProfile?.role}</span>
      </header>

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col justify-between transform transition-transform md:translate-x-0 md:static ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div>
          <div className="font-bold text-lg text-white mb-6 flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center font-bold text-xs">DL</div>
            <span>Admin Center</span>
          </div>
          <nav className="space-y-1">
            {NAV.map((item) => (
              <NavLink key={item.path} to={item.path} onClick={() => setMobileOpen(false)} className={({ isActive }) => `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${isActive ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                <item.icon className="w-4 h-4"/><span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
          <span className="truncate mr-2 font-mono">{adminProfile?.email}</span>
          <button onClick={signOut} className="p-1.5 hover:text-red-400" title="Sign Out"><LogOut className="w-4 h-4"/></button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full"><Outlet /></main>
    </div>
  );
};