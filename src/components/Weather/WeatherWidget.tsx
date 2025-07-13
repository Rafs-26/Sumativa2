import React, { useState, useEffect } from 'react';
import { Cloud, Thermometer, Droplets, Wind, RefreshCw } from 'lucide-react';
import { weatherService } from '../../services/weatherService';
import { WeatherData } from '../../types';

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await weatherService.getCurrentWeather('Ciudad de México');
      setWeather(data);
    } catch (err) {
      setError('Error al cargar el clima');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="text-center">
          <Cloud className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">{error || 'No se pudo cargar el clima'}</p>
          <button
            onClick={fetchWeather}
            className="mt-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <Cloud className="w-full h-full" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Clima Campus</h3>
          <button
            onClick={fetchWeather}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-3xl">{weather.icon}</span>
              <span className="text-3xl font-bold">{weather.temperature}°C</span>
            </div>
            <p className="text-blue-100 mt-1">{weather.condition}</p>
            <p className="text-blue-200 text-sm">{weather.city}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/20 rounded-lg p-3">
            <Droplets className="w-5 h-5 mx-auto mb-1" />
            <p className="text-xs text-blue-100">Humedad</p>
            <p className="font-semibold">{weather.humidity}%</p>
          </div>
          
          <div className="bg-white/20 rounded-lg p-3">
            <Wind className="w-5 h-5 mx-auto mb-1" />
            <p className="text-xs text-blue-100">Viento</p>
            <p className="font-semibold">{weather.windSpeed} km/h</p>
          </div>
          
          <div className="bg-white/20 rounded-lg p-3">
            <Thermometer className="w-5 h-5 mx-auto mb-1" />
            <p className="text-xs text-blue-100">Sensación</p>
            <p className="font-semibold">{weather.temperature + 2}°C</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;