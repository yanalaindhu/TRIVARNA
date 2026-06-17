import React from 'react';
import { useOnboardingStore } from '../../store/onboardingStore';
import { BALANCE_WHEEL_CATEGORIES } from '../../utils/onboardingQuestions';
import QuestionCard from '../../components/onboarding/QuestionCard';
import NavigationButtons from '../../components/onboarding/NavigationButtons';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts';

export default function BalanceWheelStep({ onNext, onBack }) {
  const { balanceWheel, updateBalanceWheel } = useOnboardingStore();

  const handleSliderChange = (id, val) => {
    updateBalanceWheel({ [id]: val });
  };

  // Convert ZUSTAND state to Recharts formatted array
  const chartData = BALANCE_WHEEL_CATEGORIES.map((cat) => ({
    subject: cat.label,
    score: balanceWheel[cat.id] || 5,
    fullMark: 10,
  }));

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <QuestionCard
        title="Life Balance Wheel"
        subtitle="Rate your current satisfaction (1 to 10) in each life dimension to map your balance architecture."
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
          {/* Sliders Area (LHS) */}
          <div className="lg:col-span-7 space-y-4 max-h-[500px] overflow-y-auto pr-2 bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
            {BALANCE_WHEEL_CATEGORIES.map((cat) => {
              const val = balanceWheel[cat.id] || 5;
              return (
                <div key={cat.id} className="space-y-1">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-text-primary">{cat.label}</span>
                    <span className="text-sm font-extrabold text-primary-purple bg-light-purple/70 px-2.5 py-0.5 rounded-lg border border-primary-purple/10">
                      {val}/10
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={val}
                    onChange={(e) => handleSliderChange(cat.id, parseInt(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-purple focus:outline-none"
                  />
                </div>
              );
            })}
          </div>

          {/* Interactive Chart Area (RHS) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-2xl shadow-sm h-[320px] md:h-[400px]">
            <span className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-2">
              Visual Balance Map
            </span>
            <div className="w-full h-full min-h-[260px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
                  <PolarGrid stroke="#F3F4F6" strokeWidth={1.5} />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: '#6B7280', fontSize: 10, fontWeight: 600 }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 10]}
                    tick={{ fill: '#9CA3AF', fontSize: 9 }}
                    axisLine={false}
                  />
                  <Radar
                    name="Balance"
                    dataKey="score"
                    stroke="#6C4CF1"
                    strokeWidth={2}
                    fill="#8B6CFF"
                    fillOpacity={0.25}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </QuestionCard>

      <NavigationButtons
        onNext={onNext}
        onBack={onBack}
      />
    </div>
  );
}
