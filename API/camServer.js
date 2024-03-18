const fs = require('fs');
const https = require('https');
const Stream = require('node-rtsp-stream');
const WebSocket = require('ws'); // Make sure to install this package if not already installed

// SSL certificate details
const serverOptions = {
  key: fs.readFileSync(__dirname + "/public/ssl/root/private.key", "utf8"),
  cert: fs.readFileSync(__dirname + "/public/ssl/root/certificate.crt", "utf8")
};

// Create an HTTPS server
const server = https.createServer(serverOptions);
server.listen(4000); // This is the port for secure WebSocket connections

// Set up the WebSocket server
new WebSocket.Server({ server });

// Initialize your RTSP stream
new Stream({
  name: 'growino cam 0',
  streamUrl: 'rtsp://www.growino.app:3000/videoMain',
  wsPort: 4000, // Note: This is now using the secure port
  ffmpegOptions: {
    '-stats': '',
    '-r': 30
  }
});

console.log('Secure WebSocket server running on port 4000');
