const Stream = require('node-rtsp-stream')

new Stream({
    name: 'bbb',
    streamUrl: 'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mp4',
    wsPort: 6969,
    ffmpegOptions: {
      '-stats': '',
      '-r': 30
    }
})