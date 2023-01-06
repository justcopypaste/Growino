const express = require("express");
const sensorController = require('../controllers/sensorController')

const router = express.Router();

router.get('/get', sensorController.getSensors)
router.get('/getLast', sensorController.getLastRead)
router.post('/post', sensorController.postSensors)

module.exports = router