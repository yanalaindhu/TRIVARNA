import React from 'react';
import { useOnboardingStore } from '../../store/onboardingStore';
import NavigationButtons from '../../components/onboarding/NavigationButtons';
import {
  Sparkles,
  Sun,
  Sunset,
  Moon,
  Clock,
  Compass,
  Zap,
  Activity,
  Smile,
  LogOut
} from 'lucide-react';

export default function AIPlanStep({ onNext, onBack }) {
  const { aiPlan, results } = useOnboardingStore();

  if (!aiPlan) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary">Generating AI schedule plan...</p>
      </div>
    );
  }

  const { wakeTime, sleepTarget, schedule } = aiPlan;

  // Map periods to icons & colors
  const periodConfig = {
    Morning: { icon: Sun, color: 'text-amber-500 bg-amber-50 border-amber-100' },
    Afternoon: { icon: Compass, color: 'text-blue-500 bg-blue-50 border-blue-100' },
    Evening: { icon: Sunset, color: 'text-orange-500 bg-orange-50 border-orange-100' },
    Night: { icon: Moon, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
  };

  // Helper to color code tags based on items
  const getItemTagStyle = (type) => {
    if (type === 'mindfulness') return 'bg-purple-100 text-primary-purple border border-purple-200';
    if (type === 'work') return 'bg-red-50 text-danger-red border border-red-100 font-semibold';
    if (type === 'exercise') return 'bg-green-100 text-success-green border border-green-200';
    if (type === 'break') return 'bg-amber-100 text-warning-yellow border border-amber-200';
    if (type === 'sleep') return 'bg-indigo-100 text-indigo-700 border border-indigo-200';
    return 'bg-gray-100 text-text-secondary border border-gray-200';
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fadeIn">
      {/* 1. Page Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 bg-light-purple/75 border border-primary-purple/10 px-4 py-1.5 rounded-full text-primary-purple text-sm font-semibold">
          <Sparkles className="w-4 h-4" />
          <span>Your Personalized Daily Architecture</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-text-primary tracking-tight">
          Your First AI Plan
        </h1>
        <p className="text-text-secondary max-w-lg mx-auto text-sm md:text-base">
          This schedule optimizes your high-energy times, schedules hydration breaks, and anchors daily recovery points.
        </p>
      </div>

      {/* Quick Summary Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-4 text-center">
          <span className="text-xs font-semibold text-text-secondary uppercase">Wake Up Target</span>
          <span className="block text-lg font-extrabold text-text-primary mt-1">{wakeTime}</span>
        </div>
        <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-4 text-center">
          <span className="text-xs font-semibold text-text-secondary uppercase">Peak focus hours</span>
          <span className="block text-lg font-extrabold text-primary-purple mt-1 truncate">
            {results?.productiveWindow || "Morning"}
          </span>
        </div>
        <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-4 text-center">
          <span className="text-xs font-semibold text-text-secondary uppercase">Hydration Target</span>
          <span className="block text-lg font-extrabold text-success-green mt-1">
            {results?.hydration || 8} Glasses / Day
          </span>
        </div>
        <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-4 text-center">
          <span className="text-xs font-semibold text-text-secondary uppercase">Sleep Target</span>
          <span className="block text-lg font-extrabold text-secondary-purple mt-1">{sleepTarget}</span>
        </div>
      </div>

      {/* 2. Schedule Periods Timeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {schedule.map((periodObj) => {
          const cfg = periodConfig[periodObj.period] || periodConfig.Morning;
          const PeriodIcon = cfg.icon;

          return (
            <div
              key={periodObj.period}
              className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300"
            >
              <div>
                {/* Header of period card */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                  <div className="flex items-center space-x-2.5">
                    <div className={`p-2 rounded-lg ${cfg.color} flex-shrink-0`}>
                      <PeriodIcon className="w-5 h-5" />
                    </div>
                    <h3 className="font-extrabold text-base text-text-primary">
                      {periodObj.period}
                    </h3>
                  </div>
                  <span className="text-xs font-medium text-text-secondary bg-gray-100 px-2.5 py-1 rounded-full flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    {periodObj.time}
                  </span>
                </div>

                {/* Sublist of items in period */}
                <div className="space-y-4">
                  {periodObj.items.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3 text-sm">
                      <span className="text-xs font-bold text-primary-purple bg-light-purple/60 px-2 py-0.5 rounded border border-primary-purple/10 flex-shrink-0 mt-0.5 min-w-[70px] text-center">
                        {item.time}
                      </span>
                      <div className="flex-1">
                        <span className="text-text-primary leading-relaxed font-medium block">
                          {item.label}
                        </span>
                        {item.type && (
                          <span className={`inline-block text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full mt-1.5 ${getItemTagStyle(item.type)}`}>
                            {item.type}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Navigation Actions */}
      <NavigationButtons
        onNext={onNext}
        onBack={onBack}
        nextLabel="Start My Journey"
      />
    </div>
  );
}
