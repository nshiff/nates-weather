/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

export function Weather() {
  const [weatherData, setWeatherData] = useState<any>(null);

  useEffect(() => {
    const doFetch = async () => {
      const url =
        "https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=14c05f03338fbb61fa73bb3f571c96c4";
      const response = await fetch(url);
      const data = await response.json();
      setWeatherData(data);
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
