const mongoose = require("mongoose");

const tentDataScheme = new mongoose.Schema(
  {
    id: Number,
    name: String,
    lightOn: Date,
    lightOff: Date,
  },
  { timestamps: true }
);

const TentData = mongoose.model("tents", tentDataScheme);

module.exports = TentData;
