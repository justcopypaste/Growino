const express = require("express");
const cors = require("cors");
const app = express();
const nunjucks = require("nunjucks");
const db = require("./database");
const camRoutes = require("./routes/camRoutes");
const sensorRoutes = require("./routes/sensorRoutes");
const plantRoutes = require("./routes/plantsRoutes");
const fs = require('fs');

const http = require("http");
const https = require("https");

app.use(cors());

const port = process.env.port || 80;

db.initDB();

nunjucks.configure(__dirname + "/public", {
  autoescape: true,
  express: app,
});

app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.set("view engine", "njk");

app.use("/cam", camRoutes);
app.use("/sensor", sensorRoutes);
app.use("/plant", plantRoutes);

app.get("/", (req, res) => {
  res.render("views/home.html");
});
app.get("/dash", (req, res) => {
  res.render("views/dashboard.html");
});
app.get("/dashboard", (req, res) => {
  res.render("index.html");
});
app.get("/charts", (req, res) => {
  res.render("views/charts.html");
});
app.get("/cam", (req, res) => {
  db.getCam(0).then((cam) => {
    if (cam) {
      res.render("index", { camUrl: cam.ip });
    } else {
      res.render("index", { camUrl: "" });
    }
  });
});

// HTTP Server
const httpServer = http.createServer(app);

// HTTPS Server
const privateKey = fs.readFileSync("./public/ssl/private.key", "utf8");
const certificate = fs.readFileSync("./public/ssl/certificate.crt", "utf8");
const credentials = { key: privateKey, cert: certificate };
const httpsServer = https.createServer(credentials, app);

const HTTP_PORT = 80;
const HTTPS_PORT = 443;

httpServer.listen(HTTP_PORT, () => {
  console.log(`HTTP Server running on port ${HTTP_PORT}`);
});

httpsServer.listen(HTTPS_PORT, () => {
  console.log(`HTTPS Server running on port ${HTTPS_PORT}`);
});

// app.listen(port, ()=>{
//     console.log("http://localhost:" + port)
// })
