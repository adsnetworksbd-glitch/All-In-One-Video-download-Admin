import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { ref, get, update } from 'firebase/database';
import { rtdb } from '../../services/firebase';
export const UserManagerPage = () => {
    const [users, setUsers] = useState([]);
    const [q, setQ] = useState('');
    const load = () => get(ref(rtdb, 'users')).then(s => s.exists() ? setUsers(Object.values(s.val())) : setUsers([]));
    useEffect(() => { load(); }, []);
    const toggleBan = async (u) => {
        await update(ref(rtdb, `users/${u.telegram_id}`), { is_banned: !u.is_banned });
        load();
    };
    const filtered = users.filter(u => `${u.telegram_id}`.includes(q) || (u.first_name || '').toLowerCase().includes(q.toLowerCase()));
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("h1", { className: "text-2xl font-bold text-white", children: "Telegram User Manager" }), _jsx("input", { type: "text", placeholder: "Search by Telegram ID or name...", value: q, onChange: e => setQ(e.target.value), className: "w-full max-w-md px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white" }), _jsx("div", { className: "bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden", children: _jsxs("table", { className: "w-full text-left text-xs", children: [_jsx("thead", { className: "bg-slate-950 text-slate-400 border-b border-slate-800", children: _jsxs("tr", { className: "p-3", children: [_jsx("th", { className: "p-3", children: "User" }), _jsx("th", { className: "p-3", children: "ID" }), _jsx("th", { className: "p-3", children: "Balance" }), _jsx("th", { className: "p-3", children: "Moderation" })] }) }), _jsx("tbody", { className: "divide-y divide-slate-800 text-slate-200", children: filtered.map(u => (_jsxs("tr", { className: "hover:bg-slate-800/40", children: [_jsx("td", { className: "p-3 font-semibold", children: u.first_name }), _jsx("td", { className: "p-3 font-mono text-sky-400", children: u.telegram_id }), _jsxs("td", { className: "p-3 font-mono font-bold text-amber-400", children: [u.credit_balance, " Cr"] }), _jsx("td", { className: "p-3", children: _jsx("button", { onClick: () => toggleBan(u), className: `px-2.5 py-1 rounded-xl text-xs font-semibold ${u.is_banned ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`, children: u.is_banned ? 'Banned' : 'Active' }) })] }, u.telegram_id))) })] }) })] }));
};
