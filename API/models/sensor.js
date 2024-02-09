const mongoose = require("mongoose");

const sensorDataScheme = new mongoose.Schema(
  {
    temperature: String,
    humidity: String,
    soil: String,
  },
  { timestamps: true }
);

const SensorData = mongoose.model("sensors", sensorDataScheme);

module.exports = SensorData;
