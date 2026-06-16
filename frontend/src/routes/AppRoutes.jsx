import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Onboarding from '../pages/onboarding/Onboarding';
import { useOnboardingStore } from '../store/onboardingStore';
import { Sparkles, Compass, CheckCircle2, RefreshCw } from 'lucide-react';

// Simplified high-fidelity dashboard placeholder
function DashboardPlaceholder() {
  const { results, resetOnboarding } = useOnboardingStore();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between antialiased">
      <header className="bg-white border-b border-gray-100 py-4 px-6 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 bg-light-purple text-primary-purple border border-primary-purple/20 rounded-xl flex items-center justify-center">
              <Compass className="w-5 h-5 stroke-[2]" />
            </div>
            <span className="text-xl font-black text-text-primary tracking-tight">TRIVARNA</span>
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-success-green bg-green-50 border border-green-100 px-3 py-1 rounded-full flex items-center">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            Active Plan Sync
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8 flex flex-col justify-center">
        <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm space-y-6 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 bg-light-purple text-primary-purple border border-primary-purple/20 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Sparkles className="w-8 h-8" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-text-primary">TRIVARNA Dashboard</h1>
            <p className="text-text-secondary text-sm md:text-base leading-relaxed">
              Welcome back! Your balance scores and first daily plan are fully loaded and synchronized with your account.
            </p>
          </div>

          {results && (
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-left space-y-2">
              <span className="text-xs font-bold uppercase tracking-wide text-text-secondary">Synced Focus Parameters</span>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Primary Target:</span>
                <span className="font-bold text-primary-purple">{results.primaryGoal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Productive Window:</span>
                <span className="font-bold text-secondary-purple">{results.productiveWindow}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Overall Score:</span>
                <span className="font-bold text-success-green">{results.overallScore}%</span>
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={() => {
                resetOnboarding();
                window.location.href = '/onboarding';
              }}
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl border border-gray-200 text-text-secondary hover:bg-gray-50 font-bold text-sm transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset & Restart Onboarding</span>
            </button>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-100 py-4 text-center text-xs text-text-secondary">
        © {new Date().getFullYear()} TRIVARNA. All rights reserved.
      </footer>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/dashboard" element={<DashboardPlaceholder />} />
      <Route path="*" element={<Navigate to="/onboarding" replace />} />
    </Routes>
  );
}
