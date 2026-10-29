import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { ref, get, set, update } from 'firebase/database';
import { rtdb } from '../../services/firebase';
import { Plus, Power } from 'lucide-react';
export const CategoryManagerPage = () => {
    const [cats, setCats] = useState([]);
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [icon, setIcon] = useState('🎬');
    const load = () => get(ref(rtdb, 'categories')).then(s => s.exists() ? setCats(Object.values(s.val())) : setCats([]));
    useEffect(() => { load(); }, []);
    const toggle = async (c) => {
        await update(ref(rtdb, `categories/${c.id}`), { is_active: !c.is_active });
        load();
    };
    const handleCreate = async (e) => {
        e.preventDefault();
        if (!name.trim() || !slug.trim())
            return;
        const id = `cat_${slug.trim().toLowerCase()}`;
        await set(ref(rtdb, `categories/${id}`), {
            id, name: name.trim(), slug: slug.trim().toLowerCase(), icon: icon.trim() || '📁', is_active: true, display_order: cats.length + 1
        });
        setName('');
        setSlug('');
        load();
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("h1", { className: "text-2xl font-bold text-white", children: "Category Manager (Bot 2x3 Grid)" }), _jsxs("form", { onSubmit: handleCreate, className: "bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-wrap gap-3 items-end", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs text-slate-400 block mb-1", children: "Platform Name" }), _jsx("input", { type: "text", placeholder: "e.g. TikTok", required: true, value: name, onChange: e => setName(e.target.value), className: "px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs text-slate-400 block mb-1", children: "Slug" }), _jsx("input", { type: "text", placeholder: "tiktok", required: true, value: slug, onChange: e => setSlug(e.target.value), className: "px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white font-mono" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs text-slate-400 block mb-1", children: "Icon" }), _jsx("input", { type: "text", value: icon, onChange: e => setIcon(e.target.value), className: "w-16 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white text-center" })] }), _jsxs("button", { type: "submit", className: "px-4 py-2.5 bg-brand-600 hover:bg-brand-500 rounded-xl text-xs font-semibold text-white flex items-center space-x-1.5", children: [_jsx(Plus, { className: "w-4 h-4" }), _jsx("span", { children: "Add Platform" })] })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: cats.map(c => (_jsxs("div", { className: "bg-slate-900 border border-slate-800 p-4 rounded-2xl flex justify-between items-center", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("span", { className: "text-2xl", children: c.icon }), _jsxs("div", { children: [_jsx("div", { className: "font-bold text-white", children: c.name }), _jsxs("div", { className: "text-xs text-slate-500 font-mono", children: ["#", c.display_order, " \u2022 ", c.slug] })] })] }), _jsxs("button", { onClick: () => toggle(c), className: `px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1 ${c.is_active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'}`, children: [_jsx(Power, { className: "w-3.5 h-3.5" }), _jsx("span", { children: c.is_active ? 'Active' : 'Disabled' })] })] }, c.id))) })] }));
};
