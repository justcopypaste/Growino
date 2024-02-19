const mongoose = require("mongoose");

const sensorDataScheme = new mongoose.Schema(
  {
    userid: Number,
    temperature: String,
    humidity: String,
    soil: Array,
    power: Number,
    tent: Number
  },
  { timestamps: true }
);

const SensorData = mongoose.model("sensors", sensorDataScheme);

module.exports = SensorData;
