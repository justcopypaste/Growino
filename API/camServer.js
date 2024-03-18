const Stream = require('node-rtsp-stream')

new Stream({
    name: 'growino cam 0',
    streamUrl: 'rtsp://www.growino.app:3000/videoMain',
    wsPort: 4000,
    ffmpegOptions: {
      '-stats': '',
      '-r': 30
    }
})