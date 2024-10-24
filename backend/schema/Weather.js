const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
  },
  date: {
    type:String,
    required: true,
  },
  averageTemperature: {
    type: Number,
    required: true,
  },
  maxTemperature: {
    type: Number,
    required: true,
  },
  minTemperature: {
    type: Number,
    required: true,
  },
  averageHumidity: {
    type: Number,
    required: true,
  },
  averageWindSpeed: {
    type: Number,
    required: true,
  },
  dominantWeatherCondition: {
    type: String,
    required: true,
  },
});

// Create a model from the schema
const Weather = mongoose.model('Weather', weatherSchema);

module.exports = Weather;
