const express = require("express");
const sensorRoutes = require("./api/sensorRoutes");
const userRoutes = require("./api/userRoutes");
const plantRoutes = require("./api/plantsRoutes");
const camRoutes = require("./api/camRoutes");

const router = express.Router();
router.use("/", userRoutes);
router.use("/cam", camRoutes);
router.use("/sensor", sensorRoutes);
router.use("/plants", plantRoutes);

module.exports = router;
