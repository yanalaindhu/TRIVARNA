import React from 'react';
import { useOnboardingStore } from '../../store/onboardingStore';
import ScoreCard from '../../components/onboarding/ScoreCard';
import NavigationButtons from '../../components/onboarding/NavigationButtons';
import { Sparkles, BrainCircuit, ShieldAlert, Award, Compass, Heart } from 'lucide-react';

export default function ResultsStep({ onNext, onBack }) {
  const { results } = useOnboardingStore();

  if (!results) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary">Generating results profile...</p>
      </div>
    );
  }

  const {
    mindScore,
    bodyScore,
    lifestyleScore,
    overallScore,
    burnoutRisk,
    coachSummary,
    strengths,
    risks,
    focusAreas,
    productiveWindow,
    primaryGoal
  } = results;

  // Set burnout color scheme
  const getBurnoutColors = (risk) => {
    if (risk === "High") return { text: "text-danger-red", bg: "bg-red-50", border: "border-red-100" };
    if (risk === "Moderate") return { text: "text-warning-yellow", bg: "bg-orange-50", border: "border-orange-100" };
    return { text: "text-success-green", bg: "bg-green-50", border: "border-green-100" };
  };

  const bColor = getBurnoutColors(burnoutRisk);

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fadeIn">
      {/* 1. Page Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 bg-light-purple/75 border border-primary-purple/10 px-4 py-1.5 rounded-full text-primary-purple text-sm font-semibold">
          <Sparkles className="w-4 h-4" />
          <span>Onboarding Analysis Complete</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-text-primary tracking-tight">
          Your Balance Profile
        </h1>
        <p className="text-text-secondary max-w-lg mx-auto text-sm md:text-base">
          TRIVARNA has analyzed your routine, stress nodes, and focus parameters to design your custom plan.
        </p>
      </div>

      {/* 2. Score Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ScoreCard
          title="Overall Balance"
          score={overallScore}
          icon="Compass"
          description="Global balance rating"
          color="purple"
        />
        <ScoreCard
          title="Mind Profile"
          score={mindScore}
          icon="BrainCircuit"
          description="Emotional and stress resilience"
          color="blue"
        />
        <ScoreCard
          title="Body Profile"
          score={bodyScore}
          icon="Heart"
          description="Rest, sleep, and physical energy"
          color="green"
        />
        <ScoreCard
          title="Lifestyle Profile"
          score={lifestyleScore}
          icon="Award"
          description="Task focus and execution habits"
          color="orange"
        />
      </div>

      {/* 3. AI Life Coach Assessment Section */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6 relative overflow-hidden">
        {/* Glow effect in background */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-light-purple/40 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
          <div className="p-2 bg-primary-purple text-white rounded-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-text-primary">AI Balance Coach Insights</h3>
            <p className="text-xs text-text-secondary">Synthesized profile interpretation</p>
          </div>
        </div>

        {/* Narrative interpretation */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-text-secondary">Narrative Assessment</h4>
          <p className="text-base text-text-primary leading-relaxed bg-gray-50/50 p-4 rounded-xl border border-gray-100 italic">
            "{coachSummary}"
          </p>
        </div>

        {/* Critical stats badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className={`p-4 rounded-xl border flex flex-col justify-center ${bColor.bg} ${bColor.border}`}>
            <span className="text-xs font-semibold text-text-secondary uppercase">Burnout Risk Status</span>
            <span className={`text-base font-extrabold mt-1 flex items-center space-x-1.5 ${bColor.text}`}>
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{burnoutRisk} Risk</span>
            </span>
          </div>

          <div className="p-4 rounded-xl border border-gray-200 bg-white flex flex-col justify-center">
            <span className="text-xs font-semibold text-text-secondary uppercase">Productive Window</span>
            <span className="text-base font-extrabold text-primary-purple mt-1 truncate">
              {productiveWindow}
            </span>
          </div>

          <div className="p-4 rounded-xl border border-gray-200 bg-white flex flex-col justify-center">
            <span className="text-xs font-semibold text-text-secondary uppercase">Primary Target Focus</span>
            <span className="text-base font-extrabold text-secondary-purple mt-1 truncate">
              {primaryGoal}
            </span>
          </div>
        </div>

        {/* Strengths and Risks Lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-success-green flex items-center space-x-1">
              <span>👍 Key Strengths</span>
            </h4>
            <ul className="space-y-2">
              {strengths.map((str, idx) => (
                <li key={idx} className="text-sm text-text-primary flex items-start space-x-2.5">
                  <span className="text-success-green font-bold text-base leading-none">•</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-danger-red flex items-center space-x-1">
              <span>⚠️ Potential Risks</span>
            </h4>
            <ul className="space-y-2">
              {risks.map((risk, idx) => (
                <li key={idx} className="text-sm text-text-primary flex items-start space-x-2.5">
                  <span className="text-danger-red font-bold text-base leading-none">•</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <NavigationButtons
        onNext={onNext}
        onBack={onBack}
        nextLabel="Generate My AI Plan"
      />
    </div>
  );
}
