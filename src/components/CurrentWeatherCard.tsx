import React from 'react';
import { ProcessedWeatherData, TemperatureUnit } from '../types';
import { WeatherIcon } from './WeatherIcon';
import { MapPin, Wind, Droplets, Sun, ArrowUp, ArrowDown, Calendar } from 'lucide-react';
import { getWindDirectionText } from '../utils/weatherUtils';

interface CurrentWeatherCardProps {
  data: ProcessedWeatherData;
  unit: TemperatureUnit;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({ data, unit }) => {
  const { location, current, daily } = data;
  const todayForecast = daily[0];

  const currentTemp = unit === 'C' ? `${current.tempC}°` : `${current.tempF}°`;
  const maxTemp = todayForecast ? (unit === 'C' ? `${todayForecast.maxTempC}°` : `${todayForecast.maxTempF}°`) : '--';
  const minTemp = todayForecast ? (unit === 'C' ? `${todayForecast.minTempC}°` : `${todayForecast.minTempF}°`) : '--';
  const windSpeed = unit === 'C' ? `${current.windSpeedKmH} km/h` : `${current.windSpeedMph} mph`;
  const windDirText = getWindDirectionText(current.windDirectionDeg);

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${current.condition.gradientClass} text-white shadow-2xl p-6 sm:p-8 border border-white/10`}
    >
      {/* Subtle Atmospheric Overlay */}
      <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-64 h-64 rounded-full bg-black/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Location Header & Date */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/15 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-sky-200 shrink-0" />
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {location.name}
              </h2>
            </div>
            <p className="text-sm text-sky-100/80 ml-7">
              {[location.admin1, location.country].filter(Boolean).join(', ')}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-sky-100/90 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full w-fit">
            <Calendar className="w-4 h-4 text-sky-200" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Temperature & Main Icon Display */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="p-4 sm:p-5 rounded-3xl bg-white/15 backdrop-blur-md border border-white/20 shadow-xl">
              <WeatherIcon
                name={current.condition.iconName}
                className="w-16 h-16 sm:w-20 sm:h-20 text-white drop-shadow-md animate-bounce-subtle"
              />
            </div>
            <div>
              <div className="text-5xl sm:text-7xl font-black tracking-tight drop-shadow-md">
                {currentTemp}
              </div>
              <div className="text-lg sm:text-xl font-bold text-sky-100 mt-1">
                {current.condition.label}
              </div>
              <p className="text-xs sm:text-sm text-white/80 line-clamp-1">
                {current.condition.description}
              </p>
            </div>
          </div>

          {/* High / Low Today & Quick Metrics */}
          <div className="space-y-3 bg-black/20 backdrop-blur-md p-4 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between text-sm border-b border-white/10 pb-2.5">
              <span className="text-sky-100/80 text-xs font-semibold uppercase tracking-wider">
                Today's Temperature
              </span>
              <div className="flex items-center gap-3 font-bold text-sm">
                <span className="flex items-center text-amber-300">
                  <ArrowUp className="w-4 h-4 mr-0.5" /> High: {maxTemp}
                </span>
                <span className="flex items-center text-sky-300">
                  <ArrowDown className="w-4 h-4 mr-0.5" /> Low: {minTemp}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              {/* Wind */}
              <div className="p-2 rounded-xl bg-white/5">
                <div className="flex items-center justify-center gap-1 text-sky-200 text-xs font-medium mb-1">
                  <Wind className="w-3.5 h-3.5" />
                  <span>Wind</span>
                </div>
                <div className="text-xs sm:text-sm font-bold">{windSpeed}</div>
                <div className="text-[10px] text-sky-200/70">{windDirText}</div>
              </div>

              {/* Rain Chance */}
              <div className="p-2 rounded-xl bg-white/5">
                <div className="flex items-center justify-center gap-1 text-sky-200 text-xs font-medium mb-1">
                  <Droplets className="w-3.5 h-3.5" />
                  <span>Precipitation</span>
                </div>
                <div className="text-xs sm:text-sm font-bold">
                  {todayForecast?.precipChance ?? 0}%
                </div>
                <div className="text-[10px] text-sky-200/70">
                  {todayForecast?.precipMm ?? 0} mm
                </div>
              </div>

              {/* UV Index */}
              <div className="p-2 rounded-xl bg-white/5">
                <div className="flex items-center justify-center gap-1 text-sky-200 text-xs font-medium mb-1">
                  <Sun className="w-3.5 h-3.5" />
                  <span>UV Index</span>
                </div>
                <div className="text-xs sm:text-sm font-bold">
                  {todayForecast?.uvIndex ?? 0} / 12
                </div>
                <div className="text-[10px] text-sky-200/70">
                  {(todayForecast?.uvIndex ?? 0) >= 6 ? 'High' : 'Moderate'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Weather Advice Banner */}
        <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-3 text-xs sm:text-sm font-medium">
          <div className="p-2 rounded-xl bg-amber-400/20 text-amber-300 shrink-0">
            <Sun className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <span className="font-bold text-amber-300 mr-2">Quick Advice:</span>
            <span className="text-white/90">{current.condition.advicePreset}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
