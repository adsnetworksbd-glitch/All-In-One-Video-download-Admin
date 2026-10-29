import React, { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { rtdb } from '../../services/firebase';
import { DownloadJob } from '../../types';

export const DownloadMonitorPage: React.FC = () => {
  const [jobs, setJobs] = useState<DownloadJob[]>([]);
  useEffect(() => {
    get(ref(rtdb, 'download_jobs')).then(s => s.exists() ? setJobs(Object.values(s.val())) : setJobs([]));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Download Job Monitor</h1>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800"><tr className="p-3"><th className="p-3">Platform</th><th className="p-3">User ID</th><th className="p-3">Quality</th><th className="p-3">Cost</th><th className="p-3">Status</th></tr></thead>
          <tbody className="divide-y divide-slate-800 text-slate-200">
            {jobs.map(j => (
              <tr key={j.job_id} className="hover:bg-slate-800/40">
                <td className="p-3 font-semibold uppercase font-mono text-sky-400">{j.category_slug}</td>
                <td className="p-3 font-mono">{j.telegram_user_id}</td>
                <td className="p-3 font-mono text-amber-400">{j.selected_quality || 'Auto'}</td>
                <td className="p-3 font-bold">{j.credit_cost} Cr</td>
                <td className="p-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800">{j.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};