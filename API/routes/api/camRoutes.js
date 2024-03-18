const express = require("express");
const camController = require('../../controllers/camController')

const router = express.Router();

router.get('/create', camController.createCam)
router.get('/update', camController.updateCam)
router.get('/delete', camController.deleteCam)
router.get('/', camController.getCamIP)

module.exports = router