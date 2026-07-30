import React, { useState, useEffect, useCallback } from 'react';
import { GeocodingResult, ProcessedWeatherData, TemperatureUnit } from './types';
import { fetchWeatherData, searchCities } from './utils/weatherUtils';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { RecommendationsCard } from './components/RecommendationsCard';
import { ForecastSection } from './components/ForecastSection';
import { HourlyForecastCard } from './components/HourlyForecastCard';
import { WeatherDetailsGrid } from './components/WeatherDetailsGrid';
import { SkeletonLoader } from './components/SkeletonLoader';
import { AlertCircle, RefreshCw, Sparkles, MapPin } from 'lucide-react';

const DEFAULT_CITY: GeocodingResult = {
  id: 2643743,
  name: 'London',
  latitude: 51.50853,
  longitude: -0.12574,
  country: 'United Kingdom',
  admin1: 'England',
  country_code: 'GB',
};

export default function App() {
  const [unit, setUnit] = useState<TemperatureUnit>(() => {
    const saved = localStorage.getItem('wi_temp_unit');
    return (saved as TemperatureUnit) || 'C';
  });

  const [weatherData, setWeatherData] = useState<ProcessedWeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('wi_recent_searches');
      return saved ? JSON.parse(saved) : ['London', 'Tokyo', 'New York', 'Paris'];
    } catch {
      return ['London', 'Tokyo', 'New York', 'Paris'];
    }
  });

  const saveRecentSearch = (cityName: string) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== cityName.toLowerCase());
      const updated = [cityName, ...filtered].slice(0, 5);
      localStorage.setItem('wi_recent_searches', JSON.stringify(updated));
      return updated;
    });
  };

  const handleUnitChange = (newUnit: TemperatureUnit) => {
    setUnit(newUnit);
    localStorage.setItem('wi_temp_unit', newUnit);
  };

  // Main data fetching logic for a selected Geocoding location
  const loadWeatherForLocation = useCallback(async (location: GeocodingResult) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchWeatherData(location);
      setWeatherData(data);
      saveRecentSearch(location.name);
    } catch (err: any) {
      console.error('Weather Fetch Error:', err);
      setErrorMessage(
        err.message || 'Unable to fetch data for this location. Please check network connection.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Search by plain city query string
  const handleQuerySearch = async (query: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const results = await searchCities(query);
      if (results && results.length > 0) {
        await loadWeatherForLocation(results[0]);
      } else {
        setErrorMessage(`City "${query}" not found. Please try another search term.`);
        setIsLoading(false);
      }
    } catch (err) {
      setErrorMessage('Unable to complete city geocoding search.');
      setIsLoading(false);
    }
  };

  // Geolocation detection handler
  const handleLocationClick = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Attempt reverse search or create direct location object
          const mockGeoLocation: GeocodingResult = {
            id: Date.now(),
            name: 'Current Location',
            latitude,
            longitude,
            admin1: 'GPS Detected',
            country: 'My Device',
          };
          await loadWeatherForLocation(mockGeoLocation);
        } catch (err) {
          setErrorMessage('Failed to load weather for current GPS coordinates.');
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setErrorMessage('Location permission denied. Please search for a city name.');
        } else {
          setErrorMessage('Unable to retrieve GPS position.');
        }
      },
      { timeout: 10000 }
    );
  };

  // Initial load on component mount
  useEffect(() => {
    loadWeatherForLocation(DEFAULT_CITY);
  }, [loadWeatherForLocation]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-sky-500 selection:text-white">
      {/* Header bar */}
      <Header
        unit={unit}
        onUnitChange={handleUnitChange}
        onLocationClick={handleLocationClick}
        isLocating={isLocating}
        onQuickSelectCity={handleQuerySearch}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Search Bar & Auto-suggestions */}
        <SearchBar
          onSelectCity={loadWeatherForLocation}
          isLoading={isLoading}
          recentSearches={recentSearches}
          onSelectRecent={handleQuerySearch}
        />

        {/* Error Alert Display */}
        {errorMessage && (
          <div className="max-w-2xl mx-auto bg-rose-950/60 border border-rose-800 text-rose-200 p-4 rounded-2xl flex items-start gap-3 shadow-xl animate-fade-in">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <h4 className="text-sm font-bold">Search Error</h4>
              <p className="text-xs text-rose-300">{errorMessage}</p>
            </div>
            <button
              onClick={() => handleQuerySearch('London')}
              className="px-3 py-1 bg-rose-900/80 hover:bg-rose-800 text-xs font-semibold rounded-lg transition shrink-0"
            >
              Reset to London
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && <SkeletonLoader />}

        {/* Main Weather Sections */}
        {!isLoading && weatherData && (
          <div className="space-y-8 animate-fade-in">
            {/* 1. Current Weather Section */}
            <CurrentWeatherCard data={weatherData} unit={unit} />

            {/* 2. Planning Recommendations Section */}
            <RecommendationsCard
              recommendations={weatherData.recommendations}
              activities={weatherData.activities}
            />

            {/* 3. 7-Day Forecast Section (Cards & Chart) */}
            <ForecastSection data={weatherData} unit={unit} />

            {/* 4. 24-Hour Hourly Forecast Timeline */}
            <HourlyForecastCard data={weatherData} unit={unit} />

            {/* 5. Detailed Weather Metrics Grid */}
            <WeatherDetailsGrid data={weatherData} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span className="font-semibold text-slate-400">Weather Intelligence</span>
            <span>— Powered by free Open-Meteo APIs</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>No API Keys Required</span>
            <span>•</span>
            <span>Real-time Geocoding & Forecasts</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
