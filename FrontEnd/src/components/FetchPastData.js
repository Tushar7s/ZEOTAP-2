import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/pastdata.css"; // Assuming you renamed the CSS file for clarity

const FetchPastData = ({ city, unit }) => {
  const [pastWeatherData, setPastWeatherData] = useState([]);

  useEffect(() => {
    if (city) {
      getPastWeatherData(city);
    }
  }, [city]);

  useEffect(() => {
    if (pastWeatherData.length > 0) {
      // Trigger a re-render when the unit changes
      const updatedData = pastWeatherData.map((dayData) => ({
        ...dayData,
        convertedAverageTemperature: convertTemperature(dayData.averageTemperature, unit),
        convertedMaxTemperature: convertTemperature(dayData.maxTemperature, unit),
        convertedMinTemperature: convertTemperature(dayData.minTemperature, unit),
      }));
      
      // Ensure React recognizes the new state by creating a new array
      setPastWeatherData([...updatedData]);
    }
  }, [unit]);

  const getPastWeatherData = async (city) => {
    try {
      const response = await axios.get(
        `https://weatherapp-tcck.onrender.com/api/past-summary/${city}`
      );
      
      // Convert the initial data based on the default unit
      const convertedData = response.data.map((dayData) => ({
        ...dayData,
        convertedAverageTemperature: convertTemperature(dayData.averageTemperature, unit),
        convertedMaxTemperature: convertTemperature(dayData.maxTemperature, unit),
        convertedMinTemperature: convertTemperature(dayData.minTemperature, unit),
      }));

      setPastWeatherData(convertedData);
    } catch (error) {
      console.log(error);
    }
  };

  const convertTemperature = (temperature, unit) => {
    if (unit === "fahrenheit") {
      return (temperature * 9) / 5 + 32; // Celsius to Fahrenheit
    } else if (unit === "kelvin") {
      return temperature + 273.15; // Celsius to Kelvin
    }
    return temperature; // Default is Celsius
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="weather-container">
      {pastWeatherData.map((dayData, index) => (
        <div key={index} className="container1">
          <div id="card">
            <div className="details">
              <div className="temp">
                {dayData.convertedAverageTemperature.toFixed(1)}
                <span>
                  {unit === "fahrenheit" ? "°F" : unit === "kelvin" ? "K" : "°C"}
                </span>
              </div>
              <div className="right">
                <div id="summary">{dayData.dominantWeatherCondition}</div>
              </div>
            </div>
            <div className="infos">
              <div className="feels-like">Date: {formatDate(dayData.date)}</div>
              <div className="humidity">Humidity: {dayData.averageHumidity}%</div>
              <div className="max-temp">
                Max Temp: {dayData.convertedMaxTemperature.toFixed(1)}
                {unit === "fahrenheit" ? "°F" : unit === "kelvin" ? "K" : "°C"}
              </div>
              <div className="min-temp">
                Min Temp: {dayData.convertedMinTemperature.toFixed(1)}
                {unit === "fahrenheit" ? "°F" : unit === "kelvin" ? "K" : "°C"}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FetchPastData;
