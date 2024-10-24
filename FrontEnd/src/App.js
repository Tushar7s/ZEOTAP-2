// src/App.js
import React, { useState } from 'react';
import ReactDOM from "react-dom/client";
import Header from './components/Header';
import WeatherCard from './components/WeatherCard';
import FetchWeatherData from './components/FetchWeatherData';
import FetchPastData from './components/FetchPastData';
import ThresholdForm from './components/ThresholdForm';
const AppLayout = () => {
    const [city, setCity] = useState("Bangalore");
    const [unit, setUnit] = useState("celsius");
    const [threshold, setThreshold] = useState({ temperature: 35}); // State for threshold

    const handleSearch = (newCity) => {
        setCity(newCity);
    };

    const handleUnitChange = (newUnit) => {
        setUnit(newUnit);
    };

    // Function to handle threshold change
    const handleThresholdChange = (newThreshold) => {
        // Convert the temperature from string to number
        const parsedThreshold = {
            temperature: parseFloat(newThreshold.temperature), // Convert temperature to number
        };
        setThreshold(parsedThreshold);
        console.log("New Threshold:", parsedThreshold); // Optional: log the new threshold
    };

    return (
        <div className="app">
            <Header onSearch={handleSearch} onUnitChange={handleUnitChange} />
            <ThresholdForm onThresholdChange={handleThresholdChange} />
            <WeatherCard city={city} unit={unit} threshold={threshold} />
            <FetchWeatherData /> {/* Pass threshold if needed */}
            <h1>Last 7 days weather Data</h1>
            <FetchPastData city={city} unit = {unit}/>
           
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<AppLayout />);
