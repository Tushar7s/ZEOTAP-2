if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Weather = require('./schema/Weather.js'); // Import the Weather schema
const app = express();
const PORT = process.env.PORT || 5000;
const session = require("express-session");
const MongoStore = require('connect-mongo');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const dbUrl = process.env.ATLASDB_URL
main().then(() =>{
    console.log("connected");
}).catch(err=>{
    console.log(err);
});
async function main( ){
    await mongoose.connect(dbUrl);
}

// Connect to MongoDB
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
      secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
})
store.on("error", () => {
  console.log("ERRON IN MONGO SESSION STORE", err);
});

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  store: store,
  cookie: { secure: process.env.NODE_ENV === "production" }
}));


function capitalizeFirstLetter(string) {
    if (typeof string !== 'string' || !string.length) return string;
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }
  
// API route to handle weather summaries
app.post("/api/weather/daily-summary", async (req, res) => {
  const summaries = req.body; // Assume the body is an object of cities and weather summaries
  try {
    // Map each city's summary to a Mongoose model instance
    const summaryEntries = Object.keys(summaries).map((city) => {
      return new Weather({
        city,
        date: new Date(),
        averageTemperature: summaries[city].avgTemperature,
        maxTemperature: summaries[city].maxTemperature,
        minTemperature: summaries[city].minTemperature,
        averageHumidity: summaries[city].avgHumidity,
        averageWindSpeed: summaries[city].maxWindspeed,
        dominantWeatherCondition: summaries[city].dominantCondition,
      });
    });
  
    // Insert each summary entry one by one
    for (const entry of summaryEntries) {
      await entry.save();
      console.log(`Saved weather summary for ${entry.city}`);
    }
  } catch (error) {
    console.error("Error saving weather summaries:", error.message);
  }
});
app.get("/api/past-summary/:city", async (req, res) => {
  const city = capitalizeFirstLetter(req.params.city);
  try {
    const weatherData = await Weather.find({ city: city })
      .sort({ date: -1 })  // Sort by date in descending order (newest first)
      .limit(7);
    if (!weatherData) {
      return res.status(404).json({ message: "No data found for this city." });
    }
    res.json(weatherData);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
