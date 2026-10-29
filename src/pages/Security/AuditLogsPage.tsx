import React, { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { rtdb } from '../../services/firebase';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  useEffect(() => {
    get(ref(rtdb, 'audit_logs')).then(s => s.exists() ? setLogs(Object.values(s.val())) : setLogs([]));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Security & Audit Logs</h1>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800"><tr className="p-3"><th className="p-3">Action</th><th className="p-3">Admin</th><th className="p-3">Time</th></tr></thead>
          <tbody className="divide-y divide-slate-800 text-slate-200">
            {logs.map((l, i) => (
              <tr key={i} className="hover:bg-slate-800/40">
                <td className="p-3 font-mono font-bold text-amber-400">{l.action}</td>
                <td className="p-3 font-mono">{l.actor_email}</td>
                <td className="p-3 text-slate-500">{new Date(l.timestamp).toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};