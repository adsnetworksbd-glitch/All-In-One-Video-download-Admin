import React, { useEffect, useState } from 'react';
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