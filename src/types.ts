export type TemperatureUnit = 'C' | 'F';

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  country?: string;
  admin1?: string; // State or Province
  admin2?: string;
  admin3?: string;
  timezone?: string;
  population?: number;
}

export interface GeocodingResponse {
  results?: GeocodingResult[];
  generationtime_ms?: number;
}

export interface CurrentWeather {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  is_day: number;
  time: string;
}

export interface DailyForecastData {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  apparent_temperature_max?: number[];
  apparent_temperature_min?: number[];
  sunrise?: string[];
  sunset?: string[];
  precipitation_sum?: number[];
  precipitation_probability_max?: number[];
  wind_speed_10m_max?: number[];
  uv_index_max?: number[];
}

export interface HourlyForecastData {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m?: number[];
  weather_code?: number[];
  precipitation_probability?: number[];
  wind_speed_10m?: number[];
}

export interface OpenMeteoForecastResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_weather: CurrentWeather;
  daily: DailyForecastData;
  hourly?: HourlyForecastData;
}

export interface WeatherConditionInfo {
  label: string;
  description: string;
  iconName: string;
  gradientClass: string;
  bgAtmosphere: 'clear-day' | 'clear-night' | 'cloudy' | 'rainy' | 'snowy' | 'thunder' | 'foggy';
  advicePreset: string;
}

export interface PlanningRecommendation {
  id: string;
  category: 'clothing' | 'gear' | 'outdoor' | 'health' | 'alert';
  title: string;
  description: string;
  iconName: string;
  severity: 'info' | 'warning' | 'alert' | 'success';
}

export interface ActivitySuitability {
  name: string;
  category: string;
  score: number; // 0 to 100
  status: 'Ideal' | 'Moderate' | 'Poor' | 'Not Recommended';
  reason: string;
  iconName: string;
}

export interface ProcessedWeatherData {
  location: {
    name: string;
    country?: string;
    admin1?: string;
    latitude: number;
    longitude: number;
    timezone?: string;
  };
  current: {
    tempC: number;
    tempF: number;
    condition: WeatherConditionInfo;
    windSpeedKmH: number;
    windSpeedMph: number;
    windDirectionDeg: number;
    weatherCode: number;
    isDay: boolean;
    time: string;
  };
  daily: Array<{
    date: string;
    formattedDate: string;
    dayOfWeek: string;
    weatherCode: number;
    condition: WeatherConditionInfo;
    maxTempC: number;
    maxTempF: number;
    minTempC: number;
    minTempF: number;
    precipChance: number;
    precipMm: number;
    maxWindKmH: number;
    uvIndex: number;
    sunrise?: string;
    sunset?: string;
  }>;
  hourly: Array<{
    time: string;
    formattedTime: string;
    tempC: number;
    tempF: number;
    weatherCode: number;
    precipChance: number;
    windKmH: number;
    humidity: number;
  }>;
  recommendations: PlanningRecommendation[];
  activities: ActivitySuitability[];
}
