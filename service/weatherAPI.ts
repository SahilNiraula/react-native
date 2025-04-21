// src/services/weatherApi.ts

// Types for the API responses
export interface WeatherForecast {
  city: {
    name: string;
    country: string;
  };
  list: DailyForecast[];
}

export interface DailyForecast {
  dt: number; // Unix timestamp
  temp: {
    day: number;
    min: number;
    max: number;
    night: number;
    eve: number;
    morn: number;
  };
  pressure: number;
  humidity: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  wind_speed: number;
  clouds: number;
  pop: number; // Probability of precipitation
}

// Weather API class
class WeatherAPI {
  private readonly API_KEY = "3a20da0f0209b1b4496b9e9f32c8fcbf";
  private readonly BASE_URL = "https://api.openweathermap.org/data/2.5";

  /**
   * Get daily weather forecast by coordinates
   * @param lat - Latitude
   * @param lon - Longitude
   * @param days - Number of days to forecast (max 16)
   * @param units - Units of measurement ('metric', 'imperial', or 'standard')
   */
  async getDailyForecast(
    lat: number,
    lon: number,
    days: number = 7,
    units: "metric" | "imperial" | "standard" = "metric"
  ): Promise<WeatherForecast> {
    try {
      // OpenWeatherMap API for daily forecast requires subscription, so we'll use the 5-day/3-hour forecast and transform the data
      const url = `${this.BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${this.API_KEY}`;

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API error: ${response.status}`);
      }

      const data = await response.json();

      // Transform the 3-hour forecast data into daily forecast format
      return this.transformForecastData(data, days);
    } catch (error) {
      console.error("Error fetching weather forecast:", error);
      throw error;
    }
  }

  /**
   * Get weather forecast by city name
   * @param city - City name
   * @param days - Number of days to forecast (max 16)
   * @param units - Units of measurement ('metric', 'imperial', or 'standard')
   */
  async getDailyForecastByCity(
    city: string,
    days: number = 7,
    units: "metric" | "imperial" | "standard" = "metric"
  ): Promise<WeatherForecast> {
    try {
      // First, get coordinates by city name using Geocoding API
      const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
        city
      )}&limit=1&appid=${this.API_KEY}`;

      const geoResponse = await fetch(geoUrl);

      if (!geoResponse.ok) {
        const errorData = await geoResponse.json();
        throw new Error(
          errorData.message || `Geocoding API error: ${geoResponse.status}`
        );
      }

      const geoData = await geoResponse.json();

      if (!geoData || geoData.length === 0) {
        throw new Error("City not found");
      }

      const { lat, lon } = geoData[0];

      // Then get weather forecast by coordinates
      return this.getDailyForecast(lat, lon, days, units);
    } catch (error) {
      console.error("Error fetching weather forecast by city:", error);
      throw error;
    }
  }

  /**
   * Get weather icon URL
   * @param iconCode - Icon code from weather API
   * @param size - Size of icon (2x or 4x)
   */
  getWeatherIconUrl(iconCode: string, size: "2x" | "4x" = "4x"): string {
    return `https://openweathermap.org/img/wn/${iconCode}@${size}.png`;
  }

  /**
   * Transform 5-day/3-hour forecast data into daily forecast format
   */
  private transformForecastData(data: any, days: number): WeatherForecast {
    // Group forecast data by day
    const dailyData: { [key: string]: any[] } = {};

    data.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000).toISOString().split("T")[0];
      if (!dailyData[date]) {
        dailyData[date] = [];
      }
      dailyData[date].push(item);
    });

    // Process each day's data
    const dailyForecasts: DailyForecast[] = Object.keys(dailyData)
      .slice(0, days)
      .map((date) => {
        const dayData = dailyData[date];
        const midDayData = dayData[Math.floor(dayData.length / 2)];

        // Calculate min and max temperatures for the day
        const temps = dayData.map((item) => item.main.temp);
        const minTemp = Math.min(...temps);
        const maxTemp = Math.max(...temps);
        const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;

        return {
          dt: new Date(date).getTime() / 1000,
          temp: {
            day: avgTemp,
            min: minTemp,
            max: maxTemp,
            night: avgTemp, // We don't have separate night data
            eve: avgTemp, // We don't have separate evening data
            morn: avgTemp, // We don't have separate morning data
          },
          pressure: midDayData.main.pressure,
          humidity: midDayData.main.humidity,
          weather: [midDayData.weather[0]],
          wind_speed: midDayData.wind.speed,
          clouds: midDayData.clouds.all,
          pop: midDayData.pop || 0,
        };
      });

    return {
      city: {
        name: data.city.name,
        country: data.city.country,
      },
      list: dailyForecasts,
    };
  }
}

export const weatherAPI = new WeatherAPI();
export default weatherAPI;
