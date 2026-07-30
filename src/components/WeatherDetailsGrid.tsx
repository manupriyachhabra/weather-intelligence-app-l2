import React from 'react';
import { ProcessedWeatherData } from '../types';
import { Sunrise, Sunset, Wind, Droplets, Sun, Compass, Gauge, ShieldCheck } from 'lucide-react';
import { getWindDirectionText } from '../utils/weatherUtils';

interface WeatherDetailsGridProps {
  data: ProcessedWeatherData;
}

export const WeatherDetailsGrid: React.FC<WeatherDetailsGridProps> = ({ data }) => {
  const { current, daily, location } = data;
  const today = daily[0];

  const windText = getWindDirectionText(current.windDirectionDeg);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Sunrise & Sunset */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
          <Sunrise className="w-4 h-4 text-amber-400" />
          <span>Sun Schedule</span>
        </div>
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Sunrise className="w-3.5 h-3.5 text-amber-400" /> Sunrise
            </span>
            <span className="text-sm font-bold text-slate-100">
              {today?.sunrise || '06:00 AM'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Sunset className="w-3.5 h-3.5 text-orange-400" /> Sunset
            </span>
            <span className="text-sm font-bold text-slate-100">
              {today?.sunset || '07:30 PM'}
            </span>
          </div>
        </div>
      </div>

      {/* Wind Metrics */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
          <Wind className="w-4 h-4 text-sky-400" />
          <span>Wind Metrics</span>
        </div>
        <div>
          <div className="text-2xl font-black text-slate-100">
            {current.windSpeedKmH} <span className="text-xs font-normal text-slate-400">km/h</span>
          </div>
          <p className="text-xs text-sky-300 font-medium mt-1 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5" />
            Direction: {windText} ({current.windDirectionDeg}°)
          </p>
        </div>
      </div>

      {/* UV Index Level */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
          <Sun className="w-4 h-4 text-amber-400" />
          <span>UV Index</span>
        </div>
        <div>
          <div className="text-2xl font-black text-slate-100">
            {today?.uvIndex ?? 0} <span className="text-xs font-normal text-slate-400">/ 12</span>
          </div>
          <p className="text-xs font-medium mt-1 text-slate-300">
            {(today?.uvIndex ?? 0) >= 8
              ? 'Very High — Avoid midday sun'
              : (today?.uvIndex ?? 0) >= 6
              ? 'High — Wear SPF 30+'
              : 'Moderate — Low protection needed'}
          </p>
        </div>
      </div>

      {/* Humidity & Precipitation */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
          <Droplets className="w-4 h-4 text-teal-400" />
          <span>Precipitation Risk</span>
        </div>
        <div>
          <div className="text-2xl font-black text-slate-100">
            {today?.precipChance ?? 0}%
          </div>
          <p className="text-xs text-slate-300 font-medium mt-1">
            Total Volume: {today?.precipMm ?? 0} mm today
          </p>
        </div>
      </div>
    </div>
  );
};
