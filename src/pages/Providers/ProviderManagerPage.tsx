import React, { useEffect, useState } from 'react';
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