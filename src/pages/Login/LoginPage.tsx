import React, { useState } from 'react';
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