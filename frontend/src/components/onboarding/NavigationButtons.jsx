import React from 'react';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

export default function NavigationButtons({
  onNext,
  onBack,
  isNextDisabled = false,
  nextLabel = 'Next',
  isLoading = false,
  showBack = true
}) {
  return (
    <div className="flex items-center space-x-4 w-full mt-8 pt-4 border-t border-gray-100">
      {showBack && onBack && (
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="flex items-center justify-center space-x-2 px-5 py-3 rounded-xl border border-gray-200 text-text-secondary font-semibold hover:bg-gray-50 hover:text-text-primary disabled:opacity-50 transition-all duration-150"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      )}

      <button
        type="button"
        onClick={onNext}
        disabled={isNextDisabled || isLoading}
        className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-bold shadow-md shadow-primary-purple/10 transition-all duration-200 text-white ${
          isNextDisabled
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
            : 'bg-primary-purple hover:bg-secondary-purple active:scale-[0.98]'
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <span>{nextLabel}</span>
            {nextLabel !== 'Get Started' && nextLabel !== 'Start My Journey' && (
              <ArrowRight className="w-4 h-4" />
            )}
          </>
        )}
      </button>
    </div>
  );
}
