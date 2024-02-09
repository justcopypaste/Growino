const mongoose = require("mongoose");

const plantDataScheme = new mongoose.Schema(
  {
    id: Number,
    name: String,
    strain: String,
    tent: Number,
    plantedDate: Date,
  },
  { timestamps: true }
);

const PlantData = mongoose.model("plants", plantDataScheme);

module.exports = PlantData;
