const express = require("express");
const sensorController = require('../../controllers/plantsController')

const router = express.Router();

router.get('/', sensorController.getPlants)
router.post('/', sensorController.postPlants)
router.delete('/', sensorController.deletePlant)
router.patch('/', sensorController.updatePlant)

module.exports = router