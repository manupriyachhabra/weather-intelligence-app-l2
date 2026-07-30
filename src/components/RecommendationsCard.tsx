import React from 'react';
import { ActivitySuitability, PlanningRecommendation } from '../types';
import { WeatherIcon } from './WeatherIcon';
import { Lightbulb, ShieldAlert, AlertCircle, Info, CheckCircle2 } from 'lucide-react';

interface RecommendationsCardProps {
  recommendations: PlanningRecommendation[];
  activities: ActivitySuitability[];
}

export const RecommendationsCard: React.FC<RecommendationsCardProps> = ({
  recommendations,
  activities,
}) => {
  const getSeverityStyle = (severity: PlanningRecommendation['severity']) => {
    switch (severity) {
      case 'alert':
        return {
          bg: 'bg-rose-950/40 border-rose-800/80 text-rose-200',
          badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          icon: ShieldAlert,
          iconColor: 'text-rose-400',
        };
      case 'warning':
        return {
          bg: 'bg-amber-950/40 border-amber-800/80 text-amber-200',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          icon: AlertCircle,
          iconColor: 'text-amber-400',
        };
      case 'success':
        return {
          bg: 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          icon: CheckCircle2,
          iconColor: 'text-emerald-400',
        };
      case 'info':
      default:
        return {
          bg: 'bg-sky-950/40 border-sky-800/80 text-sky-200',
          badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
          icon: Info,
          iconColor: 'text-sky-400',
        };
    }
  };

  const getStatusBadge = (status: ActivitySuitability['status']) => {
    switch (status) {
      case 'Ideal':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Moderate':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Poor':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      case 'Not Recommended':
      default:
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-8">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-100">
              Planning Recommendations
            </h3>
            <p className="text-xs text-slate-400">
              Smart weather advice tailored for your day
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-sky-400">
          Live Advice
        </span>
      </div>

      {/* Primary Actionable Advice Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec) => {
          const style = getSeverityStyle(rec.severity);
          return (
            <div
              key={rec.id}
              className={`p-4 rounded-2xl border ${style.bg} transition hover:scale-[1.01] flex items-start gap-3.5`}
            >
              <div className={`p-2.5 rounded-xl bg-slate-900/60 ${style.iconColor} shrink-0`}>
                <WeatherIcon name={rec.iconName} className="w-5 h-5" />
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-100">{rec.title}</h4>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${style.badgeBg}`}
                  >
                    {rec.category}
                  </span>
                </div>
                <p className="text-xs text-slate-300/90 leading-relaxed">
                  {rec.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Activity Suitability Matrix */}
      <div className="space-y-4 pt-2">
        <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
          Outdoor Activity Suitability
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {activities.map((act) => (
            <div
              key={act.name}
              className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 space-y-2 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-slate-700 text-sky-400">
                    <WeatherIcon name={act.iconName} className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-200">{act.name}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                    act.status
                  )}`}
                >
                  {act.status}
                </span>
                <span className="text-xs text-slate-400 font-mono">{act.score}%</span>
              </div>

              <p className="text-[11px] text-slate-400 line-clamp-2 leading-snug">
                {act.reason}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
