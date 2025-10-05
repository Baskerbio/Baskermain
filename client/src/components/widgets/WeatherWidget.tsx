import React, { useState, useEffect } from 'react';
import { Cloud } from 'lucide-react';

interface WeatherWidgetProps {
  config: any;
}

export function WeatherWidget({ config }: WeatherWidgetProps) {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const weatherIcons = {
    '01d': '☀️', '01n': '🌙',
    '02d': '⛅', '02n': '☁️',
    '03d': '☁️', '03n': '☁️',
    '04d': '☁️', '04n': '☁️',
    '09d': '🌦️', '09n': '🌧️',
    '10d': '🌧️', '10n': '🌧️',
    '11d': '⛈️', '11n': '⛈️',
    '13d': '❄️', '13n': '❄️',
    '50d': '🌫️', '50n': '🌫️'
  };

  const fetchWeather = async () => {
    if (!config.location) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Use demo API key if none provided
      const apiKey = config.apiKey || 'demo';
      let apiUrl = '';

      switch (config.apiProvider) {
        case 'openweather':
          apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(config.location)}&appid=${apiKey}&units=${config.unit === 'celsius' ? 'metric' : 'imperial'}`;
          break;
        case 'weatherapi':
          apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(config.location)}`;
          break;
        case 'weatherbit':
          apiUrl = `https://api.weatherbit.io/v2.0/current?key=${apiKey}&city=${encodeURIComponent(config.location)}&units=${config.unit === 'celsius' ? 'M' : 'I'}`;
          break;
        default:
          apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(config.location)}&appid=${apiKey}&units=metric`;
      }

      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Weather API error');
      
      const data = await response.json();
      
      // Transform data based on API provider
      let transformedData;
      if (config.apiProvider === 'openweather') {
        transformedData = {
          location: data.name,
          temperature: Math.round(data.main.temp),
          condition: data.weather[0].description,
          icon: data.weather[0].icon,
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          pressure: data.main.pressure,
          feelsLike: Math.round(data.main.feels_like)
        };
      } else if (config.apiProvider === 'weatherapi') {
        transformedData = {
          location: data.location.name,
          temperature: Math.round(data.current.temp_c),
          condition: data.current.condition.text,
          icon: data.current.condition.icon,
          humidity: data.current.humidity,
          windSpeed: data.current.wind_kph,
          pressure: data.current.pressure_mb,
          feelsLike: Math.round(data.current.feelslike_c)
        };
      } else {
        transformedData = {
          location: data.data[0].city_name,
          temperature: Math.round(data.data[0].temp),
          condition: data.data[0].weather.description,
          icon: data.data[0].weather.icon,
          humidity: data.data[0].rh,
          windSpeed: data.data[0].wind_spd,
          pressure: data.data[0].pres,
          feelsLike: Math.round(data.data[0].app_temp)
        };
      }

      setWeatherData(transformedData);
    } catch (err) {
      setError('Weather data unavailable');
      console.error('Weather fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (config.location) {
      fetchWeather();
      // Auto-refresh based on interval
      const interval = setInterval(fetchWeather, (config.updateInterval || 15) * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [config.location, config.apiProvider, config.unit]);

  const getTemperatureUnit = () => {
    return config.unit === 'celsius' ? '°C' : config.unit === 'fahrenheit' ? '°F' : 'K';
  };

  if (!config.location) {
    return (
      <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
        <Cloud className="w-8 h-8 text-blue-500" />
        <div>
          <div className="font-medium">Weather</div>
          <div className="text-sm text-muted-foreground">Location not set</div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
        <div className="w-8 h-8 bg-blue-500 rounded-full animate-pulse"></div>
        <div>
          <div className="font-medium">Loading weather...</div>
          <div className="text-sm text-muted-foreground">{config.location}</div>
        </div>
      </div>
    );
  }

  if (error || !weatherData) {
    return (
      <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
        <Cloud className="w-8 h-8 text-red-500" />
        <div>
          <div className="font-medium">Weather unavailable</div>
          <div className="text-sm text-muted-foreground">{error || 'No data'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="text-3xl">
          {weatherIcons[weatherData.icon as keyof typeof weatherIcons] || '☁️'}
        </div>
        <div>
          <div className="font-medium">{weatherData.location}</div>
          <div className="text-sm text-muted-foreground capitalize">
            {weatherData.condition}
          </div>
        </div>
        <div className="ml-auto text-right">
          <div className="text-2xl font-bold">
            {weatherData.temperature}{getTemperatureUnit()}
          </div>
          <div className="text-xs text-muted-foreground">
            Feels like {weatherData.feelsLike}{getTemperatureUnit()}
          </div>
        </div>
      </div>

      {config.showDetails && (
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <span>💧</span>
            <span>{weatherData.humidity}%</span>
          </div>
          <div className="flex items-center gap-1">
            <span>💨</span>
            <span>{weatherData.windSpeed} {config.unit === 'celsius' ? 'km/h' : 'mph'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>📊</span>
            <span>{weatherData.pressure} hPa</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🔄</span>
            <span>Auto-refresh</span>
          </div>
        </div>
      )}
    </div>
  );
}