const mongoose = require("mongoose");

const plantDataScheme = new mongoose.Schema(
  {
    userid: Number,
    id: Number,
    name: String,
    strain: String,
    tent: Number,
    plantedDate: {
      type: Date,
      default: mongoose.now()
    },
  },
  { timestamps: true }
);

const PlantData = mongoose.model("plants", plantDataScheme);

module.exports = PlantData;
