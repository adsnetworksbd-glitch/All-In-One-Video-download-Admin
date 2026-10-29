import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { ref, get, update } from 'firebase/database';
import { rtdb } from '../../services/firebase';
import { Power } from 'lucide-react';
export const ProviderManagerPage = () => {
    const [providers, setProviders] = useState([]);
    const load = () => get(ref(rtdb, 'api_providers')).then(s => s.exists() ? setProviders(Object.values(s.val())) : setProviders([]));
    useEffect(() => { load(); }, []);
    const toggle = async (p) => {
        await update(ref(rtdb, `api_providers/${p.id}`), { is_enabled: !p.is_enabled });
        load();
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("h1", { className: "text-2xl font-bold text-white", children: "API Provider Manager" }), _jsxs("div", { className: "p-4 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-300", children: [_jsx("b", { className: "text-white", children: "Built-in Engine:" }), " The bot runs its native zero-storage ", _jsx("code", { children: "yt-dlp" }), " extractor as the resilient primary engine."] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: providers.map(p => (_jsxs("div", { className: "bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-bold text-white", children: p.name }), _jsx("span", { className: "text-[10px] font-mono text-sky-400 uppercase", children: p.adapter_type })] }), _jsxs("button", { onClick: () => toggle(p), className: `px-2.5 py-1 rounded-full text-xs font-semibold ${p.is_enabled ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'}`, children: [_jsx(Power, { className: "w-3 h-3 inline mr-1" }), p.is_enabled ? 'Active' : 'Disabled'] })] }), _jsxs("div", { className: "text-xs text-slate-400 font-mono", children: ["Platforms: ", p.supported_platforms.join(', ')] })] }, p.id))) })] }));
};
