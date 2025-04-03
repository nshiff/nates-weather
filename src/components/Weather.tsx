import { useQuery } from "@tanstack/react-query";

const fetchUserProfile = async (location: string) => {
  const APPID = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

  const URL = `https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=${APPID}`;
  const response = await fetch(URL);
  if (!response.ok) {
    throw new Error("Failed to fetch user profile");
  }
  return response.json();
};

export function Weather() {
  const location = "Cleveland, OH, USA";
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["location", location], // Unique key for this query
    queryFn: () => fetchUserProfile(location), // Function to fetch the data
    // You can add more options here, like:
    // staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
    // retry: 3, // Retry the request up to 3 times on failure
  });

  if (isLoading) {
    return <div>Loading user profile...</div>;
  }

  if (isError) {
    return <div>Error fetching user profile: {error.message}</div>;
  }

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
