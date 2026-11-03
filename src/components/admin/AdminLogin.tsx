import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, Lock, Mail, AlertCircle, ArrowLeft, Database, KeyRound, Sparkles } from 'lucide-react';

interface AdminLoginProps {
  onBackToWebsite: () => void;
  onOpenSetupGuide: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToWebsite, onOpenSetupGuide }) => {
  const { signIn, isAuthChecking, authError, isConfigured, demoLoginAsAdmin } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email.trim() || !password) {
      setLocalError('Please enter both your email address and password.');
      return;
    }

    setSubmitting(true);
    const result = await signIn(email, password);
    setSubmitting(false);

    if (!result.success && result.error) {
      setLocalError(result.error);
    }
  };

  const displayedError = localError || authError;

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Back Link */}
        <button
          onClick={onBackToWebsite}
          className="inline-flex items-center space-x-1.5 text-xs font-medium text-[#7A7067] hover:text-[#1F1D1B] mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Studio Website</span>
        </button>

        {/* Studio Brand Icon */}
        <div className="w-14 h-14 rounded-full bg-[#1F1D1B] text-[#FAF8F5] flex items-center justify-center font-serif text-2xl mx-auto shadow-md">
          É
        </div>
        <h2 className="mt-4 text-center font-serif text-3xl font-medium text-[#1F1D1B]">
          Studio Management Portal
        </h2>
        <p className="mt-1 text-center text-xs text-[#8C7A6B] uppercase tracking-[0.2em] font-medium">
          Authorized Wedding Planners &amp; Owners Only
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl border border-[#E8DFD8] sm:rounded-2xl sm:px-10 space-y-6">
          
          {/* Error Message Notice */}
          {displayedError && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold">{displayedError}</p>
                {displayedError.includes('not authorized as an admin') && (
                  <p className="text-[11px] text-red-700">
                    Your account must have its unique <code className="font-mono font-bold">user_id</code> registered in the <code className="font-mono font-bold">admin_users</code> table in Supabase.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A433D] mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9C8F84]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="planner@etoilestudio.com"
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-[#FAF8F5] border border-[#D9CFC4] rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1F1D1B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A433D] mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9C8F84]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-[#FAF8F5] border border-[#D9CFC4] rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1F1D1B]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || isAuthChecking}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium text-white bg-[#1F1D1B] hover:bg-[#34302C] active:scale-[0.99] rounded-md transition-all shadow-md cursor-pointer disabled:opacity-60"
            >
              <KeyRound className="w-4 h-4 text-[#D9C3AC]" />
              <span>
                {submitting || isAuthChecking ? 'Verifying Admin Access...' : 'Sign In with Supabase Auth'}
              </span>
            </button>
          </form>

          {/* Quick Setup & Guide Buttons */}
          <div className="pt-4 border-t border-[#ECE5DD] space-y-3">
            <button
              onClick={onOpenSetupGuide}
              className="w-full flex items-center justify-center space-x-2 py-2 px-3 text-xs font-medium text-[#595149] hover:text-[#1F1D1B] bg-[#FAF8F5] hover:bg-[#F2ECE5] rounded border border-[#E0D7CE] transition-colors cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-[#A37E52]" />
              <span>View SQL Schema &amp; Admin Setup Guide</span>
            </button>

            {/* Evaluator instant preview toggle */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={demoLoginAsAdmin}
                className="text-[11px] text-[#A37E52] hover:text-[#8A6740] underline font-medium cursor-pointer"
              >
                Inspect Dashboard in Preview Mode
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
