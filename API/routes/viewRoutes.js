const express = require("express");
const router = express.Router();

router.get("/home", (req, res) => {
  console.log("GET API /home");
  res.send("views/home.html");
});
router.get("/endpoint", (req, res) => {
  console.log("GET API /endpoint");
  res.send("views/charts.html");
});

module.exports = router;
