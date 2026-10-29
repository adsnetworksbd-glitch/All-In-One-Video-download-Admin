import React, { useEffect, useState } from 'react';
import { ref, get, set, update, remove } from 'firebase/database';
import { rtdb } from '../../services/firebase';
import { Category } from '../../types';
import { Plus, Power, Trash2 } from 'lucide-react';

export const CategoryManagerPage: React.FC = () => {
  const [cats, setCats] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [icon, setIcon] = useState('🎬');

  const load = () => get(ref(rtdb, 'categories')).then(s => s.exists() ? setCats(Object.values(s.val())) : setCats([]));
  useEffect(() => { load(); }, []);

  const toggle = async (c: Category) => {
    await update(ref(rtdb, `categories/${c.id}`), { is_active: !c.is_active });
    load();
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;
    const id = `cat_${slug.trim().toLowerCase()}`;
    await set(ref(rtdb, `categories/${id}`), {
      id, name: name.trim(), slug: slug.trim().toLowerCase(), icon: icon.trim() || '📁', is_active: true, display_order: cats.length + 1
    });
    setName(''); setSlug('');
    load();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Category Manager (Bot 2x3 Grid)</h1>
      <form onSubmit={handleCreate} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-wrap gap-3 items-end">
        <div><label className="text-xs text-slate-400 block mb-1">Platform Name</label><input type="text" placeholder="e.g. TikTok" required value={name} onChange={e=>setName(e.target.value)} className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white"/></div>
        <div><label className="text-xs text-slate-400 block mb-1">Slug</label><input type="text" placeholder="tiktok" required value={slug} onChange={e=>setSlug(e.target.value)} className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white font-mono"/></div>
        <div><label className="text-xs text-slate-400 block mb-1">Icon</label><input type="text" value={icon} onChange={e=>setIcon(e.target.value)} className="w-16 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white text-center"/></div>
        <button type="submit" className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 rounded-xl text-xs font-semibold text-white flex items-center space-x-1.5"><Plus className="w-4 h-4"/><span>Add Platform</span></button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cats.map(c => (
          <div key={c.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex justify-between items-center">
            <div className="flex items-center space-x-3"><span className="text-2xl">{c.icon}</span><div><div className="font-bold text-white">{c.name}</div><div className="text-xs text-slate-500 font-mono">#{c.display_order} • {c.slug}</div></div></div>
            <button onClick={() => toggle(c)} className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1 ${c.is_active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'}`}><Power className="w-3.5 h-3.5"/><span>{c.is_active ? 'Active' : 'Disabled'}</span></button>
          </div>
        ))}
      </div>
    </div>
  );
};