import React from 'react';
import NavigationButtons from '../../components/onboarding/NavigationButtons';
import { Compass } from 'lucide-react';

export default function WelcomeStep({ onNext }) {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-8 py-6 max-w-xl mx-auto">
      {/* Visual Identity Logo Icon */}
      <div className="relative flex items-center justify-center">
        <div className="absolute w-24 h-24 bg-primary-purple/15 rounded-full blur-xl animate-pulse" />
        <img
          src="/logo.png"
          alt="Trivarna Logo"
          className="w-28 h-28 object-contain relative z-10 filter drop-shadow-[0_4px_12px_rgba(108,76,241,0.2)]"
        />
      </div>

      <div className="space-y-3">
        <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight">
          Welcome to <span className="text-primary-purple">TRIVARNA</span> 
        </h1>
        
        <p className="text-lg md:text-xl font-semibold text-secondary-purple tracking-widest uppercase text-xs">
          Mind 🧠 • Body 💪 • Life 🌱
        </p>
      </div>

      <p className="text-base md:text-lg text-text-secondary leading-relaxed max-w-md">
        TRIVARNA will learn about your life, habits, and daily focus to co-create your ultimate personalized balance plan.
      </p>

      {/* Decorative Grid or Badges */}
      

      <NavigationButtons
        onNext={onNext}
        nextLabel="Get Started"
        showBack={false}
      />
    </div>
  );
}
