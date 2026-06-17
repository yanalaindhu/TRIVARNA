import React from 'react';
import * as Icons from 'lucide-react';

export default function ScoreCard({ title, score, icon, description, color = 'purple' }) {
  const IconComponent = icon ? Icons[icon] : null;

  // SVG Circular progress configurations
  const radius = 32;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Theme color maps
  const colorMap = {
    purple: {
      text: 'text-primary-purple',
      bg: 'bg-light-purple',
      stroke: 'stroke-primary-purple',
      bgStroke: 'stroke-purple-100',
    },
    green: {
      text: 'text-success-green',
      bg: 'bg-green-50',
      stroke: 'stroke-success-green',
      bgStroke: 'stroke-green-100',
    },
    blue: {
      text: 'text-blue-600',
      bg: 'bg-blue-50',
      stroke: 'stroke-blue-600',
      bgStroke: 'stroke-blue-100',
    },
    orange: {
      text: 'text-warning-yellow',
      bg: 'bg-orange-50',
      stroke: 'stroke-warning-yellow',
      bgStroke: 'stroke-orange-100',
    }
  };

  const activeColor = colorMap[color] || colorMap.purple;

  return (
    <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm flex items-center justify-between transition-all duration-300 hover:shadow-md">
      <div className="flex items-center space-x-4 min-w-0">
        {IconComponent && (
          <div className={`p-2.5 rounded-xl ${activeColor.bg} ${activeColor.text} flex-shrink-0`}>
            <IconComponent className="w-6 h-6" />
          </div>
        )}
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-text-secondary truncate">
            {title}
          </h4>
          {description && (
            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[140px] md:max-w-none">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background Track */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            className={`${activeColor.bgStroke}`}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Indicator */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            className={`${activeColor.stroke} transition-all duration-1000 ease-out`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <span className={`absolute text-base font-extrabold tracking-tight ${activeColor.text}`}>
          {score}%
        </span>
      </div>
    </div>
  );
}
