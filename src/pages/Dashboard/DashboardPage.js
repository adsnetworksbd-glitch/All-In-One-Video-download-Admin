import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { rtdb } from '../../services/firebase';
import { Users, Layers, DownloadCloud, Coins, RefreshCw } from 'lucide-react';
export const DashboardPage = () => {
    const [data, setData] = useState({ users: 0, jobs: 0, credits: 0, cats: 0 });
    const [loading, setLoading] = useState(true);
    const loadData = () => {
        setLoading(true);
        Promise.all([get(ref(rtdb, 'users')), get(ref(rtdb, 'download_jobs')), get(ref(rtdb, 'categories'))])
            .then(([u, j, c]) => {
            const usersList = u.exists() ? Object.values(u.val()) : [];
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
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-white", children: "System Overview" }), _jsx("p", { className: "text-xs text-slate-400", children: "Live statistics from Firebase Realtime Database" })] }), _jsxs("button", { onClick: loadData, className: "px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-slate-300 flex items-center space-x-1.5 hover:bg-slate-700", children: [_jsx(RefreshCw, { className: `w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}` }), _jsx("span", { children: "Refresh" })] })] }), _jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsxs("div", { className: "bg-slate-900 border border-slate-800 p-5 rounded-2xl", children: [_jsxs("div", { className: "flex items-center justify-between text-xs text-slate-400 uppercase font-semibold", children: [_jsx("span", { children: "Total Users" }), _jsx(Users, { className: "w-4 h-4 text-sky-400" })] }), _jsx("div", { className: "text-2xl font-bold text-white mt-2", children: data.users })] }), _jsxs("div", { className: "bg-slate-900 border border-slate-800 p-5 rounded-2xl", children: [_jsxs("div", { className: "flex items-center justify-between text-xs text-slate-400 uppercase font-semibold", children: [_jsx("span", { children: "Download Jobs" }), _jsx(DownloadCloud, { className: "w-4 h-4 text-indigo-400" })] }), _jsx("div", { className: "text-2xl font-bold text-white mt-2", children: data.jobs })] }), _jsxs("div", { className: "bg-slate-900 border border-slate-800 p-5 rounded-2xl", children: [_jsxs("div", { className: "flex items-center justify-between text-xs text-slate-400 uppercase font-semibold", children: [_jsx("span", { children: "Circulating Credits" }), _jsx(Coins, { className: "w-4 h-4 text-amber-400" })] }), _jsx("div", { className: "text-2xl font-bold text-white mt-2", children: data.credits })] }), _jsxs("div", { className: "bg-slate-900 border border-slate-800 p-5 rounded-2xl", children: [_jsxs("div", { className: "flex items-center justify-between text-xs text-slate-400 uppercase font-semibold", children: [_jsx("span", { children: "Active Platforms" }), _jsx(Layers, { className: "w-4 h-4 text-emerald-400" })] }), _jsx("div", { className: "text-2xl font-bold text-white mt-2", children: data.cats })] })] })] }));
};
