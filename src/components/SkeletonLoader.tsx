import React from 'react';

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Current Weather Card Skeleton */}
      <div className="h-64 rounded-3xl bg-slate-800/80 p-8 flex flex-col justify-between border border-slate-700/50">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-slate-700 rounded-xl" />
          <div className="h-6 w-28 bg-slate-700 rounded-full" />
        </div>
        <div className="flex items-center gap-6">
          <div className="h-20 w-20 bg-slate-700 rounded-2xl shrink-0" />
          <div className="space-y-3">
            <div className="h-12 w-32 bg-slate-700 rounded-xl" />
            <div className="h-5 w-40 bg-slate-700 rounded-lg" />
          </div>
        </div>
        <div className="h-10 w-full bg-slate-700/60 rounded-xl" />
      </div>

      {/* Recommendations Skeleton */}
      <div className="h-48 rounded-3xl bg-slate-800/80 p-6 border border-slate-700/50 space-y-4">
        <div className="h-6 w-56 bg-slate-700 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-16 bg-slate-700/70 rounded-2xl" />
          <div className="h-16 bg-slate-700/70 rounded-2xl" />
        </div>
      </div>

      {/* 7-Day Forecast Cards Skeleton */}
      <div className="h-56 rounded-3xl bg-slate-800/80 p-6 border border-slate-700/50 space-y-4">
        <div className="h-6 w-40 bg-slate-700 rounded-lg" />
        <div className="grid grid-cols-2 sm:grid-cols-7 gap-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-32 bg-slate-700/50 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
};
