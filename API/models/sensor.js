const mongoose = require("mongoose");

const sensorDataScheme = new mongoose.Schema(
  {
    temperature: String,
    humidity: String,
    soil: Array,
  },
  { timestamps: true }
);

const SensorData = mongoose.model("sensors", sensorDataScheme);

module.exports = SensorData;
