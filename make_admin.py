import os

files = {
    "package.json": """{
  "name": "downloader-admin-panel",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "firebase": "^10.14.1",
    "lucide-react": "^0.475.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.28.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.15",
    "typescript": "^5.6.3",
    "vite": "^5.4.11"
  }
}
""",

    "vite.config.ts": """import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  server: { port: 3000 }
});
""",

    "tsconfig.json": """{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "jsx": "react-jsx",
    "strict": true
  },
  "include": ["src"]
}
""",

    "tailwind.config.js": """/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: { brand: { 500: '#0ea5e9', 600: '#0284c7' } }
    }
  },
  plugins: []
}
""",

    "postcss.config.js": """export default {
  plugins: { tailwindcss: {}, autoprefixer: {} }
}
""",

    "index.html": """<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Downloader Bot Admin Panel</title>
  </head>
  <body class="bg-slate-950 text-slate-100">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
""",

    ".env.example": """VITE_FIREBASE_API_KEY=AIzaSyAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
""",

    ".gitignore": """node_modules
dist
dist-ssr
*.local
.env
.DS_Store
""",

    "database.rules.json": """{
  "rules": {
    ".read": false,
    ".write": false,
    "admins": {
      "$admin_uid": {
        ".read": "auth != null",
        ".write": "auth != null && root.child('admins').child(auth.uid).child('role').val() === 'superadmin'"
      }
    },
    "categories": { ".read": "auth != null", ".write": "auth != null" },
    "api_providers": { ".read": "auth != null", ".write": "auth != null" },
    "bot_settings": { ".read": "auth != null", ".write": "auth != null" },
    "users": { ".read": "auth != null", ".write": "auth != null" },
    "download_jobs": { ".read": "auth != null", ".write": "auth != null" },
    "credit_transactions": { ".read": "auth != null", ".write": "auth != null" },
    "audit_logs": { ".read": "auth != null", ".write": "auth != null" },
    "broadcast_tasks": { ".read": "auth != null", ".write": "auth != null" }
  }
}
""",

    "src/index.css": """@tailwind base;
@tailwind components;
@tailwind utilities;
body { margin: 0; background-color: #020617; color: #f8fafc; font-family: sans-serif; }
""",

    "src/types/index.ts": """export interface AdminUser {
  uid: string;
  email: string;
  role: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  is_active: boolean;
  display_order: number;
}

export interface ApiProvider {
  id: string;
  name: string;
  adapter_type: 'builtin' | 'http_api';
  is_enabled: boolean;
  supported_platforms: string[];
  config: {
    endpoint_url?: string;
    http_method?: 'GET' | 'POST';
    headers?: Record<string, string>;
    timeout_seconds: number;
    response_mapping?: { direct_url_path: string; title_path?: string };
  };
  last_health_check?: { status: 'healthy' | 'degraded' | 'down'; message?: string };
}

export interface TelegramUser {
  telegram_id: number;
  first_name: string;
  username?: string | null;
  credit_balance: number;
  is_banned: boolean;
  referred_by?: number | null;
  created_at: number;
}

export interface DownloadJob {
  job_id: string;
  telegram_user_id: number;
  category_slug: string;
  sanitized_url: string;
  selected_quality?: string;
  credit_cost: number;
  status: string;
  result?: { title?: string; download_url?: string };
  error?: { code: string; message: string };
  created_at: number;
}
""",

    "src/services/firebase.ts": """import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKey",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "localhost",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://dummy-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "dummy",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const rtdb = getDatabase(app);
export default app;
""",

    "src/services/auditService.ts": """import { ref, push, set } from 'firebase/database';
import { rtdb } from './firebase';

export const logAdminAction = async (actorId: string, actorEmail: string, action: string, targetId: string, details: Record<string, any>) => {
  try {
    const newRef = push(ref(rtdb, 'audit_logs'));
    await set(newRef, { log_id: newRef.key, actor_id: actorId, actor_email: actorEmail, action, target_id: targetId, details, timestamp: Date.now() });
  } catch (e) { console.error('Audit failed', e); }
};
""",

    "src/contexts/AuthContext.tsx": """import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut as fbSignOut } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { auth, rtdb } from '../services/firebase';
import { AdminUser } from '../types';

interface AuthContextType {
  currentUser: User | null;
  adminProfile: AdminUser | null;
  isLoading: boolean;
  isAuthorizedAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null, adminProfile: null, isLoading: true, isAuthorizedAdmin: false, signOut: async () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorizedAdmin, setIsAuthorizedAdmin] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      setIsLoading(true);
      if (user) {
        setCurrentUser(user);
        try {
          const snap = await get(ref(rtdb, `admins/${user.uid}`));
          if (snap.exists()) {
            setAdminProfile({ uid: user.uid, email: user.email || '', role: snap.val().role || 'admin' });
            setIsAuthorizedAdmin(true);
          } else {
            setIsAuthorizedAdmin(false);
          }
        } catch { setIsAuthorizedAdmin(false); }
      } else {
        setCurrentUser(null);
        setIsAuthorizedAdmin(false);
      }
      setIsLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, adminProfile, isLoading, isAuthorizedAdmin, signOut: () => fbSignOut(auth) }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
""",

    "src/components/ProtectedRoute.tsx": """import React from 'react';
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
""",

    "src/layouts/AdminLayout.tsx": """import React, { useState } from 'react';
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
""",

    "src/pages/Login/LoginPage.tsx": """import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { ShieldCheck, Loader2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr('');
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigate('/');
    } catch (e: any) { setErr(e.message || 'Login failed.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-slate-950 p-4">
      <form onSubmit={handleLogin} className="w-full max-w-sm bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
        <div className="flex flex-col items-center mb-2">
          <ShieldCheck className="w-10 h-10 text-brand-500 mb-2"/>
          <h1 className="text-xl font-bold text-white">Administrator Sign In</h1>
          <p className="text-xs text-slate-400">Authorized personnel only</p>
        </div>
        {err && <div className="text-xs text-red-400 bg-red-500/10 p-2.5 rounded-xl border border-red-500/20">{err}</div>}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Email</label>
          <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Password</label>
          <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
        </div>
        <button type="submit" disabled={loading} className="w-full p-3 bg-brand-600 hover:bg-brand-500 rounded-xl font-semibold text-sm text-white flex justify-center active:scale-95 transition">
          {loading ? <Loader2 className="animate-spin w-4 h-4"/> : 'Sign In'}
        </button>
      </form>
    </div>
  );
};
""",

    "src/pages/Dashboard/DashboardPage.tsx": """import React, { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { rtdb } from '../../services/firebase';
import { Users, Layers, Cpu, DownloadCloud, Coins, RefreshCw } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState({ users: 0, jobs: 0, credits: 0, cats: 0 });
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    Promise.all([get(ref(rtdb, 'users')), get(ref(rtdb, 'download_jobs')), get(ref(rtdb, 'categories'))])
      .then(([u, j, c]) => {
        const usersList = u.exists() ? Object.values(u.val()) as any[] : [];
        const totalCr = usersList.reduce((acc, x) => acc + (x.credit_balance || 0), 0);
        setData({
          users: usersList.length,
          jobs: j.exists() ? Object.keys(j.val()).length : 0,
          credits: totalCr,
          cats: c.exists() ? Object.keys(c.val()).length : 0,
        });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">System Overview</h1>
          <p className="text-xs text-slate-400">Live statistics from Firebase Realtime Database</p>
        </div>
        <button onClick={loadData} className="px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-slate-300 flex items-center space-x-1.5 hover:bg-slate-700">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`}/><span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold"><span>Total Users</span><Users className="w-4 h-4 text-sky-400"/></div>
          <div className="text-2xl font-bold text-white mt-2">{data.users}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold"><span>Download Jobs</span><DownloadCloud className="w-4 h-4 text-indigo-400"/></div>
          <div className="text-2xl font-bold text-white mt-2">{data.jobs}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold"><span>Circulating Credits</span><Coins className="w-4 h-4 text-amber-400"/></div>
          <div className="text-2xl font-bold text-white mt-2">{data.credits}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold"><span>Active Platforms</span><Layers className="w-4 h-4 text-emerald-400"/></div>
          <div className="text-2xl font-bold text-white mt-2">{data.cats}</div>
        </div>
      </div>
    </div>
  );
};
""",

    "src/pages/Categories/CategoryManagerPage.tsx": """import React, { useEffect, useState } from 'react';
import { ref, get, set, update, remove } from 'firebase/database';
import { rtdb } from '../../services/firebase';
import { Category } from '../../types';
import { Plus, Power, Trash2 } from 'lucide-react';

export const CategoryManagerPage: React.FC = () => {
  const [cats, setCats] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [icon, setIcon] = useState('🎬');

  const load = () => get(ref(rtdb, 'categories')).then(s => s.exists() ? setCats(Object.values(s.val())) : setCats([]));
  useEffect(() => { load(); }, []);

  const toggle = async (c: Category) => {
    await update(ref(rtdb, `categories/${c.id}`), { is_active: !c.is_active });
    load();
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;
    const id = `cat_${slug.trim().toLowerCase()}`;
    await set(ref(rtdb, `categories/${id}`), {
      id, name: name.trim(), slug: slug.trim().toLowerCase(), icon: icon.trim() || '📁', is_active: true, display_order: cats.length + 1
    });
    setName(''); setSlug('');
    load();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Category Manager (Bot 2x3 Grid)</h1>
      <form onSubmit={handleCreate} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-wrap gap-3 items-end">
        <div><label className="text-xs text-slate-400 block mb-1">Platform Name</label><input type="text" placeholder="e.g. TikTok" required value={name} onChange={e=>setName(e.target.value)} className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white"/></div>
        <div><label className="text-xs text-slate-400 block mb-1">Slug</label><input type="text" placeholder="tiktok" required value={slug} onChange={e=>setSlug(e.target.value)} className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white font-mono"/></div>
        <div><label className="text-xs text-slate-400 block mb-1">Icon</label><input type="text" value={icon} onChange={e=>setIcon(e.target.value)} className="w-16 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white text-center"/></div>
        <button type="submit" className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 rounded-xl text-xs font-semibold text-white flex items-center space-x-1.5"><Plus className="w-4 h-4"/><span>Add Platform</span></button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cats.map(c => (
          <div key={c.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex justify-between items-center">
            <div className="flex items-center space-x-3"><span className="text-2xl">{c.icon}</span><div><div className="font-bold text-white">{c.name}</div><div className="text-xs text-slate-500 font-mono">#{c.display_order} • {c.slug}</div></div></div>
            <button onClick={() => toggle(c)} className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1 ${c.is_active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'}`}><Power className="w-3.5 h-3.5"/><span>{c.is_active ? 'Active' : 'Disabled'}</span></button>
          </div>
        ))}
      </div>
    </div>
  );
};
""",

    "src/pages/Providers/ProviderManagerPage.tsx": """import React, { useEffect, useState } from 'react';
import { ref, get, set, update } from 'firebase/database';
import { rtdb } from '../../services/firebase';
import { ApiProvider } from '../../types';
import { Cpu, Power, CheckCircle2 } from 'lucide-react';

export const ProviderManagerPage: React.FC = () => {
  const [providers, setProviders] = useState<ApiProvider[]>([]);
  const load = () => get(ref(rtdb, 'api_providers')).then(s => s.exists() ? setProviders(Object.values(s.val())) : setProviders([]));
  useEffect(() => { load(); }, []);

  const toggle = async (p: ApiProvider) => {
    await update(ref(rtdb, `api_providers/${p.id}`), { is_enabled: !p.is_enabled });
    load();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">API Provider Manager</h1>
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-300">
        <b className="text-white">Built-in Engine:</b> The bot runs its native zero-storage <code>yt-dlp</code> extractor as the resilient primary engine.
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {providers.map(p => (
          <div key={p.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="flex justify-between items-start">
              <div><h3 className="font-bold text-white">{p.name}</h3><span className="text-[10px] font-mono text-sky-400 uppercase">{p.adapter_type}</span></div>
              <button onClick={() => toggle(p)} className={`px-2.5 py-1 rounded-full text-xs font-semibold ${p.is_enabled ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}><Power className="w-3 h-3 inline mr-1"/>{p.is_enabled ? 'Active' : 'Disabled'}</button>
            </div>
            <div className="text-xs text-slate-400 font-mono">Platforms: {p.supported_platforms.join(', ')}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
""",

    "src/pages/Users/UserManagerPage.tsx": """import React, { useEffect, useState } from 'react';
import { ref, get, update } from 'firebase/database';
import { rtdb } from '../../services/firebase';
import { TelegramUser } from '../../types';
import { UserCheck, UserX, Search } from 'lucide-react';

export const UserManagerPage: React.FC = () => {
  const [users, setUsers] = useState<TelegramUser[]>([]);
  const [q, setQ] = useState('');

  const load = () => get(ref(rtdb, 'users')).then(s => s.exists() ? setUsers(Object.values(s.val())) : setUsers([]));
  useEffect(() => { load(); }, []);

  const toggleBan = async (u: TelegramUser) => {
    await update(ref(rtdb, `users/${u.telegram_id}`), { is_banned: !u.is_banned });
    load();
  };

  const filtered = users.filter(u => `${u.telegram_id}`.includes(q) || (u.first_name || '').toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Telegram User Manager</h1>
      <input type="text" placeholder="Search by Telegram ID or name..." value={q} onChange={e=>setQ(e.target.value)} className="w-full max-w-md px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white" />
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800"><tr className="p-3"><th className="p-3">User</th><th className="p-3">ID</th><th className="p-3">Balance</th><th className="p-3">Moderation</th></tr></thead>
          <tbody className="divide-y divide-slate-800 text-slate-200">
            {filtered.map(u => (
              <tr key={u.telegram_id} className="hover:bg-slate-800/40">
                <td className="p-3 font-semibold">{u.first_name}</td>
                <td className="p-3 font-mono text-sky-400">{u.telegram_id}</td>
                <td className="p-3 font-mono font-bold text-amber-400">{u.credit_balance} Cr</td>
                <td className="p-3"><button onClick={() => toggleBan(u)} className={`px-2.5 py-1 rounded-xl text-xs font-semibold ${u.is_banned ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>{u.is_banned ? 'Banned' : 'Active'}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
""",

    "src/pages/Downloads/DownloadMonitorPage.tsx": """import React, { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { rtdb } from '../../services/firebase';
import { DownloadJob } from '../../types';

export const DownloadMonitorPage: React.FC = () => {
  const [jobs, setJobs] = useState<DownloadJob[]>([]);
  useEffect(() => {
    get(ref(rtdb, 'download_jobs')).then(s => s.exists() ? setJobs(Object.values(s.val())) : setJobs([]));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Download Job Monitor</h1>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800"><tr className="p-3"><th className="p-3">Platform</th><th className="p-3">User ID</th><th className="p-3">Quality</th><th className="p-3">Cost</th><th className="p-3">Status</th></tr></thead>
          <tbody className="divide-y divide-slate-800 text-slate-200">
            {jobs.map(j => (
              <tr key={j.job_id} className="hover:bg-slate-800/40">
                <td className="p-3 font-semibold uppercase font-mono text-sky-400">{j.category_slug}</td>
                <td className="p-3 font-mono">{j.telegram_user_id}</td>
                <td className="p-3 font-mono text-amber-400">{j.selected_quality || 'Auto'}</td>
                <td className="p-3 font-bold">{j.credit_cost} Cr</td>
                <td className="p-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800">{j.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
""",

    "src/pages/QualityPricing/QualityPricingPage.tsx": """import React, { useEffect, useState } from 'react';
import { ref, get, set } from 'firebase/database';
import { rtdb } from '../../services/firebase';
import { Coins, Save } from 'lucide-react';

export const QualityPricingPage: React.FC = () => {
  const [pricing, setPricing] = useState<Record<string, number>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    get(ref(rtdb, 'bot_settings/credits/pricing_by_quality')).then(s => {
      setPricing(s.exists() ? s.val() : { audio: 5, '360p': 5, '480p': 8, '720p': 10, '1080p': 20 });
    });
  }, []);

  const handleSave = async () => {
    await set(ref(rtdb, 'bot_settings/credits/pricing_by_quality'), pricing);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Quality Credit Pricing</h1>
        <button onClick={handleSave} className="px-4 py-2 bg-brand-600 hover:bg-brand-500 rounded-xl text-xs font-semibold text-white flex items-center space-x-1.5"><Save className="w-4 h-4"/><span>Save All</span></button>
      </div>
      {saved && <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">Saved to Firebase successfully!</div>}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(pricing).map(([k, v]) => (
          <div key={k} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <label className="text-xs font-mono uppercase text-slate-400 block mb-2">{k}</label>
            <input type="number" min={0} value={v} onChange={e => setPricing({...pricing, [k]: parseInt(e.target.value)||0})} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white font-mono rounded-xl"/>
          </div>
        ))}
      </div>
    </div>
  );
};
""",

    "src/pages/Referrals/ReferralSettingsPage.tsx": """import React, { useEffect, useState } from 'react';
import { ref, get, update } from 'firebase/database';
import { rtdb } from '../../services/firebase';
import { Save } from 'lucide-react';

export const ReferralSettingsPage: React.FC = () => {
  const [data, setData] = useState({ welcome_bonus: 50, referral_reward_referrer: 20, referral_reward_referee: 10 });

  useEffect(() => {
    get(ref(rtdb, 'bot_settings/credits')).then(s => s.exists() && setData(s.val()));
  }, []);

  const save = async () => {
    await update(ref(rtdb, 'bot_settings/credits'), data);
    alert('Referral and Trial settings updated!');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Trial & Referral Rewards</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <label className="text-xs text-slate-400 block mb-2">Welcome Free Credits</label>
          <input type="number" value={data.welcome_bonus} onChange={e=>setData({...data, welcome_bonus: parseInt(e.target.value)||0})} className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"/>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <label className="text-xs text-slate-400 block mb-2">Referrer Reward Payout</label>
          <input type="number" value={data.referral_reward_referrer} onChange={e=>setData({...data, referral_reward_referrer: parseInt(e.target.value)||0})} className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"/>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <label className="text-xs text-slate-400 block mb-2">Referee Bonus</label>
          <input type="number" value={data.referral_reward_referee} onChange={e=>setData({...data, referral_reward_referee: parseInt(e.target.value)||0})} className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"/>
        </div>
      </div>
      <button onClick={save} className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 rounded-xl text-xs font-semibold text-white flex items-center space-x-1.5"><Save className="w-4 h-4"/><span>Save Rewards</span></button>
    </div>
  );
};
""",

    "src/pages/BotSettings/BotSettingsPage.tsx": """import React, { useEffect, useState } from 'react';
import { ref, get, update } from 'firebase/database';
import { rtdb } from '../../services/firebase';
import { Power, Save } from 'lucide-react';

export const BotSettingsPage: React.FC = () => {
  const [limits, setLimits] = useState({ rate_limit_per_minute: 6, max_concurrent_jobs: 2, link_expiry_seconds: 3600 });
  const [maintenance, setMaintenance] = useState(false);

  useEffect(() => {
    get(ref(rtdb, 'bot_settings')).then(s => {
      if (s.exists()) {
        const d = s.val();
        if (d.limits) setLimits(d.limits);
        setMaintenance(!!d.maintenance_mode);
      }
    });
  }, []);

  const save = async () => {
    await update(ref(rtdb, 'bot_settings'), { limits, maintenance_mode: maintenance });
    alert('Settings updated!');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Bot Operational Settings</h1>
      <div className={`p-4 rounded-2xl border flex justify-between items-center ${maintenance ? 'bg-amber-500/10 border-amber-500/30' : 'bg-slate-900 border-slate-800'}`}>
        <div><h3 className="font-bold text-white text-sm">Emergency Maintenance Mode</h3><p className="text-xs text-slate-400">Pauses all new video downloads in the bot.</p></div>
        <button onClick={() => setMaintenance(!maintenance)} className={`px-4 py-2 rounded-xl text-xs font-bold ${maintenance ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>{maintenance ? 'Paused' : 'Active'}</button>
      </div>
      <button onClick={save} className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 rounded-xl text-xs font-semibold text-white flex items-center space-x-1.5"><Save className="w-4 h-4"/><span>Save Limits</span></button>
    </div>
  );
};
""",

    "src/pages/Broadcast/BroadcastManagerPage.tsx": """import React, { useEffect, useState } from 'react';
import { ref, get, push, set } from 'firebase/database';
import { rtdb } from '../../services/firebase';
import { Send } from 'lucide-react';

export const BroadcastManagerPage: React.FC = () => {
  const [text, setText] = useState('');
  const [tasks, setTasks] = useState<any[]>([]);

  const load = () => get(ref(rtdb, 'broadcast_tasks')).then(s => s.exists() ? setTasks(Object.values(s.val())) : setTasks([]));
  useEffect(() => { load(); }, []);

  const queue = async () => {
    if (!text.trim()) return;
    const newRef = push(ref(rtdb, 'broadcast_tasks'));
    await set(newRef, { task_id: newRef.key, message_text: text.trim(), status: 'QUEUED', created_at: Date.now() });
    setText('');
    load();
    alert('Broadcast queued for Python Bot delivery!');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Broadcast Manager</h1>
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
        <textarea rows={3} value={text} onChange={e=>setText(e.target.value)} placeholder="Type announcement in Bangla or English..." className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"/>
        <button onClick={queue} className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 rounded-xl text-xs font-semibold text-white flex items-center space-x-1.5"><Send className="w-4 h-4"/><span>Queue Broadcast</span></button>
      </div>
    </div>
  );
};
""",

    "src/pages/Security/AuditLogsPage.tsx": """import React, { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { rtdb } from '../../services/firebase';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  useEffect(() => {
    get(ref(rtdb, 'audit_logs')).then(s => s.exists() ? setLogs(Object.values(s.val())) : setLogs([]));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Security & Audit Logs</h1>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800"><tr className="p-3"><th className="p-3">Action</th><th className="p-3">Admin</th><th className="p-3">Time</th></tr></thead>
          <tbody className="divide-y divide-slate-800 text-slate-200">
            {logs.map((l, i) => (
              <tr key={i} className="hover:bg-slate-800/40">
                <td className="p-3 font-mono font-bold text-amber-400">{l.action}</td>
                <td className="p-3 font-mono">{l.actor_email}</td>
                <td className="p-3 text-slate-500">{new Date(l.timestamp).toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
""",

    "src/App.tsx": """import React from 'react';
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
""",

    "src/main.tsx": """import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
"""
}

for path, content in files.items():
    folder = os.path.dirname(path)
    if folder: os.makedirs(folder, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.strip())
    print(f"Created: {path}")

os.system("git add . && git commit -m 'feat: complete react typescript admin panel' && git push origin main")
print("\n✅ SUCCESS: All Admin Panel files created and pushed to GitHub successfully!")
