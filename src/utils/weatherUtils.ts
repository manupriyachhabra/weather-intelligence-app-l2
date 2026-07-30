import {
  ActivitySuitability,
  GeocodingResponse,
  GeocodingResult,
  OpenMeteoForecastResponse,
  PlanningRecommendation,
  ProcessedWeatherData,
  WeatherConditionInfo,
} from '../types';

export function cToF(celsius: number): number {
  return Math.round((celsius * 9) / 5 + 32);
}

export function kmhToMph(kmh: number): number {
  return Math.round(kmh * 0.621371);
}

export function getWindDirectionText(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index] || 'N';
}

export function getWMOInfo(code: number, isDay: boolean = true): WeatherConditionInfo {
  switch (code) {
    case 0:
      return {
        label: isDay ? 'Clear Sky' : 'Clear Night',
        description: isDay ? 'Bright sunny skies' : 'Clear starry night',
        iconName: isDay ? 'Sun' : 'Moon',
        gradientClass: isDay
          ? 'from-amber-400 via-orange-400 to-sky-500'
          : 'from-slate-900 via-indigo-950 to-slate-900',
        bgAtmosphere: isDay ? 'clear-day' : 'clear-night',
        advicePreset: 'Wear sunglasses & stay hydrated',
      };
    case 1:
      return {
        label: 'Mainly Clear',
        description: 'Mostly clear with faint clouds',
        iconName: isDay ? 'SunDim' : 'MoonStar',
        gradientClass: isDay
          ? 'from-sky-400 via-blue-400 to-indigo-500'
          : 'from-slate-800 via-indigo-900 to-slate-900',
        bgAtmosphere: isDay ? 'clear-day' : 'clear-night',
        advicePreset: 'Great weather for outdoor walks',
      };
    case 2:
      return {
        label: 'Partly Cloudy',
        description: 'Scattered clouds in the sky',
        iconName: isDay ? 'CloudSun' : 'CloudMoon',
        gradientClass: 'from-sky-400 via-indigo-400 to-slate-500',
        bgAtmosphere: 'cloudy',
        advicePreset: 'Pleasant temperatures, comfortable for all activities',
      };
    case 3:
      return {
        label: 'Overcast',
        description: 'Dense cloud cover',
        iconName: 'Cloud',
        gradientClass: 'from-slate-400 via-zinc-500 to-slate-700',
        bgAtmosphere: 'cloudy',
        advicePreset: 'Light jacket recommended; subdued sunlight',
      };
    case 45:
    case 48:
      return {
        label: code === 48 ? 'Depositing Rime Fog' : 'Foggy',
        description: 'Low visibility due to fog',
        iconName: 'CloudFog',
        gradientClass: 'from-slate-300 via-zinc-400 to-slate-500',
        bgAtmosphere: 'foggy',
        advicePreset: 'Drive with low-beam headlights & extra caution',
      };
    case 51:
    case 53:
    case 55:
      return {
        label: 'Drizzle',
        description: 'Continuous light misty precipitation',
        iconName: 'CloudDrizzle',
        gradientClass: 'from-teal-500 via-cyan-600 to-slate-700',
        bgAtmosphere: 'rainy',
        advicePreset: 'Carry a water-resistant jacket or small umbrella',
      };
    case 56:
    case 57:
      return {
        label: 'Freezing Drizzle',
        description: 'Freezing rain droplets creating slick roads',
        iconName: 'CloudHail',
        gradientClass: 'from-cyan-600 via-sky-700 to-slate-800',
        bgAtmosphere: 'rainy',
        advicePreset: 'Watch for slippery sidewalks & icy road surfaces',
      };
    case 61:
      return {
        label: 'Slight Rain',
        description: 'Light rainfall showers',
        iconName: 'CloudRain',
        gradientClass: 'from-blue-500 via-sky-600 to-slate-700',
        bgAtmosphere: 'rainy',
        advicePreset: 'Pack an umbrella before stepping out',
      };
    case 63:
      return {
        label: 'Moderate Rain',
        description: 'Steady steady rain showers',
        iconName: 'CloudRainWind',
        gradientClass: 'from-blue-600 via-indigo-700 to-slate-800',
        bgAtmosphere: 'rainy',
        advicePreset: 'Waterproof footwear & sturdy umbrella essential',
      };
    case 65:
      return {
        label: 'Heavy Rain',
        description: 'Heavy pouring rainfall',
        iconName: 'CloudRainWind',
        gradientClass: 'from-indigo-700 via-slate-800 to-zinc-900',
        bgAtmosphere: 'rainy',
        advicePreset: 'Stay indoors if possible; severe rain in progress',
      };
    case 66:
    case 67:
      return {
        label: 'Freezing Rain',
        description: 'Freezing precipitation freezing on contact',
        iconName: 'CloudHail',
        gradientClass: 'from-cyan-700 via-blue-800 to-slate-900',
        bgAtmosphere: 'rainy',
        advicePreset: 'Icy hazardous travel warnings in effect',
      };
    case 71:
    case 73:
      return {
        label: 'Snowfall',
        description: 'Light to moderate snow accumulation',
        iconName: 'Snowflake',
        gradientClass: 'from-sky-300 via-indigo-400 to-slate-600',
        bgAtmosphere: 'snowy',
        advicePreset: 'Wear thermal layers, gloves & snow boots',
      };
    case 75:
    case 77:
      return {
        label: 'Heavy Snow',
        description: 'Heavy snow grains and snowfall',
        iconName: 'Snowflake',
        gradientClass: 'from-blue-200 via-sky-400 to-slate-700',
        bgAtmosphere: 'snowy',
        advicePreset: 'Heavy snow warnings. Keep warm winter gear ready',
      };
    case 80:
    case 81:
    case 82:
      return {
        label: 'Rain Showers',
        description: 'Intermittent rain showers',
        iconName: 'CloudRain',
        gradientClass: 'from-sky-500 via-blue-600 to-slate-700',
        bgAtmosphere: 'rainy',
        advicePreset: 'Keep an umbrella handy for sudden pass-by rain',
      };
    case 85:
    case 86:
      return {
        label: 'Snow Showers',
        description: 'Brief heavy snow flurries',
        iconName: 'Snowflake',
        gradientClass: 'from-indigo-300 via-sky-500 to-slate-700',
        bgAtmosphere: 'snowy',
        advicePreset: 'Bundle up warmly against cold sudden flurries',
      };
    case 95:
    case 96:
    case 99:
      return {
        label: 'Thunderstorm',
        description: 'Thunderstorms with potential lightning or hail',
        iconName: 'CloudLightning',
        gradientClass: 'from-purple-800 via-slate-900 to-black',
        bgAtmosphere: 'thunder',
        advicePreset: 'Seek shelter indoors! Avoid open fields & trees',
      };
    default:
      return {
        label: 'Unknown Conditions',
        description: 'Variable weather conditions',
        iconName: 'Cloud',
        gradientClass: 'from-blue-500 via-indigo-600 to-slate-700',
        bgAtmosphere: 'clear-day',
        advicePreset: 'Check detailed forecast metrics before travel',
      };
  }
}

export async function searchCities(query: string): Promise<GeocodingResult[]> {
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanQuery)}&count=10&language=en&format=json`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to reach geocoding service');
  }

  const data: GeocodingResponse = await response.json();
  return data.results || [];
}

export async function fetchWeatherData(
  location: GeocodingResult
): Promise<ProcessedWeatherData> {
  const { latitude, longitude, name, country, admin1 } = location;

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max&hourly=temperature_2m,relative_humidity_2m,weather_code,precipitation_probability,wind_speed_10m&timezone=auto`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Unable to fetch weather forecast data');
  }

  const data: OpenMeteoForecastResponse = await response.json();

  const currentTempC = Math.round(data.current_weather.temperature);
  const currentTempF = cToF(data.current_weather.temperature);
  const isDay = data.current_weather.is_day === 1;
  const condition = getWMOInfo(data.current_weather.weathercode, isDay);

  // Process 7-day forecast
  const dailyList = data.daily.time.map((dateStr, idx) => {
    const dateObj = new Date(dateStr + 'T00:00:00');
    const dayOfWeek = idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    const maxC = Math.round(data.daily.temperature_2m_max[idx]);
    const minC = Math.round(data.daily.temperature_2m_min[idx]);
    const code = data.daily.weather_code[idx];

    // Sunrise & Sunset formatting
    const sunriseRaw = data.daily.sunrise?.[idx];
    const sunsetRaw = data.daily.sunset?.[idx];
    const sunrise = sunriseRaw ? new Date(sunriseRaw).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : undefined;
    const sunset = sunsetRaw ? new Date(sunsetRaw).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : undefined;

    return {
      date: dateStr,
      formattedDate,
      dayOfWeek,
      weatherCode: code,
      condition: getWMOInfo(code, true),
      maxTempC: maxC,
      maxTempF: cToF(maxC),
      minTempC: minC,
      minTempF: cToF(minC),
      precipChance: data.daily.precipitation_probability_max?.[idx] ?? 0,
      precipMm: data.daily.precipitation_sum?.[idx] ?? 0,
      maxWindKmH: Math.round(data.daily.wind_speed_10m_max?.[idx] ?? 0),
      uvIndex: Math.round(data.daily.uv_index_max?.[idx] ?? 0),
      sunrise,
      sunset,
    };
  });

  // Process next 24 hours from hourly data
  const nowHour = new Date().getHours();
  const hourlyList = (data.hourly?.time || []).slice(nowHour, nowHour + 24).map((timeStr, idx) => {
    const hDate = new Date(timeStr);
    const formattedTime = idx === 0 ? 'Now' : hDate.toLocaleTimeString('en-US', { hour: 'numeric' });
    const realIdx = nowHour + idx;

    const tC = Math.round(data.hourly?.temperature_2m[realIdx] ?? currentTempC);
    const code = data.hourly?.weather_code?.[realIdx] ?? data.current_weather.weathercode;
    const pChance = data.hourly?.precipitation_probability?.[realIdx] ?? 0;
    const wind = Math.round(data.hourly?.wind_speed_10m?.[realIdx] ?? 0);
    const humidity = Math.round(data.hourly?.relative_humidity_2m?.[realIdx] ?? 50);

    return {
      time: timeStr,
      formattedTime,
      tempC: tC,
      tempF: cToF(tC),
      weatherCode: code,
      precipChance: pChance,
      windKmH: wind,
      humidity,
    };
  });

  // Build intelligence recommendations & activities suitability
  const recommendations = generateRecommendations({
    currentTempC,
    weatherCode: data.current_weather.weathercode,
    windSpeedKmH: data.current_weather.windspeed,
    todayMaxC: dailyList[0]?.maxTempC ?? currentTempC,
    todayMinC: dailyList[0]?.minTempC ?? currentTempC,
    precipChanceToday: dailyList[0]?.precipChance ?? 0,
    uvIndexToday: dailyList[0]?.uvIndex ?? 0,
  });

  const activities = generateActivities({
    tempC: currentTempC,
    weatherCode: data.current_weather.weathercode,
    windKmH: data.current_weather.windspeed,
    precipChance: dailyList[0]?.precipChance ?? 0,
    uvIndex: dailyList[0]?.uvIndex ?? 0,
  });

  return {
    location: {
      name,
      country,
      admin1,
      latitude,
      longitude,
      timezone: data.timezone,
    },
    current: {
      tempC: currentTempC,
      tempF: currentTempF,
      condition,
      windSpeedKmH: Math.round(data.current_weather.windspeed),
      windSpeedMph: kmhToMph(data.current_weather.windspeed),
      windDirectionDeg: data.current_weather.winddirection,
      weatherCode: data.current_weather.weathercode,
      isDay,
      time: data.current_weather.time,
    },
    daily: dailyList,
    hourly: hourlyList,
    recommendations,
    activities,
  };
}

function generateRecommendations(p: {
  currentTempC: number;
  weatherCode: number;
  windSpeedKmH: number;
  todayMaxC: number;
  todayMinC: number;
  precipChanceToday: number;
  uvIndexToday: number;
}): PlanningRecommendation[] {
  const recs: PlanningRecommendation[] = [];

  // Rain / Rain gear advice
  const isRainingNow = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(p.weatherCode);
  if (isRainingNow || p.precipChanceToday >= 60) {
    recs.push({
      id: 'rain-umbrella',
      category: 'gear',
      title: 'Pack an Umbrella & Raincoat',
      description: isRainingNow
        ? 'Rain is actively falling in your area. Keep a reliable umbrella and waterproof jacket on hand.'
        : `High probability of rain (${p.precipChanceToday}% chance today). Prepare protective rain gear before heading out.`,
      iconName: 'Umbrella',
      severity: 'warning',
    });
  } else if (p.precipChanceToday >= 30) {
    recs.push({
      id: 'rain-light',
      category: 'gear',
      title: 'Slight Rain Risk',
      description: `${p.precipChanceToday}% chance of light showers later today. A compact foldaway umbrella is recommended.`,
      iconName: 'CloudRain',
      severity: 'info',
    });
  }

  // Sunscreen & UV Advice
  if (p.uvIndexToday >= 6 || (p.weatherCode <= 2 && p.todayMaxC >= 22)) {
    recs.push({
      id: 'sunscreen',
      category: 'health',
      title: 'Apply SPF 30+ Sunscreen',
      description: `UV Index is high (${p.uvIndexToday}). Apply broad-spectrum sunscreen and wear UV-blocking sunglasses if outdoors for over 20 mins.`,
      iconName: 'Sun',
      severity: p.uvIndexToday >= 8 ? 'alert' : 'warning',
    });
  } else if (p.weatherCode <= 1) {
    recs.push({
      id: 'sunglasses',
      category: 'gear',
      title: 'Wear Sunglasses',
      description: 'Clear sunny skies will produce bright glare throughout peak daytime hours.',
      iconName: 'Eye',
      severity: 'info',
    });
  }

  // Clothing advice based on temperature
  if (p.currentTempC <= 5) {
    recs.push({
      id: 'clothing-heavy',
      category: 'clothing',
      title: 'Heavy Winter Layers Required',
      description: `Freezing conditions (${p.currentTempC}°C). Wear a thermal coat, insulated gloves, scarf, and warm headwear.`,
      iconName: 'Shirt',
      severity: 'alert',
    });
  } else if (p.currentTempC <= 14) {
    recs.push({
      id: 'clothing-moderate',
      category: 'clothing',
      title: 'Wear a Warm Jacket or Sweater',
      description: `Brisk atmosphere (${p.currentTempC}°C). Layer up with a fleece, cardigan, or light windproof jacket.`,
      iconName: 'Shirt',
      severity: 'info',
    });
  } else if (p.currentTempC >= 28) {
    recs.push({
      id: 'clothing-heat',
      category: 'clothing',
      title: 'Breathable Fabrics & Hydration',
      description: `Warm conditions (${p.currentTempC}°C). Opt for loose cotton or linen clothing, and carry water for hydration.`,
      iconName: 'Flame',
      severity: 'warning',
    });
  } else {
    recs.push({
      id: 'clothing-mild',
      category: 'clothing',
      title: 'Comfortable Everyday Wear',
      description: `Mild and pleasant conditions (${p.currentTempC}°C). Standard comfortable casual clothing is ideal.`,
      iconName: 'Smile',
      severity: 'success',
    });
  }

  // Wind Advisory
  if (p.windSpeedKmH >= 35) {
    recs.push({
      id: 'wind-alert',
      category: 'alert',
      title: 'Bustling Wind Alert',
      description: `High wind gusts up to ${Math.round(p.windSpeedKmH)} km/h. Secure loose outdoors objects and exercise extra care when cycling or driving.`,
      iconName: 'Wind',
      severity: 'warning',
    });
  }

  // Thunderstorm Alert
  if ([95, 96, 99].includes(p.weatherCode)) {
    recs.push({
      id: 'thunderstorm-alert',
      category: 'alert',
      title: 'Severe Weather Warning: Thunderstorm',
      description: 'Active lightning storm detected. Stay indoors, keep away from windows, and postpone outdoor sports.',
      iconName: 'Zap',
      severity: 'alert',
    });
  }

  return recs;
}

function generateActivities(p: {
  tempC: number;
  weatherCode: number;
  windKmH: number;
  precipChance: number;
  uvIndex: number;
}): ActivitySuitability[] {
  const isBadWeather = [51, 53, 55, 61, 63, 65, 66, 67, 71, 73, 75, 80, 81, 82, 95, 96, 99].includes(p.weatherCode);

  // 1. Outdoor Jogging / Running
  let jogScore = 85;
  if (p.tempC < 5 || p.tempC > 30) jogScore -= 30;
  if (isBadWeather) jogScore -= 50;
  if (p.windKmH > 25) jogScore -= 20;

  // 2. Cycling / Biking
  let bikeScore = 90;
  if (isBadWeather) bikeScore -= 60;
  if (p.windKmH > 20) bikeScore -= 35;
  if (p.tempC < 8) bikeScore -= 25;

  // 3. Outdoor Dining / Picnic
  let picnicScore = 80;
  if (p.weatherCode > 2) picnicScore -= 40;
  if (p.tempC < 16 || p.tempC > 32) picnicScore -= 30;
  if (p.windKmH > 20) picnicScore -= 25;

  // 4. Stargazing / Night Walks
  let starScore = 80;
  if (p.weatherCode > 1) starScore -= 60;
  if (p.tempC < 0) starScore -= 30;

  const scoreToStatus = (s: number): ActivitySuitability['status'] => {
    if (s >= 75) return 'Ideal';
    if (s >= 50) return 'Moderate';
    if (s >= 30) return 'Poor';
    return 'Not Recommended';
  };

  return [
    {
      name: 'Jogging & Running',
      category: 'Fitness',
      score: Math.max(0, Math.min(100, jogScore)),
      status: scoreToStatus(jogScore),
      reason: isBadWeather
        ? 'Wet roads & precipitation make running hazardous'
        : p.tempC > 28
        ? 'High temperatures — run early morning or evening'
        : 'Crisp, pleasant atmosphere for outdoor endurance',
      iconName: 'Activity',
    },
    {
      name: 'Cycling & Commuting',
      category: 'Transport',
      score: Math.max(0, Math.min(100, bikeScore)),
      status: scoreToStatus(bikeScore),
      reason: p.windKmH > 25
        ? 'Headwinds & gusts will impede bike control'
        : isBadWeather
        ? 'Reduced tire traction and low visibility'
        : 'Smooth dry roads with favorable breeze',
      iconName: 'Bike',
    },
    {
      name: 'Patio & Outdoor Dining',
      category: 'Leisure',
      score: Math.max(0, Math.min(100, picnicScore)),
      status: scoreToStatus(picnicScore),
      reason: p.weatherCode > 2
        ? 'Overcast or rainy conditions make outdoor seating uncomfortable'
        : p.tempC >= 18 && p.tempC <= 26
        ? 'Optimal temperature for al fresco dining'
        : 'Chilly or hot ambient temperature',
      iconName: 'Utensils',
    },
    {
      name: 'Stargazing & Night Sightseeing',
      category: 'Nightlife',
      score: Math.max(0, Math.min(100, starScore)),
      status: scoreToStatus(starScore),
      reason: p.weatherCode > 1
        ? 'Cloud cover obstructs night sky visibility'
        : 'Clear celestial canopy with high visibility',
      iconName: 'Sparkles',
    },
  ];
}
