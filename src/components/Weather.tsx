/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { fetchWeatherApi } from "openmeteo";

export function Weather() {
  const [weatherData, setWeatherData] = useState<any>(null);

  useEffect(() => {
    const params = {
      latitude: 42.4853,
      longitude: -83.3772,
      current: "temperature_2m",
      forecast_days: 1,
      wind_speed_unit: "mph",
      temperature_unit: "fahrenheit",
      precipitation_unit: "inch",
    };

    const url = "https://api.open-meteo.com/v1/forecast";

    const doFetch = async () => {
      const responses = await fetchWeatherApi(url, params);

      // Helper function to form time ranges
      // const range = (start: number, stop: number, step: number) =>
      //   Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

      // Process first location. Add a for-loop for multiple locations or weather models
      const response = responses[0];

      // Attributes for timezone and location
      const utcOffsetSeconds = response.utcOffsetSeconds();
      //   const timezone = response.timezone();
      //   const timezoneAbbreviation = response.timezoneAbbreviation();
      //   const latitude = response.latitude();
      //   const longitude = response.longitude();

      const current = response.current()!;

      // Note: The order of weather variables in the URL query and the indices below need to match!
      const updatedWeatherData = {
        current: {
          time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
          temperature2m: current.variables(0)!.value(),
        },
      };

      // `weatherData` now contains a simple structure with arrays for datetime and weather data
      setWeatherData(updatedWeatherData);
    };
    doFetch();
  }, []);
  return (
    <div>
      <h1>Weather Demo</h1>
      <pre>{JSON.stringify(weatherData, null, 2)}</pre>
    </div>
  );
}
