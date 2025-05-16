import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [inputCode, setInputCode] = useState('');
  const [processId, setProcessId] = useState('');
  const [status, setStatus] = useState('');

  const startProcess = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/start-process', { inputCode });
      const id = response.data;
      setProcessId(id);
      setStatus('PROCESSING');

      const interval = setInterval(async () => {
        const statusResp = await axios.get(`http://localhost:8080/api/status/${id}`);
        setStatus(statusResp.data);

        if (statusResp.data === 'SUCCESS' || statusResp.data === 'FAILED') {
          clearInterval(interval);
        }
      }, 1000);
    } catch (err) {
      console.error(err);
      setStatus('ERROR');
    }
  };

  return (
    <div>
      <textarea
        rows="10"
        value={inputCode}
        onChange={(e) => setInputCode(e.target.value)}
        placeholder="Paste your code here..."
      />
      <br />
      <button onClick={startProcess}>Start Process</button>
      <p>Process ID: {processId}</p>
      <p>Status: {status}</p>
    </div>
  );
}

export default App;