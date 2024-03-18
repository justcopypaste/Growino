const fs = require('fs');
const https = require('https');
const WebSocket = require('ws');
const spawn = require('child_process').spawn;

const PORT = 4000
const camUrl = "rtsp://www.growino.app:3000/videoMain"

const privateKey = fs.readFileSync(__dirname + "/public/ssl/root/private.key", "utf8");
const certificate = fs.readFileSync(__dirname + "/public/ssl/root/certificate.crt", "utf8");

const server = https.createServer({
    cert: certificate,
    key: privateKey
});

const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
    console.log('Client connected for video stream');

    const ffmpeg = spawn('ffmpeg', [
        '-i', camUrl,
        '-f', 'mpegts',
        '-codec:v', 'mpeg1video',
        '-b:v', '800k',
        '-r', '30',
        '-'  // Output to stdout
    ]);

    ffmpeg.stdout.on('data', function(data) {
        ws.send(data);
    });

    ffmpeg.stderr.on('data', function(data) {
        console.error(`FFmpeg stderr: ${data}`);
    });

    ws.on('close', function close() {
        console.log('Client disconnected');
        ffmpeg.kill('SIGINT');  // Stops FFmpeg
    });
});

server.listen(PORT, () => {
    console.log('Secure WebSocket server started at wss://localhost:8080');
});
