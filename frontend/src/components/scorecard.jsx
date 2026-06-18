import React from 'react';

export default function ScoreCard({ title, score, color = 'purple', subtitle }) {
  const colors = {
    purple: "border-purple-500 text-purple-500 bg-purple-50/30",
    blue: "border-blue-500 text-blue-500 bg-blue-50/30",
    green: "border-green-500 text-green-500 bg-green-50/30",
    orange: "border-orange-500 text-orange-500 bg-orange-50/30",
    red: "border-red-500 text-red-500 bg-red-50/30",
  };

  const activeColor = colors[color] || colors.purple;

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100/50 flex flex-col justify-between hover:shadow-md transition duration-300">
      <div>
        <h3 className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">
          {title}
        </h3>
        {subtitle && (
          <p className="text-[9px] text-gray-400 mt-0.5">{subtitle}</p>
        )}
      </div>

      <div className={`w-16 h-16 rounded-full border-[6px] flex items-center justify-center mt-4 ${activeColor}`}>
        <span className="text-lg font-black">
          {score}
        </span>
      </div>
    </div>
  );
}