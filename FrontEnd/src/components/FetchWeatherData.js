if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}

import React, { useState, useEffect } from "react";
import axios from "axios";

const metroCities = ["Delhi", "Mumbai", "Chennai", "Bangalore", "Kolkata", "Hyderabad"];

const FetchWeatherData = () => {
  // State to store hourly data for each city
  const [weatherData, setWeatherData] = useState({
    Delhi: { temperature: [], minTemperature: [], maxTemperature: [], humidity: [], windspeed: [], dominant: [] },
    Mumbai: { temperature: [], minTemperature: [], maxTemperature: [], humidity: [], windspeed: [], dominant: [] },
    Chennai: { temperature: [], minTemperature: [], maxTemperature: [], humidity: [], windspeed: [], dominant: [] },
    Bangalore: { temperature: [], minTemperature: [], maxTemperature: [], humidity: [], windspeed: [], dominant: [] },
    Kolkata: { temperature: [], minTemperature: [], maxTemperature: [], humidity: [], windspeed: [], dominant: [] },
    Hyderabad: { temperature: [], minTemperature: [], maxTemperature: [], humidity: [], windspeed: [], dominant: [] },
  });
  

  // Function to fetch weather data for a specific city
  const fetchWeatherForCity = async (city) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid={process.env.api_key}`
      );
      const tempCelsius = response.data.main.temp - 273.15; // Current temperature in Celsius
      const minTempCelsius = response.data.main.temp_min - 273.15; // Minimum temperature in Celsius
      const maxTempCelsius = response.data.main.temp_max - 273.15; // Maximum temperature in Celsius
      const humidity = response.data.main.humidity;
      const windspeed = response.data.wind.speed;
      const dominant = response.data.weather[0].main; // Get the dominant weather condition
  
      return { temperature: tempCelsius, minTemperature: minTempCelsius, maxTemperature: maxTempCelsius, humidity, windspeed, dominant };
    } catch (error) {
      console.error(`Error fetching weather data for ${city}:`, error.message);
      return null;
    }
  };
  

  // Function to summarize daily data for each city
  const summarizeDailyData = (cityData) => {
    const avgTemp = cityData.temperature.reduce((acc, temp) => acc + temp, 0) / cityData.temperature.length;
    const avgHumidity = cityData.humidity.reduce((acc, hum) => acc + hum, 0) / cityData.humidity.length;
    const maxWindspeed = Math.max(...cityData.windspeed);
    const dominantCondition = cityData.dominant.sort((a, b) =>
      cityData.dominant.filter(v => v === a).length - cityData.dominant.filter(v => v === b).length
    ).pop();
  
    const minTemperature = Math.min(...cityData.minTemperature).toFixed(2);
    const maxTemperature = Math.max(...cityData.maxTemperature).toFixed(2);
  
    return {
      avgTemperature: avgTemp.toFixed(2),
      minTemperature,
      maxTemperature,
      avgHumidity: avgHumidity.toFixed(2),
      maxWindspeed,
      dominantCondition
    };
  };
  
  // Function to send daily summaries to the backend
  const sendDailySummaries = async (dailySummaries) => {
    try {
      console.log("posted");
      await axios.post("https://weatherapp-tcck.onrender.com/api/weather/daily-summary", dailySummaries);
      console.log("Daily summaries successfully sent to the backend.");
    } catch (error) {
      console.error("Error sending daily summaries:", error.message);
    }
  };

  // Fetch data every hour
  useEffect(() => {
    const fetchWeatherForCities = async () => {
      console.log("fetched");
      const updatedWeatherData = { ...weatherData };
    
      const fetchPromises = metroCities.map(async (city) => {
        const cityData = await fetchWeatherForCity(city);
        if (cityData) {
          updatedWeatherData[city].temperature.push(cityData.temperature);
          updatedWeatherData[city].minTemperature.push(cityData.minTemperature);
          updatedWeatherData[city].maxTemperature.push(cityData.maxTemperature);
          updatedWeatherData[city].humidity.push(cityData.humidity);
          updatedWeatherData[city].windspeed.push(cityData.windspeed);
          updatedWeatherData[city].dominant.push(cityData.dominant);
        }
      });
    
      await Promise.all(fetchPromises);
      setWeatherData(updatedWeatherData);
    };
    // Fetch initial data and set interval for subsequent fetches
    fetchWeatherForCities();
    const intervalId = setInterval(fetchWeatherForCities, 3600000); // Fetch every 60 seconds
  
    // Send daily summaries to the backend at the specified time
    const endOfDay = new Date();
    endOfDay.setHours(11, 59, 0, 0); // Set time to 15:15
    const timeUntilEndOfDay = endOfDay.getTime() - new Date().getTime();
    const endOfDayTimeout = setTimeout(() => {
      const dailySummaries = {};
  
      // Generate daily summaries for each city
      metroCities.forEach((city) => {
        dailySummaries[city] = summarizeDailyData(weatherData[city]);
      });
  
      // Send summaries to backend
      sendDailySummaries(dailySummaries);
  
      // Reset weather data for a new day
      setWeatherData({
        Delhi: { temperature: [], humidity: [], windspeed: [], dominant: [] },
        Mumbai: { temperature: [], humidity: [], windspeed: [], dominant: [] },
        Chennai: { temperature: [], humidity: [], windspeed: [], dominant: [] },
        Bangalore: { temperature: [], humidity: [], windspeed: [], dominant: [] },
        Kolkata: { temperature: [], humidity: [], windspeed: [], dominant: [] },
        Hyderabad: { temperature: [], humidity: [], windspeed: [], dominant: [] },
      });
    }, timeUntilEndOfDay); // Trigger at 18:18
  
    // Cleanup interval and timeout on component unmount
    return () => {
      clearInterval(intervalId);
      clearTimeout(endOfDayTimeout);
    };
  }, []); // Empty dependency array to only run on mount

};

export default FetchWeatherData;
