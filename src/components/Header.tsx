import React from 'react';
import { TemperatureUnit } from '../types';
import { CloudSun, Navigation } from 'lucide-react';

interface HeaderProps {
  unit: TemperatureUnit;
  onUnitChange: (unit: TemperatureUnit) => void;
  onLocationClick: () => void;
  isLocating: boolean;
  onQuickSelectCity: (cityName: string) => void;
}

const POPULAR_CITIES = ['London', 'Tokyo', 'New York', 'Paris', 'Sydney', 'Dubai'];

export const Header: React.FC<HeaderProps> = ({
  unit,
  onUnitChange,
  onLocationClick,
  isLocating,
  onQuickSelectCity,
}) => {
  return (
    <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/20">
            <CloudSun className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-sky-300 bg-clip-text text-transparent">
              Weather Intelligence
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              Precision forecast & smart planning recommendations
            </p>
          </div>
        </div>

        {/* Popular Quick Cities & Control Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick city pill selection (hidden on tiny screens) */}
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-800/60 p-1 rounded-lg border border-slate-700/50">
            {POPULAR_CITIES.map((city) => (
              <button
                key={city}
                onClick={() => onQuickSelectCity(city)}
                className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-700/80 rounded-md transition"
              >
                {city}
              </button>
            ))}
          </div>

          {/* Location button */}
          <button
            onClick={onLocationClick}
            disabled={isLocating}
            title="Use current GPS location"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition disabled:opacity-50"
          >
            <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-sky-400' : 'text-sky-400'}`} />
            <span className="hidden sm:inline">{isLocating ? 'Locating...' : 'My Location'}</span>
          </button>

          {/* Metric / Imperial Unit Switcher */}
          <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => onUnitChange('C')}
              className={`px-2.5 py-1 text-xs font-bold rounded-md transition ${
                unit === 'C'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              °C
            </button>
            <button
              onClick={() => onUnitChange('F')}
              className={`px-2.5 py-1 text-xs font-bold rounded-md transition ${
                unit === 'F'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              °F
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
