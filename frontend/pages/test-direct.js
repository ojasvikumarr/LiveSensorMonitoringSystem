import { useState } from 'react';
import axios from 'axios';

export default function TestDirect() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  const testDirectCall = async () => {
    try {
      setError(null);
      console.log('Making direct call to backend...');
      // Direct call to backend - this might fail due to CORS
      const response = await axios.get('http://localhost:8083/api/sensors/health');
      setResult(response.data);
      console.log('Direct call successful:', response.data);
    } catch (err) {
      console.error('Direct call failed:', err);
      setError(err.message);
    }
  };
  
  const testProxyCall = async () => {
    try {
      setError(null);
      console.log('Making proxy call...');
      // Proxy call - this should work
      const response = await axios.get('/api/proxy/api/api/sensors/health');
      setResult(response.data);
      console.log('Proxy call successful:', response.data);
    } catch (err) {
      console.error('Proxy call failed:', err);
      setError(err.message);
    }
  };
  
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Direct vs Proxy API Calls</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={testDirectCall} style={{ marginRight: '10px', padding: '10px' }}>
          Test Direct Call (may fail due to CORS)
        </button>
        <button onClick={testProxyCall} style={{ padding: '10px' }}>
          Test Proxy Call (should work)
        </button>
      </div>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {result && (
        <div style={{ background: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
          <h3>Result:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
