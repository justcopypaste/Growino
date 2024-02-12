const express = require("express");
const sensorController = require('../controllers/plantsController')

const router = express.Router();

router.get('/', sensorController.getPlants)
router.post('/', sensorController.postPlants)

module.exports = router