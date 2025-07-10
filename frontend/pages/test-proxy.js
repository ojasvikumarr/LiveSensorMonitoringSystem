import { useState, useEffect } from 'react';
import { apiService } from '../lib/api';

export default function TestProxy() {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  
  const runTests = async () => {
    setLoading(true);
    const testResults = {};
    
    try {
      // Test API service health
      console.log('Testing API service health...');
      testResults.apiHealth = await apiService.getServiceHealth('api');
      
      // Test producer health
      console.log('Testing producer health...');
      testResults.producerHealth = await apiService.getServiceHealth('producer');
      
      // Test consumer health
      console.log('Testing consumer health...');
      testResults.consumerHealth = await apiService.getServiceHealth('consumer');
      
      // Test sensor list
      console.log('Testing sensor list...');
      testResults.sensorList = await apiService.getSensorList();
      
      // Test all readings
      console.log('Testing all readings...');
      testResults.allReadings = await apiService.getAllReadings();
      
      // Test producer status
      console.log('Testing producer status...');
      testResults.producerStatus = await apiService.getProducerStatus();
      
      // Test statistics
      console.log('Testing statistics...');
      testResults.statistics = await apiService.getStatistics();
      
    } catch (error) {
      console.error('Test error:', error);
      testResults.error = error.message;
    }
    
    setResults(testResults);
    setLoading(false);
  };
  
  useEffect(() => {
    runTests();
  }, []);
  
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Proxy Test Results</h1>
      {loading && <p>Running tests...</p>}
      <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
        {JSON.stringify(results, null, 2)}
      </pre>
      <button onClick={runTests} disabled={loading}>
        Run Tests Again
      </button>
    </div>
  );
}
