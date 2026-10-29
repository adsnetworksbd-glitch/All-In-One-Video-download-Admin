import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { rtdb } from '../../services/firebase';
export const DownloadMonitorPage = () => {
    const [jobs, setJobs] = useState([]);
    useEffect(() => {
        get(ref(rtdb, 'download_jobs')).then(s => s.exists() ? setJobs(Object.values(s.val())) : setJobs([]));
    }, []);
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("h1", { className: "text-2xl font-bold text-white", children: "Download Job Monitor" }), _jsx("div", { className: "bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden", children: _jsxs("table", { className: "w-full text-left text-xs", children: [_jsx("thead", { className: "bg-slate-950 text-slate-400 border-b border-slate-800", children: _jsxs("tr", { className: "p-3", children: [_jsx("th", { className: "p-3", children: "Platform" }), _jsx("th", { className: "p-3", children: "User ID" }), _jsx("th", { className: "p-3", children: "Quality" }), _jsx("th", { className: "p-3", children: "Cost" }), _jsx("th", { className: "p-3", children: "Status" })] }) }), _jsx("tbody", { className: "divide-y divide-slate-800 text-slate-200", children: jobs.map(j => (_jsxs("tr", { className: "hover:bg-slate-800/40", children: [_jsx("td", { className: "p-3 font-semibold uppercase font-mono text-sky-400", children: j.category_slug }), _jsx("td", { className: "p-3 font-mono", children: j.telegram_user_id }), _jsx("td", { className: "p-3 font-mono text-amber-400", children: j.selected_quality || 'Auto' }), _jsxs("td", { className: "p-3 font-bold", children: [j.credit_cost, " Cr"] }), _jsx("td", { className: "p-3", children: _jsx("span", { className: "px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800", children: j.status }) })] }, j.job_id))) })] }) })] }));
};
