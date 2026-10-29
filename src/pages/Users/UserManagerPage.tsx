import React, { useEffect, useState } from 'react';
import { ref, get, update } from 'firebase/database';
import { rtdb } from '../../services/firebase';
import { TelegramUser } from '../../types';
import { UserCheck, UserX, Search } from 'lucide-react';

export const UserManagerPage: React.FC = () => {
  const [users, setUsers] = useState<TelegramUser[]>([]);
  const [q, setQ] = useState('');

  const load = () => get(ref(rtdb, 'users')).then(s => s.exists() ? setUsers(Object.values(s.val())) : setUsers([]));
  useEffect(() => { load(); }, []);

  const toggleBan = async (u: TelegramUser) => {
    await update(ref(rtdb, `users/${u.telegram_id}`), { is_banned: !u.is_banned });
    load();
  };

  const filtered = users.filter(u => `${u.telegram_id}`.includes(q) || (u.first_name || '').toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Telegram User Manager</h1>
      <input type="text" placeholder="Search by Telegram ID or name..." value={q} onChange={e=>setQ(e.target.value)} className="w-full max-w-md px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white" />
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800"><tr className="p-3"><th className="p-3">User</th><th className="p-3">ID</th><th className="p-3">Balance</th><th className="p-3">Moderation</th></tr></thead>
          <tbody className="divide-y divide-slate-800 text-slate-200">
            {filtered.map(u => (
              <tr key={u.telegram_id} className="hover:bg-slate-800/40">
                <td className="p-3 font-semibold">{u.first_name}</td>
                <td className="p-3 font-mono text-sky-400">{u.telegram_id}</td>
                <td className="p-3 font-mono font-bold text-amber-400">{u.credit_balance} Cr</td>
                <td className="p-3"><button onClick={() => toggleBan(u)} className={`px-2.5 py-1 rounded-xl text-xs font-semibold ${u.is_banned ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>{u.is_banned ? 'Banned' : 'Active'}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};