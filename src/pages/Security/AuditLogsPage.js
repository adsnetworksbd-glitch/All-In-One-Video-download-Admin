import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { rtdb } from '../../services/firebase';
export const AuditLogsPage = () => {
    const [logs, setLogs] = useState([]);
    useEffect(() => {
        get(ref(rtdb, 'audit_logs')).then(s => s.exists() ? setLogs(Object.values(s.val())) : setLogs([]));
    }, []);
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("h1", { className: "text-2xl font-bold text-white", children: "Security & Audit Logs" }), _jsx("div", { className: "bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden", children: _jsxs("table", { className: "w-full text-left text-xs", children: [_jsx("thead", { className: "bg-slate-950 text-slate-400 border-b border-slate-800", children: _jsxs("tr", { className: "p-3", children: [_jsx("th", { className: "p-3", children: "Action" }), _jsx("th", { className: "p-3", children: "Admin" }), _jsx("th", { className: "p-3", children: "Time" })] }) }), _jsx("tbody", { className: "divide-y divide-slate-800 text-slate-200", children: logs.map((l, i) => (_jsxs("tr", { className: "hover:bg-slate-800/40", children: [_jsx("td", { className: "p-3 font-mono font-bold text-amber-400", children: l.action }), _jsx("td", { className: "p-3 font-mono", children: l.actor_email }), _jsx("td", { className: "p-3 text-slate-500", children: new Date(l.timestamp).toLocaleTimeString() })] }, i))) })] }) })] }));
};
