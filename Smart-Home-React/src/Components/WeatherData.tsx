import { useState, useEffect } from "react";

interface Weather {
  current: {
    temp_c: number;
    condition: {
      text: string;
    };
  };
  location: {
    name: string;
  };
}

function WeatherData() {
  const [weather, setWeather] = useState<Weather | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(
          "http://api.weatherapi.com/v1/current.json?key=789706d732774563bbc74432241209&q=eindhoven&days=1"
        );
        const data = await response.json();
        setWeather(data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeatherData();
  }, []);

  return (
    <div>
      {weather ? (
        <div>
          <h1>Weather Data</h1>
          <p>Locatie:{weather.location?.name}</p>
          <p>Temperature: {weather.current?.temp_c}°C</p>
          <p>Condition: {weather.current?.condition?.text}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default WeatherData;
