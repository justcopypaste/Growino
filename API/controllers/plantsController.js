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
      console.error(err); // Handle possible errors
    });
};

const getPlants = (req, res) => {
  PlantData.find().then((plants) => res.send(plants));
};

const postPlants = (req, res) => {
  PlantData.create({
    id: req.body.id,
    name: req.body.name,
    soil: req.body.soil,
    strain: req.body.strain,
    tent: req.body.tent,
    plantedDate: req.body.plantedDate,
  }).then((plant) => res.send(plant));
};

module.exports = {
  getPlants,
  postPlants,
  getLastRecords,
};
