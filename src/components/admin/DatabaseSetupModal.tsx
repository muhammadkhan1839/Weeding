import React, { useState } from 'react';
import { SUPABASE_SQL_SCHEMA } from '../../lib/schema-sql';
import { isSupabaseConfigured } from '../../lib/supabase';
import { useApp } from '../../context/AppContext';
import { Check, Copy, Database, ExternalLink, X, Sparkles, CheckCircle2 } from 'lucide-react';

interface DatabaseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseSetupModal: React.FC<DatabaseSetupModalProps> = ({ isOpen, onClose }) => {
  const { seedInitialDatabase } = useApp();
  const [copied, setCopied] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSeed = async () => {
    setSeeding(true);
    setSeedResult(null);
    const res = await seedInitialDatabase();
    setSeedResult(res);
    setSeeding(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#E8DFD8] shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-[#ECE5DD] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-[#1F1D1B] text-[#FAF8F5] flex items-center justify-center">
              <Database className="w-5 h-5 text-[#D9C3AC]" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-medium text-[#1F1D1B]">
                Supabase Database &amp; Authorization Guide
              </h3>
              <p className="text-xs text-[#6B6158]">
                Setup instructions, SQL schema, and admin assignment
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#7A7067] hover:text-[#1F1D1B] rounded-lg hover:bg-[#F2ECE5] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-[#47413B]">
          {/* Connection Status Banner */}
          <div className={`p-4 rounded-xl border flex items-center justify-between ${
            isSupabaseConfigured
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${isSupabaseConfigured ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
              <div>
                <p className="font-medium text-xs uppercase tracking-wider">
                  Supabase Client: {isSupabaseConfigured ? 'Connected via .env' : 'Pending Credentials in .env'}
                </p>
                <p className="text-xs mt-0.5 opacity-90">
                  {isSupabaseConfigured
                    ? 'Using VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY.'
                    : 'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to sync with your cloud project.'}
                </p>
              </div>
            </div>

            {isSupabaseConfigured && (
              <button
                onClick={handleSeed}
                disabled={seeding}
                className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-800 text-white rounded-md hover:bg-emerald-900 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
              >
                {seeding ? 'Seeding...' : 'Seed Initial Data'}
              </button>
            )}
          </div>

          {seedResult && (
            <div className={`p-3 rounded-lg text-xs ${seedResult.success ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
              {seedResult.message}
            </div>
          )}

          {/* Quick Steps */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1F1D1B]">
              1. Run SQL Migration in Supabase
            </h4>
            <p className="text-xs text-[#6B6158]">
              Copy the SQL schema below and paste it into your Supabase Dashboard under <strong>SQL Editor</strong> &gt; <strong>New Query</strong>. This creates all tables (`services`, `appointments`, `business_hours`, `blocked_dates`, `business_settings`, `admin_users`) and configures secure RLS policies.
            </p>

            <div className="relative">
              <pre className="p-4 bg-[#1F1D1B] text-[#E8DFD8] text-xs font-mono rounded-xl max-h-48 overflow-y-auto leading-relaxed border border-[#38332E]">
                {SUPABASE_SQL_SCHEMA}
              </pre>
              <button
                onClick={handleCopySql}
                className="absolute top-3 right-3 px-3 py-1.5 bg-[#FAF8F5] text-[#1F1D1B] hover:bg-white text-xs font-medium rounded shadow flex items-center space-x-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied SQL!' : 'Copy SQL Script'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-[#ECE5DD]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1F1D1B]">
              2. Grant Admin Access to Your User ID
            </h4>
            <p className="text-xs text-[#6B6158] leading-relaxed">
              When a user creates an account or signs up in Supabase Auth, they receive a unique UUID (<code className="font-mono bg-[#F2ECE5] px-1 py-0.5 rounded">auth.users.id</code>). Per security guidelines, admin access is strictly authorized by verifying that <code className="font-mono bg-[#F2ECE5] px-1 py-0.5 rounded">admin_users.user_id</code> equals your authenticated user id.
            </p>
            <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E8DFD8] text-xs font-mono text-[#38332E]">
              INSERT INTO public.admin_users (user_id) VALUES ('&lt;PASTE_YOUR_AUTH_USER_UUID_HERE&gt;');
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF8F5] border-t border-[#ECE5DD] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#1F1D1B] hover:bg-[#34302C] rounded-md transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
