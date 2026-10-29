import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { ref, get, set } from 'firebase/database';
import { rtdb } from '../../services/firebase';
import { Save } from 'lucide-react';
export const QualityPricingPage = () => {
    const [pricing, setPricing] = useState({});
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
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h1", { className: "text-2xl font-bold text-white", children: "Quality Credit Pricing" }), _jsxs("button", { onClick: handleSave, className: "px-4 py-2 bg-brand-600 hover:bg-brand-500 rounded-xl text-xs font-semibold text-white flex items-center space-x-1.5", children: [_jsx(Save, { className: "w-4 h-4" }), _jsx("span", { children: "Save All" })] })] }), saved && _jsx("div", { className: "p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs", children: "Saved to Firebase successfully!" }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4", children: Object.entries(pricing).map(([k, v]) => (_jsxs("div", { className: "bg-slate-900 border border-slate-800 p-4 rounded-2xl", children: [_jsx("label", { className: "text-xs font-mono uppercase text-slate-400 block mb-2", children: k }), _jsx("input", { type: "number", min: 0, value: v, onChange: e => setPricing({ ...pricing, [k]: parseInt(e.target.value) || 0 }), className: "w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white font-mono rounded-xl" })] }, k))) })] }));
};
