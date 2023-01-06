const Stream = require('node-rtsp-stream')

new Stream({
    name: 'growino cam 0',
    streamUrl: 'rtsp://admin@192.168.0.105:554/videoMain',
    wsPort: 3000,
    ffmpegOptions: {
      '-stats': '',
      '-r': 30
    }
})