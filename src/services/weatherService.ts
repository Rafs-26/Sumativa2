import { WeatherData } from '../types';

class WeatherService {
  private readonly API_KEY = 'demo_key'; // En producción usar variable de entorno
  private readonly BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

  async getCurrentWeather(city: string = 'Mexico City'): Promise<WeatherData> {
    try {
      // Simulación del servicio de clima ya que necesitaríamos una API key real
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Datos simulados del clima
      const simulatedWeather: WeatherData = {
        temperature: Math.floor(Math.random() * 15) + 18, // 18-33°C
        condition: this.getRandomCondition(),
        humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
        windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
        city: city,
        icon: this.getWeatherIcon()
      };
      
      return simulatedWeather;
    } catch (error) {
      throw new Error('Error al obtener datos del clima');
    }
  }

  private getRandomCondition(): string {
    const conditions = [
      'Soleado',
      'Parcialmente nublado',
      'Nublado',
      'Lluvia ligera',
      'Lluvia',
      'Tormenta',
      'Niebla'
    ];
    return conditions[Math.floor(Math.random() * conditions.length)];
  }

  private getWeatherIcon(): string {
    const icons = [
      '☀️', '🌤️', '☁️', '🌦️', '🌧️', '⛈️', '🌫️'
    ];
    return icons[Math.floor(Math.random() * icons.length)];
  }

  async getWeatherForecast(city: string = 'Mexico City', days: number = 5): Promise<WeatherData[]> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const forecast: WeatherData[] = [];
    
    for (let i = 0; i < days; i++) {
      forecast.push({
        temperature: Math.floor(Math.random() * 15) + 18,
        condition: this.getRandomCondition(),
        humidity: Math.floor(Math.random() * 40) + 40,
        windSpeed: Math.floor(Math.random() * 20) + 5,
        city: city,
        icon: this.getWeatherIcon()
      });
    }
    
    return forecast;
  }
}

export const weatherService = new WeatherService();