import React from 'react';
import NavigationButtons from '../../components/onboarding/NavigationButtons';
import { Compass } from 'lucide-react';

export default function WelcomeStep({ onNext }) {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-8 py-6 max-w-xl mx-auto">
      {/* Visual Identity Logo Icon */}
      <div className="relative flex items-center justify-center">
        <div className="absolute w-20 h-20 bg-primary-purple/10 rounded-full blur-lg animate-pulse" />
        <div className="w-16 h-16 bg-light-purple border border-primary-purple/20 rounded-2xl flex items-center justify-center text-primary-purple shadow-sm relative z-10">
          <Compass className="w-9 h-9 stroke-[1.8]" />
        </div>
      </div>

      <div className="space-y-3">
        <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight">
          Welcome to <span className="text-primary-purple">TRIVARNA</span>
        </h1>
        <p className="text-lg md:text-xl font-semibold text-secondary-purple tracking-widest uppercase text-xs">
          Mind • Body • Soul
        </p>
      </div>

      <p className="text-base md:text-lg text-text-secondary leading-relaxed max-w-md">
        TRIVARNA will learn about your life, habits, and daily focus to co-create your ultimate personalized balance plan.
      </p>

      {/* Decorative Grid or Badges */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-sm pt-4">
        <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
          <span className="block text-xs font-bold text-text-secondary">🧠 MIND</span>
        </div>
        <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
          <span className="block text-xs font-bold text-text-secondary">💪 BODY</span>
        </div>
        <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
          <span className="block text-xs font-bold text-text-secondary">✨ SOUL</span>
        </div>
      </div>

      <NavigationButtons
        onNext={onNext}
        nextLabel="Get Started"
        showBack={false}
      />
    </div>
  );
}
