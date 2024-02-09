const sensors = require("../models/sensor");

const getSensors = (req, res) => {
  let { dateStart, dateEnd, tent } = req.query;
  let query = {};

  // Check if both dateStart and dateEnd query parameters exist
  if (dateStart && dateEnd) {
    dateStart = new Date(dateStart);
    dateEnd = new Date(dateEnd);

    // Add date range to query
    query.createdAt = {
      $gte: dateStart,
      $lte: dateEnd,
    };
  }

  // Check if tent query parameter exists
  if (tent) {
    tent = parseInt(tent, 10); // Ensure tent is an integer
    query.tent = tent; // Add tent to query
  }

  // Execute the query with the conditional filters
  sensors
    .find(query)
    .select("-_id -__v -updatedAt") // Exclude _id and __v fields
    .sort("-createdAt") // Sort by createdAt in descending order (newest first)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

const getLastRead = (req, res) => {
  sensors
    .findOne()
    .sort({ $natural: -1 })
    .limit(1)
    .exec(function (err, read) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(read);
      }
    });
};

const postSensors = (req, res) => {
  let temperature = req.body.temperature || req.body.temp;
  let humidity = req.body.humidity || req.body.hum;
  let { soil, power, tent } = req.body;
  sensors
    .create({
      temperature: temperature,
      humidity: humidity,
      soil: soil,
      power: power,
      tent: tent,
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

module.exports = {
  getSensors,
  getLastRead,
  postSensors,
};
