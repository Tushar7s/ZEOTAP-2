import "../styles/WeatherCard.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

const WeatherCard = ({ city, unit, threshold }) => {
  const [weatherData, setWeatherData] = useState({
    temperature: "",
    feelsLike: "",
    desc: "",
    name: "",
    humidity: "",
    visibility: "",
    windspeed: ""
  });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (city) {
      getWeatherData(city);

      // Set interval to fetch data every 10 seconds
      const intervalId = setInterval(() => {
        getWeatherData(city);
      }, 300000);

      // Cleanup the interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, [city, unit, threshold]); // Re-fetch when city or unit changes

  const getWeatherData = async (city) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=6143e4f9f4c41698facf377e114c051f`
      );
      const tempK = response.data.main.temp; // Temperature in Kelvin
      const feelsLikeK = response.data.main.feels_like; // Feels like temperature in Kelvin
      console.log(response)
      // Convert based on unit
      const temperature = convertTemperature(tempK, unit);
      const thresholdTemperature = convertTemperature(threshold.temperature + 273.15, unit);
      const condition = threshold.condition;
      const feelsLike = convertTemperature(feelsLikeK, unit);
       // Check if the temperature exceeds the threshold
       console.log(thresholdTemperature);
       console.log(temperature);
      if (temperature > thresholdTemperature) {
        setCount(prevCount => {
          const newCount = prevCount + 1;
          // Check if breached for two consecutive updates
          if (newCount >= 2) {
            alert(`Threshold value breached for ${newCount} consecutive updates`);
          }
          return newCount; // Update count state
        });
      } else {
        setCount(prevCount => {
          const newCount = Math.max(0, prevCount - 1); // Prevent count from going negative
          return newCount; // Update count state
        });
      }
      setWeatherData({
        temperature,
        feelsLike,
        desc: response.data.weather[0].description,
        name: response.data.name,
        humidity: response.data.main.humidity,
        visibility: response.data.visibility / 1000, // Convert visibility to km
        windspeed: response.data.wind.speed
      });
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  // Helper function to convert temperature based on unit
  const convertTemperature = (tempK, unit) => {
    switch (unit) {
      case "fahrenheit":
        return Math.round((tempK - 273.15) * 9/5 + 32); // Convert to Fahrenheit
      case "kelvin":
        return Math.round(tempK); // Kelvin
      default:
        return Math.round(tempK - 273.15); // Convert to Celsius (default)
    }
  };

  return (
    <div className="weather-card">
      <div className="container">
        <div className="details">
          <div className="temp">
            
            {weatherData.temperature}
            <span>{unit === "fahrenheit" ? '°F' : (unit === "kelvin" ? 'K' : '°C')}</span>
          </div>
          <div className="right">
            <div id="summary">{weatherData.desc}</div>
            <div style={{ fontWeight: "bold", marginTop: "4px" }}>{weatherData.name}</div>
          </div>
        </div>
        <div className="infos">
          <div className="feels-like">
            Feels Like: {weatherData.feelsLike}
            <span>{unit === "fahrenheit" ? '°F' : (unit === "kelvin" ? 'K' : '°C')}</span>
          </div>
          <div className="humidity">Humidity: {weatherData.humidity}%</div>
          <div className="visibility">Visibility: {weatherData.visibility} km</div>
          <div className="windspeed">Wind Speed: {weatherData.windspeed} km/h</div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
