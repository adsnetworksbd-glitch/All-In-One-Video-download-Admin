import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { ref, get, update } from 'firebase/database';
import { rtdb } from '../../services/firebase';
import { Save } from 'lucide-react';
export const BotSettingsPage = () => {
    const [limits, setLimits] = useState({ rate_limit_per_minute: 6, max_concurrent_jobs: 2, link_expiry_seconds: 3600 });
    const [maintenance, setMaintenance] = useState(false);
    useEffect(() => {
        get(ref(rtdb, 'bot_settings')).then(s => {
            if (s.exists()) {
                const d = s.val();
                if (d.limits)
                    setLimits(d.limits);
                setMaintenance(!!d.maintenance_mode);
            }
        });
    }, []);
    const save = async () => {
        await update(ref(rtdb, 'bot_settings'), { limits, maintenance_mode: maintenance });
        alert('Settings updated!');
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("h1", { className: "text-2xl font-bold text-white", children: "Bot Operational Settings" }), _jsxs("div", { className: `p-4 rounded-2xl border flex justify-between items-center ${maintenance ? 'bg-amber-500/10 border-amber-500/30' : 'bg-slate-900 border-slate-800'}`, children: [_jsxs("div", { children: [_jsx("h3", { className: "font-bold text-white text-sm", children: "Emergency Maintenance Mode" }), _jsx("p", { className: "text-xs text-slate-400", children: "Pauses all new video downloads in the bot." })] }), _jsx("button", { onClick: () => setMaintenance(!maintenance), className: `px-4 py-2 rounded-xl text-xs font-bold ${maintenance ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`, children: maintenance ? 'Paused' : 'Active' })] }), _jsxs("button", { onClick: save, className: "px-5 py-2.5 bg-brand-600 hover:bg-brand-500 rounded-xl text-xs font-semibold text-white flex items-center space-x-1.5", children: [_jsx(Save, { className: "w-4 h-4" }), _jsx("span", { children: "Save Limits" })] })] }));
};
