import { Info, Settings, BarChart3, Activity, Database, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="px-4 py-6">
      {/* Hero Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-12 text-white text-center">
          <h1 className="text-5xl font-bold mb-4">Live Sensor Monitoring</h1>
          <p className="text-xl text-blue-100 mb-8">
            Real-time sensor data processing platform
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div 
              onClick={() => window.location.href = '/about'}
              className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 cursor-pointer hover:bg-opacity-20 transition-all"
            >
              <Info className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">About System</h3>
              <p className="text-blue-100">
                Learn about the architecture and technology stack
              </p>
            </div>
            
            <div 
              onClick={() => window.location.href = '/control'}
              className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 cursor-pointer hover:bg-opacity-20 transition-all"
            >
              <Settings className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Control Panel</h3>
              <p className="text-blue-100">
                Monitor services and manage sensor data
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => window.location.href = '/about'}
            className="p-6 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all text-center"
          >
            <Info className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">About</h3>
            <p className="text-sm text-gray-600">System architecture</p>
          </button>
          
          <button
            onClick={() => window.location.href = '/control'}
            className="p-6 border-2 border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all text-center"
          >
            <Settings className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Control</h3>
            <p className="text-sm text-gray-600">Service management</p>
          </button>
          
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="p-6 border-2 border-purple-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all text-center"
          >
            <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Dashboard</h3>
            <p className="text-sm text-gray-600">Data visualization</p>
          </button>
        </div>
      </div>
    </div>
  );
}
