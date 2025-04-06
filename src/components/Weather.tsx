import { useQuery } from "@tanstack/react-query";

const APPID = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fetchWeatherCurrent = async (location: string): Promise<any> => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=${APPID}&units=imperial`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch current weather");
  }

  return response.json();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fetchWeatherForecast = async (location: string): Promise<any> => {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&APPID=${APPID}&units=imperial`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch current weather");
  }

  return response.json();
};

export function Weather() {
  const location = "Detroit, MI, USA";

  const {
    isLoading: isWeatherDataLoading,
    // isError: isWeatherError,
    data: weatherData,
    error: weatherError,
  } = useQuery({
    queryKey: ["weather", location], // Unique key for this query
    queryFn: () => fetchWeatherCurrent(location),
  });

  const {
    isLoading: isForecastDataLoading,
    // isError: isErrorForecast,
    data: forecastData,
    error: forecastError,
  } = useQuery({
    queryKey: ["forecast", location],
    queryFn: () => fetchWeatherForecast(location),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getDailyMinMax = (forecastList: any[]) => {
    if (!forecastList) return { high: null, low: null };

    const today = new Date().toISOString().split("T")[0];
    let high = -Infinity;
    let low = Infinity;

    for (const forecast of forecastList) {
      const forecastDate = forecast.dt_txt.split(" ")[0];
      if (forecastDate === today) {
        high = Math.max(high, forecast.main.temp_max);
        low = Math.min(low, forecast.main.temp_min);
      }
    }

    return {
      high: high === -Infinity ? null : high,
      low: low === Infinity ? null : low,
    };
  };

  const { high, low } = getDailyMinMax(forecastData?.list || []);

  if (isWeatherDataLoading || isForecastDataLoading) {
    return <div>Loading...</div>;
  }

  if (weatherError || forecastError) {
    return <div>Error: {(weatherError || forecastError)?.message}</div>;
  }

  return (
    <div>
      <h1>Weather Data</h1>
      <h2>Current Weather</h2>
      <pre>{JSON.stringify(weatherData, null, 2)}</pre>

      <h2>Forecast</h2>
      <pre>{JSON.stringify(forecastData, null, 2)}</pre>
      {high !== null && low !== null && (
        <div>
          <p>High: {high}°F</p>
          <p>Low: {low}°F</p>
        </div>
      )}
    </div>
  );
}
