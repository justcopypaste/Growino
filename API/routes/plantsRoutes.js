const express = require("express");
const sensorController = require('../controllers/plantsController')

const router = express.Router();

router.get('/get', sensorController.getPlants)
router.get('/getLast', sensorController.getLastRecords)
router.post('/post', sensorController.postPlants)

module.exports = router