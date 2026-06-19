import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

export default function LifeBalanceChart({ balanceWheel }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center relative overflow-hidden hover:shadow-md transition-all duration-300">
      <h3 className="font-extrabold text-lg text-gray-950 self-start mb-1">Life Balance Wheel</h3>
      <p className="text-xs text-gray-500 self-start mb-6">Visualizing dimension alignment (1-10)</p>

      <div className="w-full h-72 flex justify-center items-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={balanceWheel}>
            <PolarGrid stroke="#F1F0F7" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "#4B5563", fontSize: 10, fontWeight: 700 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 10]}
              tick={{ fill: "#9CA3AF", fontSize: 8 }}
            />
            <Radar
              name="Alignment"
              dataKey="value"
              stroke="#6C4CF1"
              fill="#8B6CFF"
              fillOpacity={0.25}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
