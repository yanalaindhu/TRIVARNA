import React from "react";

export default function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-[#F8F7FF] flex flex-col p-4 md:p-8 space-y-6 animate-pulse">
      {/* Top bar placeholder */}
      <div className="h-10 bg-gray-200/80 rounded-xl max-w-md" />

      {/* Header placeholder */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="w-20 h-20 bg-gray-200/80 rounded-full flex-shrink-0" />
          <div className="space-y-2.5 flex-1">
            <div className="h-6 bg-gray-200/80 rounded w-48" />
            <div className="h-4 bg-gray-200/80 rounded w-32" />
            <div className="h-3 bg-gray-200/80 rounded w-40" />
          </div>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="h-12 w-28 bg-gray-200/80 rounded-xl flex-1 md:flex-initial" />
          <div className="h-12 w-28 bg-gray-200/80 rounded-xl flex-1 md:flex-initial" />
        </div>
      </div>

      {/* Score Grid placeholder */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-xl p-5 space-y-3">
            <div className="h-4 bg-gray-200/80 rounded w-24" />
            <div className="h-8 bg-gray-200/80 rounded w-16" />
            <div className="h-3 bg-gray-200/80 rounded w-36" />
          </div>
        ))}
      </div>

      {/* Main layout grid placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Insights, Goals & AI Schedule */}
        <div className="lg:col-span-2 space-y-6">
          {/* Insights placeholder */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
            <div className="h-5 bg-gray-200/80 rounded w-48" />
            <div className="h-20 bg-gray-200/80 rounded" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="h-14 bg-gray-200/80 rounded-lg" />
              <div className="h-14 bg-gray-200/80 rounded-lg" />
              <div className="h-14 bg-gray-200/80 rounded-lg" />
            </div>
          </div>

          {/* AI Plan placeholder */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
            <div className="h-5 bg-gray-200/80 rounded w-48" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-28 bg-gray-200/80 rounded-xl" />
              ))}
            </div>
          </div>
        </div>

        {/* Right column - Radar & Badges */}
        <div className="space-y-6">
          {/* Balance Chart placeholder */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center space-y-4">
            <div className="h-5 bg-gray-200/80 rounded w-48 self-start" />
            <div className="w-48 h-48 bg-gray-200/80 rounded-full mt-4" />
          </div>

          {/* Badges placeholder */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
            <div className="h-5 bg-gray-200/80 rounded w-48" />
            <div className="flex flex-wrap gap-2.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-8 w-28 bg-gray-200/80 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
