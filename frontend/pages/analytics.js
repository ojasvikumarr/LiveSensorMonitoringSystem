import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, Database, MessageSquare, Clock, TrendingUp, Server, Zap, HardDrive } from 'lucide-react';
import { apiService } from '../lib/api';

const Analytics = () => {
  const [statistics, setStatistics] = useState(null);
  const [sensorData, setSensorData] = useState([]);
  const [services, setServices] = useState({
    producer: null,
    consumer: null,
    api: null
  });
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const [stats, readings, producerHealth, consumerHealth, apiHealth] = await Promise.allSettled([
        apiService.getStatistics(),
        apiService.getAllReadings(),
        apiService.getServiceHealth('producer'),
        apiService.getServiceHealth('consumer'),
        apiService.getServiceHealth('api')
      ]);

      if (stats.status === 'fulfilled') setStatistics(stats.value);
      if (readings.status === 'fulfilled') {
        setSensorData(readings.value);
        // Simulate historical data for trends
        const historical = readings.value.map((reading, index) => ({
          time: new Date(Date.now() - (readings.value.length - index) * 60000).toLocaleTimeString(),
          temperature: reading.temperature,
          pressure: reading.pressure,
          sensorId: reading.sensorId
        }));
        setHistoricalData(historical);
      }

      setServices({
        producer: producerHealth.status === 'fulfilled' ? producerHealth.value : null,
        consumer: consumerHealth.status === 'fulfilled' ? consumerHealth.value : null,
        api: apiHealth.status === 'fulfilled' ? apiHealth.value : null
      });

    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  // Prepare distribution data
  const temperatureDistribution = sensorData.reduce((acc, sensor) => {
    const range = Math.floor(sensor.temperature / 5) * 5;
    const key = `${range}-${range + 5}°C`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const distributionData = Object.entries(temperatureDistribution).map(([range, count]) => ({
    range,
    count
  }));

  // Performance metrics
  const performanceMetrics = [
    {
      name: 'Message Rate',
      value: Math.round((services.consumer?.messagesProcessed || 0) / 60),
      unit: '/min',
      icon: Zap,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50'
    },
    {
      name: 'Data Points',
      value: services.consumer?.messagesProcessed || 0,
      unit: 'total',
      icon: Database,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      name: 'Active Sensors',
      value: statistics?.totalSensors || 0,
      unit: 'devices',
      icon: Activity,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      name: 'System Load',
      value: Object.values(services).filter(s => s?.status === 'UP').length,
      unit: '/3 services',
      icon: Server,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Activity className="w-8 h-8 animate-pulse text-primary-500" />
        <span className="ml-2 text-lg">Loading analytics...</span>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">System Analytics</h1>
        <p className="mt-2 text-gray-600">
          Performance metrics and insights for your sensor monitoring system
        </p>
      </div>

      {/* Performance KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {performanceMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className={`${metric.bg} rounded-lg shadow p-6 border`}>
              <div className="flex items-center">
                <Icon className={`w-8 h-8 ${metric.color}`} />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {metric.value.toLocaleString()}
                    <span className="text-sm font-normal text-gray-500 ml-1">{metric.unit}</span>
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Service Health Overview */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Health Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(services).map(([serviceName, service]) => (
            <div key={serviceName} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 capitalize">{serviceName} Service</h4>
                <p className="text-sm text-gray-600">
                  {serviceName === 'consumer' && service?.messagesProcessed 
                    ? `${service.messagesProcessed} messages processed`
                    : serviceName === 'api' && service?.activeSensors
                    ? `${service.activeSensors} active sensors`
                    : 'Monitoring system health'
                  }
                </p>
              </div>
              <div className={`w-3 h-3 rounded-full ${service?.status === 'UP' ? 'bg-green-400' : 'bg-red-400'}`}></div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Temperature Trend */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Temperature Trend Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historicalData.slice(-10)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
              <Tooltip formatter={(value) => [`${value}°C`, 'Temperature']} />
              <Line 
                type="monotone" 
                dataKey="temperature" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={{ fill: '#ef4444' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Temperature Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Temperature Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ range, percent }) => `${range} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Pressure Analysis */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pressure Analysis by Sensor</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sensorData.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sensorId" />
              <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
              <Tooltip formatter={(value) => [`${value} hPa`, 'Pressure']} />
              <Bar dataKey="pressure" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* System Throughput */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Throughput</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Messages per Minute</span>
              <span className="text-lg font-bold text-blue-600">
                {Math.round((services.consumer?.messagesProcessed || 0) / 60)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${Math.min((services.consumer?.messagesProcessed || 0) / 1000 * 100, 100)}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Data Points Collected</span>
              <span className="text-lg font-bold text-green-600">
                {(services.consumer?.messagesProcessed || 0).toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${Math.min((services.consumer?.messagesProcessed || 0) / 5000 * 100, 100)}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Active Sensors</span>
              <span className="text-lg font-bold text-purple-600">
                {statistics?.totalSensors || 0}/10
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full" 
                style={{ width: `${((statistics?.totalSensors || 0) / 10) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* System Statistics */}
      {statistics && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">
                {statistics.averageTemperature?.toFixed(1) || '0.0'}°C
              </div>
              <div className="text-sm text-gray-600">Average Temperature</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">
                {statistics.averagePressure?.toFixed(1) || '0.0'} hPa
              </div>
              <div className="text-sm text-gray-600">Average Pressure</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">
                {((statistics.maxTemperature || 0) - (statistics.minTemperature || 0)).toFixed(1)}°C
              </div>
              <div className="text-sm text-gray-600">Temperature Range</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">
                {statistics.totalSensors || 0}
              </div>
              <div className="text-sm text-gray-600">Active Sensors</div>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Real-time Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
              <span className="font-medium">Data Flow</span>
            </div>
            <p className="text-sm text-gray-600">
              System is processing {Math.round((services.consumer?.messagesProcessed || 0) / 60)} messages per minute
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Database className="w-5 h-5 text-blue-500 mr-2" />
              <span className="font-medium">Storage</span>
            </div>
            <p className="text-sm text-gray-600">
              Redis cache stores latest readings for {statistics?.totalSensors || 0} sensors
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Server className="w-5 h-5 text-purple-500 mr-2" />
              <span className="font-medium">System Health</span>
            </div>
            <p className="text-sm text-gray-600">
              {Object.values(services).filter(s => s?.status === 'UP').length} out of 3 services are running
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
