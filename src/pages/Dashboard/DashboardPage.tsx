import React, { useEffect, useState } from 'react';
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