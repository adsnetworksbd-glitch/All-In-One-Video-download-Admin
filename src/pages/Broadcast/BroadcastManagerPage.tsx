import React, { useEffect, useState } from 'react';
import { ref, get, push, set } from 'firebase/database';
import { rtdb } from '../../services/firebase';
import { Send } from 'lucide-react';

export const BroadcastManagerPage: React.FC = () => {
  const [text, setText] = useState('');
  const [tasks, setTasks] = useState<any[]>([]);

  const load = () => get(ref(rtdb, 'broadcast_tasks')).then(s => s.exists() ? setTasks(Object.values(s.val())) : setTasks([]));
  useEffect(() => { load(); }, []);

  const queue = async () => {
    if (!text.trim()) return;
    const newRef = push(ref(rtdb, 'broadcast_tasks'));
    await set(newRef, { task_id: newRef.key, message_text: text.trim(), status: 'QUEUED', created_at: Date.now() });
    setText('');
    load();
    alert('Broadcast queued for Python Bot delivery!');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Broadcast Manager</h1>
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
        <textarea rows={3} value={text} onChange={e=>setText(e.target.value)} placeholder="Type announcement in Bangla or English..." className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"/>
        <button onClick={queue} className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 rounded-xl text-xs font-semibold text-white flex items-center space-x-1.5"><Send className="w-4 h-4"/><span>Queue Broadcast</span></button>
      </div>
    </div>
  );
};