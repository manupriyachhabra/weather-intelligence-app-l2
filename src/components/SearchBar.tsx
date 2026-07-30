import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2, History } from 'lucide-react';
import { GeocodingResult } from '../types';
import { searchCities } from '../utils/weatherUtils';

interface SearchBarProps {
  onSelectCity: (location: GeocodingResult) => void;
  isLoading: boolean;
  recentSearches: string[];
  onSelectRecent: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSelectCity,
  isLoading,
  recentSearches,
  onSelectRecent,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced geocoding search
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      setErrorMsg(null);
      try {
        const matches = await searchCities(query);
        setResults(matches);
        setIsOpen(true);
        if (matches.length === 0) {
          setErrorMsg(`No cities found matching "${query}"`);
        }
      } catch (err) {
        setErrorMsg('Unable to reach geocoding service');
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: GeocodingResult) => {
    onSelectCity(city);
    setQuery('');
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (results.length > 0) {
      handleSelect(results[0]);
    } else {
      setIsSearching(true);
      try {
        const matches = await searchCities(query);
        if (matches.length > 0) {
          handleSelect(matches[0]);
        } else {
          setErrorMsg(`City "${query}" not found`);
        }
      } catch (err) {
        setErrorMsg('Failed to search city');
      } finally {
        setIsSearching(false);
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-2.5">
      <div ref={dropdownRef} className="relative">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <div className="absolute left-4 text-slate-400 pointer-events-none">
            {isSearching || isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-sky-400" />
            ) : (
              <Search className="w-5 h-5 text-slate-400" />
            )}
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length >= 2 && results.length > 0 && setIsOpen(true)}
            placeholder="Search city name (e.g., Tokyo, London, San Francisco)..."
            className="w-full pl-12 pr-10 py-3.5 bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 focus:border-sky-500 rounded-2xl text-slate-100 placeholder-slate-400 text-sm sm:text-base outline-none shadow-xl transition-all focus:ring-2 focus:ring-sky-500/20"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setResults([]);
                setIsOpen(false);
                setErrorMsg(null);
              }}
              className="absolute right-3 p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-700/60 transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>

        {/* Autocomplete Dropdown */}
        {isOpen && (
          <div className="absolute z-40 left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden max-h-80 overflow-y-auto divide-y divide-slate-700/50">
            {results.map((city) => (
              <button
                key={`${city.id}-${city.latitude}-${city.longitude}`}
                onClick={() => handleSelect(city)}
                className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-slate-700/70 transition text-slate-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-700 group-hover:bg-sky-500/20 group-hover:text-sky-400 text-slate-400 transition">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-100 group-hover:text-sky-300 transition">
                      {city.name}
                    </div>
                    <div className="text-xs text-slate-400">
                      {[city.admin1, city.country].filter(Boolean).join(', ')}
                    </div>
                  </div>
                </div>
                {city.country_code && (
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900/60 text-slate-400 border border-slate-700">
                    {city.country_code}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Geocoding Search Error Message */}
        {errorMsg && !isOpen && (
          <div className="mt-2 text-xs text-rose-400 bg-rose-950/40 border border-rose-800/60 rounded-xl px-3.5 py-2 flex items-center justify-between">
            <span>{errorMsg}</span>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-rose-400 hover:text-rose-200 text-xs underline"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Recent Searches Pills */}
      {recentSearches.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs text-slate-400">
          <History className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="shrink-0 text-slate-500">Recent:</span>
          <div className="flex items-center gap-1.5">
            {recentSearches.map((term) => (
              <button
                key={term}
                onClick={() => onSelectRecent(term)}
                className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 hover:text-white transition whitespace-nowrap"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
