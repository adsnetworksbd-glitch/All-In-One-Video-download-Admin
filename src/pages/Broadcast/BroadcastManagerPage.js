import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { ref, get, push, set } from 'firebase/database';
import { rtdb } from '../../services/firebase';
import { Send } from 'lucide-react';
export const BroadcastManagerPage = () => {
    const [text, setText] = useState('');
    const [tasks, setTasks] = useState([]);
    const load = () => get(ref(rtdb, 'broadcast_tasks')).then(s => s.exists() ? setTasks(Object.values(s.val())) : setTasks([]));
    useEffect(() => { load(); }, []);
    const queue = async () => {
        if (!text.trim())
            return;
        const newRef = push(ref(rtdb, 'broadcast_tasks'));
        await set(newRef, { task_id: newRef.key, message_text: text.trim(), status: 'QUEUED', created_at: Date.now() });
        setText('');
        load();
        alert('Broadcast queued for Python Bot delivery!');
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("h1", { className: "text-2xl font-bold text-white", children: "Broadcast Manager" }), _jsxs("div", { className: "bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4", children: [_jsx("textarea", { rows: 3, value: text, onChange: e => setText(e.target.value), placeholder: "Type announcement in Bangla or English...", className: "w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs" }), _jsxs("button", { onClick: queue, className: "px-4 py-2.5 bg-brand-600 hover:bg-brand-500 rounded-xl text-xs font-semibold text-white flex items-center space-x-1.5", children: [_jsx(Send, { className: "w-4 h-4" }), _jsx("span", { children: "Queue Broadcast" })] })] })] }));
};
