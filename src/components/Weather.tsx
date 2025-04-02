/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { fetchWeatherApi } from "openmeteo";

export function Weather() {
  const [weatherData, setWeatherData] = useState<any>(null);

  useEffect(() => {
    const doFetch = async () => {
      const params = {
        latitude: 42.4853,
        longitude: -83.3772,
        daily: ["temperature_2m_max", "temperature_2m_min"],
        current: ["temperature_2m", "precipitation"],
        timezone: "auto",
        forecast_days: 1,
        wind_speed_unit: "mph",
        temperature_unit: "fahrenheit",
        precipitation_unit: "inch",
      };

      const url = "https://api.open-meteo.com/v1/forecast";
      const responses = await fetchWeatherApi(url, params);

      // Helper function to form time ranges
      const range = (start: number, stop: number, step: number) =>
        Array.from(
          { length: (stop - start) / step },
          (_, i) => start + i * step
        );

      // Process first location. Add a for-loop for multiple locations or weather models
      const response = responses[0];

      // Attributes for timezone and location
      const utcOffsetSeconds = response.utcOffsetSeconds();
      //   const timezone = response.timezone();
      //   const timezoneAbbreviation = response.timezoneAbbreviation();
      //   const latitude = response.latitude();
      //   const longitude = response.longitude();

      const current = response.current()!; // should be non-null if request is well-formed
      const daily = response.daily()!;

      // Note: The order of weather variables in the URL query and the indices below need to match!
      const updatedWeatherData = {
        current: {
          time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
          temperature2m: current.variables(0)!.value(),
          precipitation: current.variables(1)!.value(),
        },
        daily: {
          time: range(
            Number(daily.time()),
            Number(daily.timeEnd()),
            daily.interval()
          ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
          temperature2mMax: daily.variables(0)!.valuesArray()!,
          temperature2mMin: daily.variables(1)!.valuesArray()!,
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
