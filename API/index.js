const express = require("express");
const cors = require("cors");
const app = express();
const nunjucks = require("nunjucks");
const db = require("./database");
const viewRoutes = require("./routes/viewRoutes");
const apiRoutes = require("./routes/apiRoutes");
const fs = require("fs");
const http = require("http");
const https = require("https");
const path = require('path');

app.use(cors());

db.initDB();

nunjucks.configure(__dirname + "/public", {
  autoescape: true,
  express: app,
});

app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.set("view engine", "njk");

// app.use("/", viewRoutes);
app.use('/api', apiRoutes);

app.post('/test', (req, res)=>{
  console.log(req);
  console.log(req.body);
  res.status(201).json({success: true})
})

// HTTP Server
const httpServer = http.createServer(app);

// Paths to your certificate files
const certPath = path.join('/etc', 'letsencrypt', 'live', 'www.growino.app', 'fullchain.pem');
const keyPath = path.join('/etc', 'letsencrypt', 'live', 'www.growino.app', 'privkey.pem');
const certificate = fs.readFileSync(certPath, 'utf8');
const privateKey = fs.readFileSync(keyPath, 'utf8');

// HTTPS Server
const credentials = { key: privateKey, cert: certificate };
const httpsServer = https.createServer(credentials, app);

httpServer.listen(421, () => {
  console.log(`HTTP Server running on port 80`);
});

httpsServer.listen(420, () => {
  console.log(`HTTPS Server running on port 443`);
});
