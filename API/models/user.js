const mongoose = require("mongoose");

const userScheme = new mongoose.Schema({
  userid: Number,
  email: String,
  password: String,
  name: String,
  surname: String,
  dob: Date,
});

const Users = mongoose.model("tents", userScheme);

module.exports = Users;
