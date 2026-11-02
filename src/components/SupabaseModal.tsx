import React, { useState } from 'react';
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  Copy,
  ExternalLink,
  Radio,
  Server,
  Layers,
  Shield,
  X,
  RefreshCw,
} from 'lucide-react';
import { SupabaseHealth } from '../lib/supabase';
import { ZEDWHISPER_SUPABASE_SCHEMA_SQL } from '../lib/schemaSql';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  health: SupabaseHealth;
  onRefreshHealth: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({
  isOpen,
  onClose,
  health,
  onRefreshHealth,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'status' | 'sql' | 'guide'>('status');

  if (!isOpen) return null;

  const handleCopySql = () => {
    try {
      navigator.clipboard.writeText(ZEDWHISPER_SUPABASE_SCHEMA_SQL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      fetch('/supabase-schema.sql')
        .then((res) => res.text())
        .then((text) => {
          navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-900/10 via-emerald-800/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Supabase Cloud Backend
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Project: {health.projectRef}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Shared PostgreSQL database & Realtime messaging across Zambian universities
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center px-5 pt-3 border-b border-slate-100 dark:border-slate-800 gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('status')}
            className={`pb-2.5 transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
              activeTab === 'status'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Connection & Health</span>
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`pb-2.5 transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
              activeTab === 'sql'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>1-Click SQL Schema</span>
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-2.5 transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
              activeTab === 'guide'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Multi-Device Sync Guide</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {activeTab === 'status' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Supabase Host
                  </span>
                  <p className="font-mono text-xs text-slate-800 dark:text-slate-200 truncate mt-1">
                    {health.url}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Cloud State
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="font-semibold text-xs text-emerald-700 dark:text-emerald-400">
                      API Gateway Reachable
                    </span>
                  </div>
                </div>
              </div>

              {health.tableReady ? (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs text-emerald-900 dark:text-emerald-200">
                      Live Multi-Student Cloud Database Ready
                    </h4>
                    <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80 mt-0.5">
                      Tables `posts`, `comments`, and `messages` are active. When any student posts or whispers from any device, updates broadcast in real-time.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-1.5 flex-1">
                    <h4 className="font-bold text-xs text-amber-900 dark:text-amber-200">
                      Activate Central Cloud Database Tables
                    </h4>
                    <p className="text-xs text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
                      Your Supabase API credentials are connected! To link shared posts and multi-phone whispers, copy the SQL schema script and run it in your Supabase SQL Editor.
                    </p>
                    <div className="pt-2 flex flex-wrap items-center gap-2">
                      <button
                        onClick={handleCopySql}
                        className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copied ? 'Copied to Clipboard!' : 'Copy SQL Schema'}</span>
                      </button>
                      <a
                        href={`https://supabase.com/dashboard/project/${health.projectRef}/sql/new`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 font-semibold text-xs flex items-center gap-1.5 hover:bg-slate-50 transition-colors"
                      >
                        <span>Open Supabase SQL Editor</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Local offline cache is active to ensure instant loading.
                </span>
                <button
                  onClick={onRefreshHealth}
                  className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Recheck Connection</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'sql' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Paste this into Supabase SQL editor to create the `posts`, `comments`, and `messages` tables with Row Level Security:
                </p>
                <button
                  onClick={handleCopySql}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied!' : 'Copy Script'}</span>
                </button>
              </div>
              <div className="bg-slate-900 rounded-xl p-3.5 font-mono text-[11px] text-emerald-400 overflow-x-auto max-h-64 border border-slate-800">
                <pre>{ZEDWHISPER_SUPABASE_SCHEMA_SQL}</pre>
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <h5 className="font-bold text-slate-900 dark:text-white mb-1">
                  1. Real Students Across Different Phones
                </h5>
                <p>
                  Because fake bot simulations are permanently disabled, all updates and messages reflect real student posts. Connecting Supabase ensures that student A at UNZA Monk Square and student B at CBU Riverside see the exact same campus feed in real-time.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <h5 className="font-bold text-slate-900 dark:text-white mb-1">
                  2. Row Level Security & Privacy
                </h5>
                <p>
                  Whispers and anonymous aliases protect student identity. Doxxing prevention checks block Zambian mobile phone numbers (097/096/095/077/076) automatically before posts reach the database.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Realtime: Broadcast & Postgres Changes enabled
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold text-xs hover:opacity-90 transition-opacity cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
