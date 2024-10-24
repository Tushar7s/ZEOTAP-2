// Header.js
import React, { useState } from "react";
import "../styles/Header.css"; // Import the CSS file for styling

const Header = ({ onSearch, onUnitChange }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm); // Call the onSearch prop function when searching
  };

  const handleUnitChange = (e) => {
    onUnitChange(e.target.value);
  };

  return (
    <header className="header">
      <div className="logo">
        <h1>Weather Dashboard</h1>
      </div>

      <form className="search-box" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <div className="unit-selector">
        <label htmlFor="unit">Temp Unit: </label>
        <select id="unit" defaultValue="celsius" onChange={handleUnitChange}>
          <option value="celsius">Celsius (°C)</option>
          <option value="fahrenheit">Fahrenheit (°F)</option>
          <option value="kelvin">Kelvin (K)</option>
        </select>
      </div>
    </header>
  );
};

export default Header;
