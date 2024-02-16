const PlantData = require("../models/plant");

const getPlants = (req, res) => {
  let { tent } = req.query;
  let query = {};

  // Check if tent query parameter exists
  if (tent) {
    tent = parseInt(tent, 10); // Ensure tent is an integer
    query.tent = tent; // Add tent to query
  }

  // Execute the query with the conditional filters and group by id to get the last record for each id
  PlantData.aggregate([
    { $match: query }, // Filter based on the query
    { $sort: { id: 1, updatedAt: -1 } }, // Sort by id ascending and createdAt descending
    {
      $group: {
        _id: "$id",
        docs: { $push: "$$ROOT" } // Push all documents with the same id into an array
      }
    },
    {
      $replaceRoot: {
        newRoot: {
          $arrayElemAt: ["$docs", 0] // Get the first document in the array (latest record)
        }
      }
    },
    { $sort: { id: 1 } },
    { $project: { _id: 0, updatedAt: 0, createdAt: 0, __v: 0 } } // Exclude _id and updatedAt fields
  ])
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

const postPlants = (req, res) => {
  PlantData.findOneAndUpdate(
    { id: req.body.id }, // search query
    {
      $set: {
        name: req.body.name,
        strain: req.body.strain,
        tent: req.body.tent,
        plantedDate: req.body.plantedDate,
      },
    },
    {
      new: true, // return the updated document
      upsert: true, // create a new document if none exists
    }
  )
    .then((plant) => {
      res.send(plant);
    })
    .catch((error) => {
      // Handle error
      res.status(500).send(error);
    });
};

const deletePlant = ((req, res) => {
  if (req.query.id && parseInt(req.query.id)) {
    PlantData.findOneAndDelete({ id: req.query.id }, function (err) {
      if (err) res.status(500).send(err)
      res.status(200).send({ succes: true, message: "Eliminado Correctamente" })
    });
  } else {
    res.status(500).send({succes: false, message: "Error en los datos enviados"})
  }
})

const updatePlant = ((req, res) => {
  res.send("update")
})

module.exports = {
  getPlants,
  postPlants,
  deletePlant,
  updatePlant
};
