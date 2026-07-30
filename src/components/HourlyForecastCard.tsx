import React from 'react';
import { ProcessedWeatherData, TemperatureUnit } from '../types';
import { WeatherIcon } from './WeatherIcon';
import { Clock, Droplets } from 'lucide-react';

interface HourlyForecastCardProps {
  data: ProcessedWeatherData;
  unit: TemperatureUnit;
}

export const HourlyForecastCard: React.FC<HourlyForecastCardProps> = ({ data, unit }) => {
  return (
    <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-4">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-100">24-Hour Hourly Outlook</h3>
          <p className="text-xs text-slate-400">Temperature & rain probability timeline</p>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700">
        {data.hourly.map((item, idx) => {
          const temp = unit === 'C' ? `${item.tempC}°` : `${item.tempF}°`;
          return (
            <div
              key={item.time}
              className={`flex-shrink-0 w-20 p-3 rounded-2xl border text-center space-y-2 transition ${
                idx === 0
                  ? 'bg-sky-950/40 border-sky-500/50 text-white'
                  : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="text-xs font-bold text-slate-200">{item.formattedTime}</div>

              <div className="flex justify-center my-1">
                <WeatherIcon
                  name={
                    item.weatherCode === 0
                      ? 'Sun'
                      : item.weatherCode < 3
                      ? 'CloudSun'
                      : item.weatherCode < 60
                      ? 'Cloud'
                      : 'CloudRain'
                  }
                  className="w-7 h-7 text-sky-400"
                />
              </div>

              <div className="text-sm font-black text-slate-100">{temp}</div>

              {item.precipChance > 0 ? (
                <div className="flex items-center justify-center gap-0.5 text-[10px] text-sky-400 font-semibold">
                  <Droplets className="w-3 h-3" />
                  <span>{item.precipChance}%</span>
                </div>
              ) : (
                <div className="text-[10px] text-slate-500">Dry</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
