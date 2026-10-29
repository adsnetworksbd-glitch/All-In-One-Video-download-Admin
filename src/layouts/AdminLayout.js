import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
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
export const AdminLayout = () => {
    const { adminProfile, signOut } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    return (_jsxs("div", { className: "min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row", children: [_jsxs("header", { className: "md:hidden h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between sticky top-0 z-40", children: [_jsx("button", { onClick: () => setMobileOpen(!mobileOpen), className: "p-1.5 rounded-lg bg-slate-800 text-slate-200", children: mobileOpen ? _jsx(X, { className: "w-5 h-5" }) : _jsx(Menu, { className: "w-5 h-5" }) }), _jsx("span", { className: "font-bold text-sm text-white", children: "Downloader Admin" }), _jsx("span", { className: "text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-400 uppercase", children: adminProfile?.role })] }), _jsxs("aside", { className: `fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col justify-between transform transition-transform md:translate-x-0 md:static ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`, children: [_jsxs("div", { children: [_jsxs("div", { className: "font-bold text-lg text-white mb-6 flex items-center space-x-2", children: [_jsx("div", { className: "w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center font-bold text-xs", children: "DL" }), _jsx("span", { children: "Admin Center" })] }), _jsx("nav", { className: "space-y-1", children: NAV.map((item) => (_jsxs(NavLink, { to: item.path, onClick: () => setMobileOpen(false), className: ({ isActive }) => `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${isActive ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`, children: [_jsx(item.icon, { className: "w-4 h-4" }), _jsx("span", { children: item.name })] }, item.path))) })] }), _jsxs("div", { className: "pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400", children: [_jsx("span", { className: "truncate mr-2 font-mono", children: adminProfile?.email }), _jsx("button", { onClick: signOut, className: "p-1.5 hover:text-red-400", title: "Sign Out", children: _jsx(LogOut, { className: "w-4 h-4" }) })] })] }), _jsx("main", { className: "flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full", children: _jsx(Outlet, {}) })] }));
};
