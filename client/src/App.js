import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [streamKey, setStreamKey] = useState('');
  const [title, setTitle] = useState('My Live Stream');
  const [description, setDescription] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [log, setLog] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const startStream = async () => {
    if (!file || !streamKey) return;
    
    const formData = new FormData();
    formData.append('video', file);
    formData.append('youtubeKey', streamKey);
    formData.append('title', title);
    formData.append('description', description);

    try {
      await axios.post('/api/stream/start', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setIsStreaming(true);
      addLog('Stream started successfully');
    } catch (error) {
      addLog(`Error starting stream: ${error.message}`);
    }
  };

  const stopStream = async () => {
    try {
      await axios.post('/api/stream/stop', { youtubeKey: streamKey });
      setIsStreaming(false);
      addLog('Stream stopped successfully');
    } catch (error) {
      addLog(`Error stopping stream: ${error.message}`);
    }
  };

  const addLog = (message) => {
    setLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  return (
    <div className="container">
      <h1>YouTube Live Streamer</h1>
      
      <div className="form-group">
        <label>Stream Key:</label>
        <input 
          type="password" 
          value={streamKey}
          onChange={(e) => setStreamKey(e.target.value)}
          placeholder="YouTube Stream Key"
        />
      </div>

      <div className="form-group">
        <label>Video File:</label>
        <input type="file" onChange={handleFileChange} />
      </div>

      <div className="form-group">
        <label>Title:</label>
        <input 
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Description:</label>
        <textarea 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="actions">
        {!isStreaming ? (
          <button onClick={startStream}>Start Streaming</button>
        ) : (
          <button onClick={stopStream}>Stop Streaming</button>
        )}
      </div>

      <div className="log">
        <h3>Activity Log:</h3>
        <ul>
          {log.map((entry, i) => <li key={i}>{entry}</li>)}
        </ul>
      </div>
    </div>
  );
}

export default App;
