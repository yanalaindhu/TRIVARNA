import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function QuestionCard({ title, subtitle, error, children }) {
  return (
    <div className="w-full flex flex-col space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-base text-text-secondary leading-relaxed max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>

      <div className="w-full">
        {children}
      </div>

      {error && (
        <div className="flex items-center space-x-2 text-danger-red bg-red-50/50 border border-red-100 p-3.5 rounded-xl text-sm animate-pulse">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}
    </div>
  );
}
