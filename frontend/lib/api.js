import axios from 'axios';

const getBaseUrl = () => {
  if (typeof window === 'undefined') {
    // Server-side rendering
    if (process.env.USE_VM_IP === 'true') {
      return 'http://80.225.196.247';
    }
    return process.env.NODE_ENV === 'production' 
      ? 'http://80.225.196.247'
      : 'http://localhost';
  }
  
  // Client-side
  if (process.env.NODE_ENV === 'production' || process.env.USE_VM_IP === 'true') {
    return 'http://80.225.196.247';
  }
  
  return `http://${window.location.hostname}`;
};

// Option 1: Using proxy (current approach)
const API_BASE_URL = `/api/proxy/api/api/sensors`;
const PRODUCER_BASE_URL = `/api/proxy/producer/api/producer`;

const HEALTH_URLS = {
  producer: `/api/proxy/producer/actuator/health`,
  consumer: `/api/proxy/consumer/health`,
  api: `/api/proxy/api/api/sensors/health`
};

// Option 2: Direct backend calls (alternative approach)
const DIRECT_API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? `http://api-service:8083/api/sensors`
  : `http://localhost:8083/api/sensors`;
const DIRECT_PRODUCER_BASE_URL = process.env.NODE_ENV === 'production' 
  ? `http://producer-service:8081/api/producer`
  : `http://localhost:8081/api/producer`;

const DIRECT_HEALTH_URLS = {
  producer: process.env.NODE_ENV === 'production' 
    ? `http://producer-service:8081/actuator/health`
    : `http://localhost:8081/actuator/health`,
  consumer: process.env.NODE_ENV === 'production' 
    ? `http://consumer-service:8082/health`
    : `http://localhost:8082/health`,
  api: process.env.NODE_ENV === 'production' 
    ? `http://api-service:8083/api/sensors/health`
    : `http://localhost:8083/api/sensors/health`
};

// Choose which approach to use
const USE_PROXY = true; // Set to false to use direct calls

const selectedApiUrl = USE_PROXY ? API_BASE_URL : DIRECT_API_BASE_URL;
const selectedProducerUrl = USE_PROXY ? PRODUCER_BASE_URL : DIRECT_PRODUCER_BASE_URL;
const selectedHealthUrls = USE_PROXY ? HEALTH_URLS : DIRECT_HEALTH_URLS;

// API Service calls
export const apiService = {
  getLatestReading: async (sensorId) => {
    const response = await axios.get(`${selectedApiUrl}/latest`, {
      params: { sensorId }
    });
    return response.data;
  },

  getAllReadings: async () => {
    const response = await axios.get(`${selectedApiUrl}/all`);
    return response.data;
  },

  getStatistics: async () => {
    const response = await axios.get(`${selectedApiUrl}/statistics`);
    return response.data;
  },

  getSensorList: async () => {
    const response = await axios.get(`${selectedApiUrl}/list`);
    return response.data.sensorIds;
  },

  getServiceHealth: async (service) => {
    try {
      const response = await axios.get(selectedHealthUrls[service]);
      return response.data;
    } catch (error) {
      throw error;
    }
  },    
  
  sensorExists: async (sensorId) => {
    try {
      const response = await axios.get(`${selectedApiUrl}/exists/${sensorId}`);
      return response.data.exists;
    } catch {
      return false;
    }
  },

  getProducerStatus: async () => {
    try {
      const response = await axios.get(`${selectedProducerUrl}/status`);
      return response.data;
    } catch (error) {
      return { running: true, sensorCount: 10, messagesSent: 0 };
    }
  },

  startProducer: async () => {
    const response = await axios.post(`${selectedProducerUrl}/start`);
    return response.data;
  },

  stopProducer: async () => {
    const response = await axios.post(`${selectedProducerUrl}/stop`);
    return response.data;
  },
};
