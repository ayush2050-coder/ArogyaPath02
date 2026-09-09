import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Database, 
  Activity, 
  Server, 
  Lock, 
  FileCheck2, 
  Users, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { AuditLog } from '../types';

export const AdminPortal: React.FC = () => {
  const { refreshData } = useApp();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/analytics');
      if (res.ok) {
        const data = await res.json();
        setLogs(data.recentAuditLogs || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-xs font-bold uppercase tracking-wider">
              System Administration
            </span>
            <span className="text-xs text-slate-500 font-medium">
              National Health Stack Compliance • DISHA / ABDM Architecture
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Platform Security & Audit Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Real-time telemetry, tamper-evident audit logs, and AI boundary governance monitoring.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* Security Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase">
            <ShieldCheck className="w-4 h-4" />
            <span>Doctor-in-the-Loop Enforced</span>
          </div>
          <p className="text-xs text-slate-600 mt-2">
            All AI case intakes strictly require physician review. Zero autonomous prescription pathways exist.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-blue-700 text-xs font-bold uppercase">
            <Database className="w-4 h-4" />
            <span>Verbatim Audio/Text Preservation</span>
          </div>
          <p className="text-xs text-slate-600 mt-2">
            100% of raw patient Hindi/English statements are permanently appended to the electronic health record.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase">
            <Server className="w-4 h-4" />
            <span>Field Offline Resiliency</span>
          </div>
          <p className="text-xs text-slate-600 mt-2">
            Browser LocalStorage fallback protects rural ASHA worker surveys from field connectivity loss.
          </p>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-emerald-600" />
          <span>Security & System Event Audit Logs</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-200">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Event Action</th>
                <th className="p-3">Actor</th>
                <th className="p-3">Resource Target</th>
                <th className="p-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="p-3 text-slate-400 font-mono whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="p-3 font-semibold text-slate-900">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-[11px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3 font-medium text-slate-800">
                    {log.userName}
                  </td>
                  <td className="p-3 font-mono text-[11px] text-slate-500">
                    {log.resource}
                  </td>
                  <td className="p-3 text-slate-600">
                    {JSON.stringify(log.details)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
