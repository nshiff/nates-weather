import { useQuery } from "@tanstack/react-query";

const APPID = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;
const fetchWeatherCurrent = async (location: string) => {
  const URL = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&APPID=${APPID}`;
  const response = await fetch(URL);
  if (!response.ok) {
    throw new Error("Failed to fetch weather");
  }
  return response.json();
};

export function Weather() {
  const location = "Detroit, MI, USA";
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["location", location], // Unique key for this query
    queryFn: () => fetchWeatherCurrent(location), // Function to fetch the data
  });

  if (isLoading) {
    return <div>Loading weather...</div>;
  }

  if (isError) {
    return <div>Error fetching weather: {error.message}</div>;
  }

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
