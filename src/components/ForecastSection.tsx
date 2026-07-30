import React, { useState } from 'react';
import { ProcessedWeatherData, TemperatureUnit } from '../types';
import { WeatherIcon } from './WeatherIcon';
import { Calendar, TrendingUp, LayoutGrid, Droplets, Wind } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface ForecastSectionProps {
  data: ProcessedWeatherData;
  unit: TemperatureUnit;
}

export const ForecastSection: React.FC<ForecastSectionProps> = ({ data, unit }) => {
  const [viewMode, setViewMode] = useState<'cards' | 'chart'>('cards');

  const chartData = data.daily.map((day) => ({
    day: day.dayOfWeek,
    formattedDate: day.formattedDate,
    maxTemp: unit === 'C' ? day.maxTempC : day.maxTempF,
    minTemp: unit === 'C' ? day.minTempC : day.minTempF,
    precipChance: day.precipChance,
    condition: day.condition.label,
  }));

  const minChartTemp = Math.min(...chartData.map((d) => d.minTemp)) - 3;
  const maxChartTemp = Math.max(...chartData.map((d) => d.maxTemp)) + 3;

  return (
    <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
      {/* Header with Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-100">7-Day Forecast</h3>
            <p className="text-xs text-slate-400">
              Daily maximum & minimum temperature trends
            </p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700/80 w-fit">
          <button
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewMode === 'cards'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Cards</span>
          </button>
          <button
            onClick={() => setViewMode('chart')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewMode === 'chart'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Chart</span>
          </button>
        </div>
      </div>

      {/* Cards View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {data.daily.map((day, idx) => {
            const maxTemp = unit === 'C' ? `${day.maxTempC}°` : `${day.maxTempF}°`;
            const minTemp = unit === 'C' ? `${day.minTempC}°` : `${day.minTempF}°`;

            return (
              <div
                key={day.date}
                className={`flex flex-col justify-between p-4 rounded-2xl border transition hover:border-sky-500/50 hover:bg-slate-800/80 ${
                  idx === 0
                    ? 'bg-sky-950/30 border-sky-500/40'
                    : 'bg-slate-800/40 border-slate-700/50'
                }`}
              >
                {/* Day Header */}
                <div className="text-center space-y-0.5">
                  <div className="text-sm font-bold text-slate-100">
                    {day.dayOfWeek}
                  </div>
                  <div className="text-[10px] text-slate-400">{day.formattedDate}</div>
                </div>

                {/* Weather Icon & Condition */}
                <div className="my-3 flex flex-col items-center text-center space-y-1">
                  <WeatherIcon
                    name={day.condition.iconName}
                    className="w-10 h-10 text-sky-400 drop-shadow-sm"
                  />
                  <div className="text-[11px] font-medium text-slate-300 line-clamp-1">
                    {day.condition.label}
                  </div>
                </div>

                {/* Temperature Range Bar */}
                <div className="space-y-2 pt-2 border-t border-slate-700/40 text-center">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-amber-400">{maxTemp}</span>
                    <span className="text-sky-300">{minTemp}</span>
                  </div>

                  {/* Precipitation Probability pill */}
                  <div className="flex items-center justify-center gap-1 text-[10px] text-sky-300 bg-sky-950/60 py-0.5 px-2 rounded-full border border-sky-800/40">
                    <Droplets className="w-3 h-3 text-sky-400" />
                    <span>{day.precipChance}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Chart View */}
      {viewMode === 'chart' && (
        <div className="space-y-4">
          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="maxTempGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="minTempGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis
                  dataKey="day"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#475569' }}
                />
                <YAxis
                  domain={[minChartTemp, maxChartTemp]}
                  stroke="#94a3b8"
                  fontSize={12}
                  tickFormatter={(val) => `${val}°`}
                  tickLine={false}
                  axisLine={{ stroke: '#475569' }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const dataPoint = payload[0].payload;
                      return (
                        <div className="bg-slate-800 border border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-1">
                          <div className="font-bold text-slate-100">
                            {dataPoint.day} ({dataPoint.formattedDate})
                          </div>
                          <div className="text-slate-300 font-medium">
                            {dataPoint.condition}
                          </div>
                          <div className="text-amber-400 font-bold">
                            Max Temp: {dataPoint.maxTemp}°{unit}
                          </div>
                          <div className="text-sky-400 font-bold">
                            Min Temp: {dataPoint.minTemp}°{unit}
                          </div>
                          <div className="text-sky-300 text-[11px]">
                            Precipitation: {dataPoint.precipChance}%
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="maxTemp"
                  name="Max Temp"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#maxTempGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="minTemp"
                  name="Min Temp"
                  stroke="#38bdf8"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#minTempGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span>Daily High (°{unit})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-sky-400" />
              <span>Daily Low (°{unit})</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
