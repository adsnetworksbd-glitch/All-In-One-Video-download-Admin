import React, { useEffect, useState } from 'react';
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