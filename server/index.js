const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Store active streams
const activeStreams = new Map();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build')));

// API to start a stream
app.post('/api/stream/start', upload.single('video'), (req, res) => {
    const { youtubeKey, title, description } = req.body;
    const filePath = req.file.path;

    const rtmpUrl = `rtmp://a.rtmp.youtube.com/live2/${youtubeKey}`;
    
    const ffmpegArgs = [
        '-re',
        '-i', filePath,
        '-c:v', 'libx264',
        '-preset', 'fast',
        '-b:v', '4000k',
        '-maxrate', '4000k',
        '-bufsize', '8000k',
        '-vf', 'scale=1280:720',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-ar', '44100',
        '-f', 'flv',
        rtmpUrl
    ];

    const ffmpegProcess = spawn('ffmpeg', ffmpegArgs);

    ffmpegProcess.on('error', (err) => {
        console.error('FFmpeg error:', err);
    });

    ffmpegProcess.on('close', (code) => {
        fs.unlinkSync(filePath);
        activeStreams.delete(youtubeKey);
        console.log(`Stream ${youtubeKey} ended with code ${code}`);
    });

    activeStreams.set(youtubeKey, ffmpegProcess);
    res.json({ success: true, message: 'Stream started' });
});

// API to stop a stream
app.post('/api/stream/stop', (req, res) => {
    const { youtubeKey } = req.body;
    const process = activeStreams.get(youtubeKey);
    
    if (process) {
        process.kill();
        res.json({ success: true, message: 'Stream stopped' });
    } else {
        res.status(404).json({ success: false, message: 'Stream not found' });
    }
});

// Serve React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
