import React, { useState } from "react";

const ThresholdForm = ({ onThresholdChange }) => {
  const [temperatureThreshold, setTemperatureThreshold] = useState(35);

  const handleSubmit = (e) => {
    e.preventDefault();
    onThresholdChange({ temperature: temperatureThreshold});
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="temperatureForm">
      <label>
        Temperature Threshold (°C):
        <input
          type="number"
          value={temperatureThreshold}
          onChange={(e) => setTemperatureThreshold(e.target.value)}
        />
      </label>
      </div>
      <button type="submit">Set Thresholds</button>
    </form>
  );
};

export default ThresholdForm;