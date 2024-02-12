const PlantData = require("../models/plant");

const getLastRecords = (req, res) => {
  let tentQuery = req.query.tent;
  let aggregationPipeline = [];

  // If the 'tent' query parameter exists, add a $match stage to the pipeline
  if (tentQuery) {
    tentQuery = parseInt(tentQuery, 10); // Convert to number if needed
    aggregationPipeline.push({ $match: { tent: tentQuery } });
  }

  // Continue building the pipeline
  aggregationPipeline.push(
    { $sort: { createdAt: -1 } }, // Sort by createdAt in descending order
    {
      $group: {
        _id: "$id", // Group by 'id'
        soil: { $first: "$soil" }, // Get 'soil' of the latest record
      },
    },
    {
      $project: {
        _id: 0, // Exclude MongoDB's '_id'
        id: "$_id", // Include the original 'id'
        soil: 1, // Include the 'soil' field
      },
    }
  );

  // Execute the aggregation pipeline
  PlantData.aggregate(aggregationPipeline)
    .then((results) => {
      res.send(results); // Handle the results
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

const getPlants = (req, res) => {
  let tentQuery = req.query.tent;
  let aggregationPipeline = [];

  // If the 'tent' query parameter exists, add a $match stage to the pipeline
  if (tentQuery) {
    tentQuery = parseInt(tentQuery, 10); // Convert to number if needed
    aggregationPipeline.push({ $match: { tent: tentQuery } });
  }

  // Continue building the pipeline
  aggregationPipeline.push(
    { $sort: { createdAt: -1 } }, // Sort by createdAt in descending order
    // {
    //   $group: {
    //     _id: "$id", // Group by 'id'
    //     soil: { $first: "$soil" }, // Get 'soil' of the latest record
    //   },
    // },
    {
      $project: {
        _id: 0, // Exclude MongoDB's '_id'
        id: "$_id", // Include the original 'id'
        soil: 1, // Include the 'soil' field
      },
    }
  );

  // Execute the aggregation pipeline
  PlantData.aggregate(aggregationPipeline)
    .then((results) => {
      res.send(results); // Handle the results
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

module.exports = {
  getPlants,
  postPlants,
  getLastRecords,
};
