const express = require("express");
const cors = require("cors");
const app = express();
const nunjucks = require("nunjucks");
const db = require("./database");
const camRoutes = require("./routes/camRoutes");
const sensorRoutes = require("./routes/sensorRoutes");
const plantRoutes = require("./routes/plantsRoutes");
const fs = require("fs");
const http = require("http");
const https = require("https");

app.use(cors());

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
app.use("/plants", plantRoutes);

// HTTP Server
const httpServer = http.createServer(app);

// HTTPS Server
const privateKey = fs.readFileSync(
  __dirname + "/public/ssl/private.key",
  "utf8"
);
const certificate = fs.readFileSync(
  __dirname + "/public/ssl/certificate.crt",
  "utf8"
);
const credentials = { key: privateKey, cert: certificate };
const httpsServer = https.createServer(credentials, app);

httpServer.listen(80, () => {
  console.log(`HTTP Server running on port ${HTTP_PORT}`);
});

httpsServer.listen(443, () => {
  console.log(`HTTPS Server running on port ${HTTPS_PORT}`);
});
