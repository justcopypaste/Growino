const sensors = require("../models/sensor");

const getSensors = (req, res) => {
  try {
    let { userid, dateStart, dateEnd, tent, limit } = req.query;
    let query = {};

    if(!limit){
      limit = 0
    }

    if (userid) {
      query.userid = parseInt(userid);
    } else {
      res
        .status(400)
        .send({ success: false, message: "Error en los datos enviados" });
      return;
    }

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
      .limit(limit)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res
          .status(500)
          .send({ success: false, message: "Error inesperado", error: err });
      });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Error inesperado", error: error });
  }
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
  let { soil, power, tent, userid } = req.body;
  sensors
    .create({
      userid: userid,
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
