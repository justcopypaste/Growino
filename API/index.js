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

app.use(cors());

db.initDB();

nunjucks.configure(__dirname + "/public", {
  autoescape: true,
  express: app,
});

app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.set("view engine", "njk");

app.use("/", viewRoutes);
app.use('/api', apiRoutes);

// HTTP Server
const httpServer = http.createServer(app);

// HTTPS Server
const credentials = {
  key: fs.readFileSync(path.join(__dirname, '/etc/letsencrypt/live/www.growino.app/', 'privkey.pem')),
  cert: fs.readFileSync(path.join(__dirname, '/etc/letsencrypt/live/www.growino.app/', 'cert.pem')),
  ca: fs.readFileSync(path.join(__dirname, '/etc/letsencrypt/live/www.growino.app/', 'chain.pem'))
};
const httpsServer = https.createServer(credentials, app);

httpServer.listen(80, () => {
  console.log(`HTTP Server running on port 80`);
});

httpsServer.listen(443, () => {
  console.log(`HTTPS Server running on port 443`);
});
