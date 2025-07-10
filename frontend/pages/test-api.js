import { useState } from 'react';
import { apiService } from '../lib/api';

export default function TestAPI() {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const testHealthEndpoints = async () => {
    setLoading(true);
    const testResults = {};

    try {
      // Test each health endpoint
      console.log('Testing producer health...');
      try {
        const producerHealth = await apiService.getServiceHealth('producer');
        testResults.producer = { status: 'success', data: producerHealth };
        console.log('Producer health:', producerHealth);
      } catch (error) {
        testResults.producer = { status: 'error', error: error.message };
        console.error('Producer health error:', error);
      }

      console.log('Testing consumer health...');
      try {
        const consumerHealth = await apiService.getServiceHealth('consumer');
        testResults.consumer = { status: 'success', data: consumerHealth };
        console.log('Consumer health:', consumerHealth);
      } catch (error) {
        testResults.consumer = { status: 'error', error: error.message };
        console.error('Consumer health error:', error);
      }

      console.log('Testing API health...');
      try {
        const apiHealth = await apiService.getServiceHealth('api');
        testResults.api = { status: 'success', data: apiHealth };
        console.log('API health:', apiHealth);
      } catch (error) {
        testResults.api = { status: 'error', error: error.message };
        console.error('API health error:', error);
      }

      console.log('Testing producer status...');
      try {
        const producerStatus = await apiService.getProducerStatus();
        testResults.producerStatus = { status: 'success', data: producerStatus };
        console.log('Producer status:', producerStatus);
      } catch (error) {
        testResults.producerStatus = { status: 'error', error: error.message };
        console.error('Producer status error:', error);
      }

    } catch (error) {
      console.error('Overall test error:', error);
    }

    setResults(testResults);
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>API Health Test Page</h1>
      <button 
        onClick={testHealthEndpoints} 
        disabled={loading}
        style={{ 
          padding: '10px 20px', 
          fontSize: '16px', 
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Testing...' : 'Test Health Endpoints'}
      </button>

      <div style={{ marginTop: '20px' }}>
        <h2>Results:</h2>
        <pre style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '15px', 
          borderRadius: '4px',
          overflow: 'auto'
        }}>
          {JSON.stringify(results, null, 2)}
        </pre>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2>Health Check URLs:</h2>
        <ul>
          <li><a href="/api/proxy/producer/actuator/health" target="_blank">Producer Health</a></li>
          <li><a href="/api/proxy/consumer/health" target="_blank">Consumer Health</a></li>
          <li><a href="/api/proxy/api/api/sensors/health" target="_blank">API Health</a></li>
        </ul>
      </div>
    </div>
  );
}
