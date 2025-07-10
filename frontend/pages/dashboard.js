import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Thermometer, Gauge, RefreshCw, TrendingUp, Activity } from 'lucide-react';
import { apiService } from '../lib/api';

const Dashboard = () => {
  const [sensorData, setSensorData] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);

  const fetchData = async () => {
    try {
      const [readings, stats] = await Promise.all([
        apiService.getAllReadings(),
        apiService.getStatistics()
      ]);
      
      setSensorData(readings);
      setStatistics(stats);
      setLastUpdate(new Date());
      
      // Prepare chart data
      const chartPoints = readings.map(reading => ({
        sensorId: reading.sensorId,
        temperature: reading.temperature,
        pressure: reading.pressure,
        location: reading.location
      }));
      setChartData(chartPoints);
      
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    let interval;
    if (isAutoRefresh) {
      interval = setInterval(fetchData, 3000); // Refresh every 3 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoRefresh]);

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getTemperatureColor = (temp) => {
    if (temp < 15) return 'text-blue-600';
    if (temp < 25) return 'text-green-600';
    if (temp < 30) return 'text-orange-600';
    return 'text-red-600';
  };

  const getPressureStatus = (pressure) => {
    if (pressure < 1000) return { color: 'text-blue-600', status: 'Low' };
    if (pressure > 1020) return { color: 'text-red-600', status: 'High' };
    return { color: 'text-green-600', status: 'Normal' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-primary-500" />
        <span className="ml-2 text-lg">Loading sensor data...</span>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Live Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Real-time sensor data monitoring • Last updated: {lastUpdate?.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isAutoRefresh}
                onChange={(e) => setIsAutoRefresh(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-900">Auto-refresh</span>
            </label>
          </div>
          <button
            onClick={fetchData}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Live Status Indicator */}
      <div className="mb-6">
        <div className={`flex items-center p-3 rounded-md ${isAutoRefresh ? 'bg-green-50' : 'bg-gray-50'}`}>
          <Activity className={`w-5 h-5 mr-2 ${isAutoRefresh ? 'text-green-500 animate-pulse' : 'text-gray-400'}`} />
          <span className={`text-sm font-medium ${isAutoRefresh ? 'text-green-600' : 'text-gray-500'}`}>
            {isAutoRefresh ? 'Live Data Streaming' : 'Auto-refresh Disabled'}
          </span>
          {isAutoRefresh && (
            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
              Refreshing every 3s
            </span>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Thermometer className="w-8 h-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg Temperature</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statistics.averageTemperature?.toFixed(1) || '0.0'}°C
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Gauge className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg Pressure</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statistics.averagePressure?.toFixed(1) || '0.0'} hPa
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Sensors</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.totalSensors || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-bold">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Temp Range</p>
                <p className="text-sm text-gray-900">
                  {statistics.minTemperature?.toFixed(1) || '0.0'}° - {statistics.maxTemperature?.toFixed(1) || '0.0'}°C
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Temperature Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Temperature by Sensor</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sensorId" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`${value}°C`, 'Temperature']}
                labelFormatter={(label) => `Sensor ${label}`}
              />
              <Bar dataKey="temperature" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pressure Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pressure by Sensor</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sensorId" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`${value} hPa`, 'Pressure']}
                labelFormatter={(label) => `Sensor ${label}`}
              />
              <Bar dataKey="pressure" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sensor Data Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Latest Sensor Readings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sensor ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Temperature
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pressure
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sensorData.map((sensor) => {
                const pressureStatus = getPressureStatus(sensor.pressure);
                return (
                  <tr key={sensor.sensorId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                        {sensor.sensorId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sensor.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`font-medium ${getTemperatureColor(sensor.temperature)}`}>
                        {sensor.temperature.toFixed(2)}°C
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sensor.pressure.toFixed(2)} hPa
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        pressureStatus.status === 'Normal' ? 'bg-green-100 text-green-800' :
                        pressureStatus.status === 'High' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {pressureStatus.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatTimestamp(sensor.timestamp)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {sensorData.length === 0 && (
        <div className="text-center py-12">
          <Gauge className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No sensor data available</h3>
          <p className="text-gray-500">Make sure your producer and consumer services are running.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
