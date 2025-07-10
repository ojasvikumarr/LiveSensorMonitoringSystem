import { useState, useEffect } from 'react';
import { Play, Square, RefreshCw, CheckCircle, XCircle, AlertCircle, Power, Info, Activity, Database, Zap, Settings, BarChart3, TrendingUp } from 'lucide-react';
import { apiService } from '../lib/api';

const ControlPanel = () => {
  const [services, setServices] = useState({
    producer: null,
    consumer: null,
    api: null
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sensorList, setSensorList] = useState([]);
  const [producerStatus, setProducerStatus] = useState({ running: false, sensorCount: 0, messagesSent: 0 });
  const [producerLoading, setProducerLoading] = useState(false);
  const [systemStatus, setSystemStatus] = useState('checking');
  const [recentMessages, setRecentMessages] = useState([]);
  const [isLiveMode, setIsLiveMode] = useState(true);

  const checkServiceHealth = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [producerHealth, consumerHealth, apiHealth, producerStatusData] = await Promise.allSettled([
        apiService.getServiceHealth('producer'),
        apiService.getServiceHealth('consumer'),
        apiService.getServiceHealth('api'),
        apiService.getProducerStatus()
      ]);

      setServices({
        producer: producerHealth.status === 'fulfilled' ? producerHealth.value : null,
        consumer: consumerHealth.status === 'fulfilled' ? consumerHealth.value : null,
        api: apiHealth.status === 'fulfilled' ? apiHealth.value : null
      });
      
      const allServicesUp = 
        producerHealth.status === 'fulfilled' && producerHealth.value?.status === 'UP' &&
        consumerHealth.status === 'fulfilled' && consumerHealth.value?.status === 'UP' &&
        apiHealth.status === 'fulfilled' && apiHealth.value?.status === 'UP';
      
      setSystemStatus(allServicesUp ? 'healthy' : 'partial');
      
      if (producerStatusData.status === 'fulfilled') {
        setProducerStatus(producerStatusData.value);
      }

      if (apiHealth.status === 'fulfilled') {
        try {
          const sensors = await apiService.getSensorList();
          setSensorList(sensors);
        } catch (err) {
          // Sensor list fetch failed, continue without it
        }
      }
    } catch (err) {
      setError('Failed to check service health');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkServiceHealth();
    
    if (isLiveMode) {
      const intervalTime = producerStatus.running ? 1000 : 2000;
      const interval = setInterval(checkServiceHealth, intervalTime);
      return () => clearInterval(interval);
    }
  }, [isLiveMode, producerStatus.running]);

  const getStatusIcon = (service) => {
    if (!service) return <XCircle className="w-5 h-5 text-red-500" />;
    if (service.status === 'UP') return <CheckCircle className="w-5 h-5 text-green-500" />;
    return <AlertCircle className="w-5 h-5 text-yellow-500" />;
  };

  const getStatusColor = (service) => {
    if (!service) return 'bg-red-50 border-red-200';
    if (service.status === 'UP') return 'bg-green-50 border-green-200';
    return 'bg-yellow-50 border-yellow-200';
  };

  const openExternalLink = (url) => {
    window.open(url, '_blank');
  };
  
  const handleStartProducer = async () => {
    setProducerLoading(true);
    try {
      await apiService.startProducer();
      await checkServiceHealth();
    } catch (err) {
      setError('Failed to start producer service');
    } finally {
      setProducerLoading(false);
    }
  };
  
  const handleStopProducer = async () => {
    setProducerLoading(true);
    try {
      await apiService.stopProducer();
      await checkServiceHealth();
    } catch (err) {
      setError('Failed to stop producer service');
    } finally {
      setProducerLoading(false);
    }
  };

  const startAllServices = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await handleStartProducer();
      setTimeout(() => {
        checkServiceHealth();
      }, 2000);
    } catch (err) {
      setError('Failed to start all services');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-6">
      {/* Control Panel Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-purple-800 to-violet-900 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">System Control Panel</h1>
              <p className="text-lg text-purple-100">
                Monitor services, control sensors, and view real-time metrics
              </p>
            </div>
            <div className="text-right">
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                systemStatus === 'healthy' ? 'bg-green-600 text-white' :
                systemStatus === 'partial' ? 'bg-yellow-600 text-white' :
                'bg-red-600 text-white'
              }`}>
                {systemStatus === 'healthy' ? <CheckCircle className="w-4 h-4 mr-2" /> :
                 systemStatus === 'partial' ? <AlertCircle className="w-4 h-4 mr-2" /> :
                 <XCircle className="w-4 h-4 mr-2" />}
                System {systemStatus === 'healthy' ? 'Healthy' : systemStatus === 'partial' ? 'Partial' : 'Offline'}
              </div>
              <div className="mt-3">
                <button
                  onClick={() => window.location.href = '/about'}
                  className="bg-white bg-opacity-10 hover:bg-opacity-20 border border-white border-opacity-30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center"
                >
                  <Info className="w-4 h-4 mr-2" />
                  Learn About This System
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">{error}</div>
        </div>
      )}

      {/* Service Status Cards */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Service Status</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Producer Service */}
          <div className={`rounded-lg border-2 p-6 ${getStatusColor(services.producer)}`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-blue-600" />
                  Producer Service
                </h3>
                <p className="text-sm text-gray-600">Port: 8081 • Sensor Simulation</p>
              </div>
              {getStatusIcon(services.producer)}
            </div>
            <div className="space-y-3">
              <div className="text-sm">
                <span className="font-medium">Service Status:</span>{' '}
                <span className={services.producer?.status === 'UP' ? 'text-green-600' : 'text-red-600'}>
                  {services.producer?.status || 'DOWN'}
                </span>
              </div>
              <div className="text-sm">
                <span className="font-medium">Sensor Simulation:</span>{' '}
                <span className={producerStatus.running ? 'text-green-600' : 'text-red-600'}>
                  {producerStatus.running ? 'ACTIVE' : 'STOPPED'}
                </span>
              </div>
              <div className="text-sm">
                <span className="font-medium">Simulated Sensors:</span>{' '}
                {sensorList.length > 0 ? `${sensorList.length} sensors` : 'None active'}
              </div>
              {producerStatus.running && (
                <>
                  <div className="text-sm">
                    <span className="font-medium">Messages Generated:</span>{' '}
                    <span className="text-gray-700 font-mono">{producerStatus.messagesSent?.toLocaleString() || 0}</span>
                  </div>
                  {producerStatus.uptimeFormatted && (
                    <div className="text-sm">
                      <span className="font-medium">Running Time:</span>{' '}
                      <span className="text-green-600">{producerStatus.uptimeFormatted}</span>
                    </div>
                  )}
                </>
              )}
              <div className="pt-3 border-t border-gray-200">
                <div className="flex space-x-2">
                  <button
                    onClick={handleStartProducer}
                    disabled={producerLoading || producerStatus.running || !services.producer}
                    className={`flex-1 px-3 py-2 rounded-md flex items-center justify-center space-x-1 text-sm font-medium transition-all duration-200 ${
                      producerLoading || producerStatus.running || !services.producer
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                    }`}
                  >
                    <Play className="w-4 h-4" />
                    <span>Start Sensors</span>
                  </button>
                  
                  <button
                    onClick={handleStopProducer}
                    disabled={producerLoading || !producerStatus.running || !services.producer}
                    className={`flex-1 px-3 py-2 rounded-md flex items-center justify-center space-x-1 text-sm font-medium ${
                      producerLoading || !producerStatus.running || !services.producer
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                    }`}
                  >
                    <Square className="w-4 h-4" />
                    <span>Stop</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Consumer Service */}
          <div className={`rounded-lg border-2 p-6 ${getStatusColor(services.consumer)}`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Database className="w-5 h-5 mr-2 text-orange-600" />
                  Consumer Service
                </h3>
                <p className="text-sm text-gray-600">Port: 8082 • Data Processing</p>
              </div>
              {getStatusIcon(services.consumer)}
            </div>
            <div className="space-y-3">
              <div className="text-sm">
                <span className="font-medium">Service Status:</span>{' '}
                <span className={services.consumer?.status === 'UP' ? 'text-green-600' : 'text-red-600'}>
                  {services.consumer?.status || 'DOWN'}
                </span>
              </div>
              <div className="text-sm">
                <span className="font-medium">Messages Processed:</span>{' '}
                <span className="text-gray-700 font-mono">{services.consumer?.messagesProcessed?.toLocaleString() || 0}</span>
              </div>
              <div className="text-sm">
                <span className="font-medium">Function:</span> Kafka → Redis Pipeline
              </div>
              <div className="text-sm">
                <span className="font-medium">Processing Rate:</span>{' '}
                {services.consumer?.status === 'UP' ? 
                  <span className="text-green-600">Real-time</span> : 
                  <span className="text-gray-500">Offline</span>
                }
              </div>
            </div>
          </div>

          {/* API Service */}
          <div className={`rounded-lg border-2 p-6 ${getStatusColor(services.api)}`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-gray-600" />
                  API Service
                </h3>
                <p className="text-sm text-gray-600">Port: 8083 • REST Endpoints</p>
              </div>
              {getStatusIcon(services.api)}
            </div>
            <div className="space-y-3">
              <div className="text-sm">
                <span className="font-medium">Service Status:</span>{' '}
                <span className={services.api?.status === 'UP' ? 'text-green-600' : 'text-red-600'}>
                  {services.api?.status || 'DOWN'}
                </span>
              </div>
              <div className="text-sm">
                <span className="font-medium">Active Sensors:</span>{' '}
                <span className="text-gray-700">{services.api?.activeSensors || sensorList.length || 0}</span>
              </div>
              <div className="text-sm">
                <span className="font-medium">Available Endpoints:</span> REST APIs
              </div>
              <div className="pt-3 border-t border-gray-200">
                <button
                  onClick={() => window.open('http://144.24.97.79:8083/swagger-ui/index.html', '_blank')}
                  disabled={!services.api || services.api?.status !== 'UP'}
                  className={`w-full px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    !services.api || services.api?.status !== 'UP'
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                  }`}
                >
                  📋 View API Documentation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Actions */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg shadow-lg border border-blue-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2 text-blue-600" />
          Quick Actions
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <button
            onClick={() => setIsLiveMode(!isLiveMode)}
            className={`flex items-center justify-center px-3 py-2 md:px-4 md:py-3 border rounded-md shadow-sm text-xs md:text-sm font-medium transition-all duration-200 ${
              isLiveMode 
                ? 'border-green-300 bg-gradient-to-r from-green-400 to-green-500 text-white hover:from-green-500 hover:to-green-600 shadow-md' 
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Activity className={`w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 ${isLiveMode ? 'animate-pulse' : ''}`} />
            <span className="truncate">{isLiveMode ? 'Live Mode ON' : 'Live Mode OFF'}</span>
          </button>

          <button
            onClick={() => window.location.href = '/about'}
            className="flex items-center justify-center px-3 py-2 md:px-4 md:py-3 border border-purple-300 rounded-md shadow-sm bg-gradient-to-r from-purple-100 to-purple-200 text-xs md:text-sm font-medium text-purple-700 hover:from-purple-200 hover:to-purple-300 transition-all duration-200"
          >
            <Info className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
            <span className="truncate">About System</span>
          </button>

          <button
            onClick={() => window.location.href = '/dashboard'}
            className="flex items-center justify-center px-3 py-2 md:px-4 md:py-3 border border-blue-300 rounded-md shadow-sm bg-gradient-to-r from-blue-100 to-blue-200 text-xs md:text-sm font-medium text-blue-700 hover:from-blue-200 hover:to-blue-300 transition-all duration-200"
          >
            <BarChart3 className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
            <span className="truncate">View Dashboard</span>
          </button>

          <button
            onClick={() => window.location.href = '/analytics'}
            className="flex items-center justify-center px-3 py-2 md:px-4 md:py-3 border border-orange-300 rounded-md shadow-sm bg-gradient-to-r from-orange-100 to-orange-200 text-xs md:text-sm font-medium text-orange-700 hover:from-orange-200 hover:to-orange-300 transition-all duration-200"
          >
            <TrendingUp className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
            <span className="truncate">Analytics</span>
          </button>
        </div>
      </div>

      {/* Real-time Metrics */}
      {(producerStatus.running || sensorList.length > 0) && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg shadow-lg border border-green-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-green-600" />
            Live System Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-indigo-400 to-indigo-500 p-4 rounded-lg shadow-md text-white">
              <div className="text-2xl font-bold">{sensorList.length}</div>
              <div className="text-sm text-indigo-100">Active Sensors</div>
            </div>
            <div className="bg-gradient-to-r from-green-400 to-green-500 p-4 rounded-lg shadow-md text-white">
              <div className="text-2xl font-bold">{producerStatus.messagesSent?.toLocaleString() || 0}</div>
              <div className="text-sm text-green-100">Messages Sent</div>
            </div>
            <div className="bg-gradient-to-r from-blue-400 to-blue-500 p-4 rounded-lg shadow-md text-white">
              <div className="text-2xl font-bold">{services.consumer?.messagesProcessed?.toLocaleString() || 0}</div>
              <div className="text-sm text-blue-100">Messages Processed</div>
            </div>
            <div className="bg-gradient-to-r from-purple-400 to-purple-500 p-4 rounded-lg shadow-md text-white">
              <div className="text-2xl font-bold">{producerStatus.uptimeFormatted || '0s'}</div>
              <div className="text-sm text-purple-100">System Uptime</div>
            </div>
          </div>
        </div>
      )}

      {/* System Architecture */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Flow Architecture</h2>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 text-center items-center">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-3xl mb-2">🏭</div>
            <div className="font-medium text-gray-800">Producer</div>
            <div className="text-xs text-gray-600">Sensor Simulation</div>
          </div>
          <div className="flex items-center justify-center">
            <div className="text-2xl text-gray-400">→</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-3xl mb-2">⚡</div>
            <div className="font-medium text-gray-800">Kafka</div>
            <div className="text-xs text-gray-600">Message Stream</div>
          </div>
          <div className="flex items-center justify-center">
            <div className="text-2xl text-gray-400">→</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-3xl mb-2">🔄</div>
            <div className="font-medium text-gray-800">Consumer</div>
            <div className="text-xs text-gray-600">Data Processing</div>
          </div>
          <div className="flex items-center justify-center">
            <div className="text-2xl text-gray-400">→</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-3xl mb-2">🗄️</div>
            <div className="font-medium text-gray-800">Redis</div>
            <div className="text-xs text-gray-600">Fast Storage</div>
          </div>
        </div>
        <div className="mt-6 text-center">
          <div className="inline-flex items-center bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg">
            <Zap className="w-5 h-5 text-gray-600 mr-2" />
            <span className="font-medium text-gray-800">API Service provides REST endpoints for data access</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
