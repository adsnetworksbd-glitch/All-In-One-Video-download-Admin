import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { ref, get, update } from 'firebase/database';
import { rtdb } from '../../services/firebase';
import { Save } from 'lucide-react';
export const ReferralSettingsPage = () => {
    const [data, setData] = useState({ welcome_bonus: 50, referral_reward_referrer: 20, referral_reward_referee: 10 });
    useEffect(() => {
        get(ref(rtdb, 'bot_settings/credits')).then(s => s.exists() && setData(s.val()));
    }, []);
    const save = async () => {
        await update(ref(rtdb, 'bot_settings/credits'), data);
        alert('Referral and Trial settings updated!');
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("h1", { className: "text-2xl font-bold text-white", children: "Trial & Referral Rewards" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "bg-slate-900 border border-slate-800 p-5 rounded-2xl", children: [_jsx("label", { className: "text-xs text-slate-400 block mb-2", children: "Welcome Free Credits" }), _jsx("input", { type: "number", value: data.welcome_bonus, onChange: e => setData({ ...data, welcome_bonus: parseInt(e.target.value) || 0 }), className: "w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono" })] }), _jsxs("div", { className: "bg-slate-900 border border-slate-800 p-5 rounded-2xl", children: [_jsx("label", { className: "text-xs text-slate-400 block mb-2", children: "Referrer Reward Payout" }), _jsx("input", { type: "number", value: data.referral_reward_referrer, onChange: e => setData({ ...data, referral_reward_referrer: parseInt(e.target.value) || 0 }), className: "w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono" })] }), _jsxs("div", { className: "bg-slate-900 border border-slate-800 p-5 rounded-2xl", children: [_jsx("label", { className: "text-xs text-slate-400 block mb-2", children: "Referee Bonus" }), _jsx("input", { type: "number", value: data.referral_reward_referee, onChange: e => setData({ ...data, referral_reward_referee: parseInt(e.target.value) || 0 }), className: "w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono" })] })] }), _jsxs("button", { onClick: save, className: "px-5 py-2.5 bg-brand-600 hover:bg-brand-500 rounded-xl text-xs font-semibold text-white flex items-center space-x-1.5", children: [_jsx(Save, { className: "w-4 h-4" }), _jsx("span", { children: "Save Rewards" })] })] }));
};
