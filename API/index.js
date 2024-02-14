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
const subdomain = require("express-subdomain")
const tls = require('tls');

app.use(cors());

db.initDB();

nunjucks.configure(__dirname + "/public", {
  autoescape: true,
  express: app,
});

app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.set("view engine", "njk");

app.use("/", apiRoutes);
app.use(subdomain('api', viewRoutes));

// HTTP Server
const httpServer = http.createServer(app);

httpServer.listen(80, () => {
  console.log(`HTTP Server running on port 80`);
});

// Configuration for each subdomain
const subdomains = {
  'api.growino.app': {
    key: fs.readFileSync(__dirname + "/public/ssl/api/private.key", "utf8"),
    cert: fs.readFileSync(__dirname + "/public/ssl/api/certificate.crt", "utf8")
  },
  'growino.app': {
    key: fs.readFileSync(__dirname + "/public/ssl/root/private.key", "utf8"),
    cert: fs.readFileSync(__dirname + "/public/ssl/root/certificate.crt", "utf8")
  },
};

// Create HTTPS server
const server = https.createServer((req, res) => {
  // Extract the requested subdomain from the request
  const host = req.headers.host;
  const subdomain = host.split('.')[0]; // Assuming subdomain is the first part of the hostname

  // Find the configuration for the requested subdomain
  const config = subdomains[host];

  if (config) {
    // If a matching configuration is found, use it to handle the request
    res.writeHead(200);
    res.end(`Hello from ${subdomain}`);
  } else {
    // If no matching configuration is found, respond with a 404 Not Found
    res.writeHead(404);
    res.end('Not Found');
  }
});

// Start the server
server.listen(443, () => {
  console.log(`HTTPS Server running on port 443`);
});