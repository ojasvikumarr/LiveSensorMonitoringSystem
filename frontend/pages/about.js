import { useState, useEffect } from 'react';
import { Info, Activity, Database, Zap, Settings, AlertCircle, CheckCircle, Server, ArrowRight, MessageSquare, BarChart, RefreshCw } from 'lucide-react';

const AboutPage = () => {
  const [activeTab, setActiveTab] = useState('architecture');

  return (
    <div className="px-4 py-6">
      {/* Hero Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 md:p-8 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1">
              <h1 className="text-2xl md:text-4xl font-bold mb-4">Live Sensor Monitoring System</h1>
              <p className="text-lg md:text-xl text-blue-100 mb-4">
                Real-time IoT sensor data processing and visualization platform
              </p>
              <div className="flex flex-wrap items-center gap-3 md:gap-4 text-blue-100 text-sm md:text-base">
                <div className="flex items-center">
                  <Activity className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  <span>Real-time Processing</span>
                </div>
                <div className="flex items-center">
                  <Database className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  <span>Redis Storage</span>
                </div>
                <div className="flex items-center">
                  <Zap className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  <span>Kafka Streaming</span>
                </div>
              </div>
            </div>
            <div className="flex justify-start lg:justify-end">
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="bg-white text-blue-600 px-4 py-2 md:px-6 md:py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors text-sm md:text-base"
              >
                View Dashboard →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Architecture Visualization */}
      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <Server className="w-6 h-6 mr-2 text-blue-600" />
          System Architecture
        </h2>
        
        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button 
            className={`px-4 py-2 ${activeTab === 'architecture' ? 'border-b-2 border-blue-500 text-blue-600 font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab('architecture')}
          >
            Architecture
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'dataflow' ? 'border-b-2 border-blue-500 text-blue-600 font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab('dataflow')}
          >
            Data Flow
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'tech' ? 'border-b-2 border-blue-500 text-blue-600 font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab('tech')}
          >
            Technologies
          </button>
        </div>
        
        {/* Architecture Tab */}
        {activeTab === 'architecture' && (
          <div>
            <div className="mb-4">
              <div className="relative bg-white p-4 rounded-lg shadow-sm">
                <div className="relative">
                  {/* Architecture Diagram */}
                  <div className="flex flex-col items-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">System Architecture</h3>
                    
                    {/* Minimalistic horizontal architecture */}
                    <div className="flex flex-wrap items-center justify-center w-full overflow-x-auto py-3 px-2">
                      {/* Producer Service */}
                      <div className="flex flex-col items-center bg-white p-2 rounded-md min-w-[70px] md:min-w-[90px] mb-2">
                        <Zap className="w-5 h-5 md:w-6 md:h-6 text-teal-600 mb-1" />
                        <div className="text-xs md:text-sm font-medium text-teal-700">Producer</div>
                      </div>
                      
                      {/* Arrow */}
                      <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400 mx-1 flex-shrink-0" />
                      
                      {/* Kafka */}
                      <div className="flex flex-col items-center bg-white p-2 rounded-md min-w-[70px] md:min-w-[90px] mb-2">
                        <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-green-600 mb-1" />
                        <div className="text-xs md:text-sm font-medium text-green-700">Kafka</div>
                      </div>
                      
                      {/* Arrow */}
                      <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400 mx-1 flex-shrink-0" />
                      
                      {/* Consumer Service */}
                      <div className="flex flex-col items-center bg-white p-2 rounded-md min-w-[70px] md:min-w-[90px] mb-2">
                        <RefreshCw className="w-5 h-5 md:w-6 md:h-6 text-orange-600 mb-1" />
                        <div className="text-xs md:text-sm font-medium text-orange-700">Consumer</div>
                      </div>
                      
                      {/* Arrow */}
                      <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400 mx-1 flex-shrink-0" />
                      
                      {/* Redis */}
                      <div className="flex flex-col items-center bg-white p-2 rounded-md min-w-[70px] md:min-w-[90px] mb-2">
                        <Database className="w-5 h-5 md:w-6 md:h-6 text-red-600 mb-1" />
                        <div className="text-xs md:text-sm font-medium text-red-700">Redis</div>
                      </div>
                      
                      {/* Arrow */}
                      <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400 mx-1 flex-shrink-0" />
                      
                      {/* API Service */}
                      <div className="flex flex-col items-center bg-white p-2 rounded-md min-w-[70px] md:min-w-[90px] mb-2">
                        <Server className="w-5 h-5 md:w-6 md:h-6 text-purple-600 mb-1" />
                        <div className="text-xs md:text-sm font-medium text-purple-700">API</div>
                      </div>
                      
                      {/* Arrow */}
                      <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400 mx-1 flex-shrink-0" />
                      
                      {/* Frontend */}
                      <div className="flex flex-col items-center bg-white p-2 rounded-md min-w-[70px] md:min-w-[90px] mb-2">
                        <BarChart className="w-5 h-5 md:w-6 md:h-6 text-blue-600 mb-1" />
                        <div className="text-xs md:text-sm font-medium text-blue-700">Frontend</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Data Flow Tab */}
        {activeTab === 'dataflow' && (
          <div>
            <div className="relative bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl shadow-sm">
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Flow Visualization</h3>
                
                {/* Step 1: Frontend */}
                <div className="flex flex-col md:flex-row items-start md:items-center mb-4 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <div className="bg-blue-100 p-3 rounded-lg flex items-center justify-center mr-4 mb-2 md:mb-0">
                    <BarChart className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-800">1. Frontend</h4>
                    <p className="text-sm text-gray-600">Next.js web application provides user interface for visualizing sensor data</p>
                  </div>
                </div>
                
                {/* Arrow */}
                <div className="flex justify-center my-2">
                  <div className="flex flex-col items-center">
                    <ArrowRight className="w-6 h-6 text-blue-500 transform rotate-90" />
                    <div className="text-xs text-blue-500">HTTP Requests</div>
                  </div>
                </div>
                
                {/* Step 2: API Service */}
                <div className="flex flex-col md:flex-row items-start md:items-center mb-4 bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                  <div className="bg-purple-100 p-3 rounded-lg flex items-center justify-center mr-4 mb-2 md:mb-0">
                    <Server className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-purple-800">2. API Service</h4>
                    <p className="text-sm text-gray-600">Serves as gateway for data access, retrieves processed sensor data from Redis</p>
                  </div>
                </div>
                
                {/* Arrow */}
                <div className="flex justify-center my-2">
                  <div className="flex flex-col items-center">
                    <ArrowRight className="w-6 h-6 text-red-500 transform rotate-90" />
                    <div className="text-xs text-red-500">Data Retrieval</div>
                  </div>
                </div>
                
                {/* Step 3: Redis */}
                <div className="flex flex-col md:flex-row items-start md:items-center mb-4 bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                  <div className="bg-red-100 p-3 rounded-lg flex items-center justify-center mr-4 mb-2 md:mb-0">
                    <Database className="w-8 h-8 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-red-800">3. Redis Data Store</h4>
                    <p className="text-sm text-gray-600">In-memory database stores processed sensor data with 1-hour TTL</p>
                  </div>
                </div>
                
                {/* Arrow */}
                <div className="flex justify-center my-2">
                  <div className="flex flex-col items-center">
                    <ArrowRight className="w-6 h-6 text-orange-500 transform -rotate-90" />
                    <div className="text-xs text-orange-500">Data Storage</div>
                  </div>
                </div>
                
                {/* Step 4: Consumer Service */}
                <div className="flex flex-col md:flex-row items-start md:items-center mb-4 bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                  <div className="bg-orange-100 p-3 rounded-lg flex items-center justify-center mr-4 mb-2 md:mb-0">
                    <RefreshCw className="w-8 h-8 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-orange-800">4. Consumer Service</h4>
                    <p className="text-sm text-gray-600">Listens to Kafka topics, processes incoming sensor data and saves to Redis</p>
                  </div>
                </div>
                
                {/* Arrow */}
                <div className="flex justify-center my-2">
                  <div className="flex flex-col items-center">
                    <ArrowRight className="w-6 h-6 text-green-500 transform -rotate-90" />
                    <div className="text-xs text-green-500">Message Consumption</div>
                  </div>
                </div>
                
                {/* Step 5: Kafka */}
                <div className="flex flex-col md:flex-row items-start md:items-center mb-4 bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                  <div className="bg-green-100 p-3 rounded-lg flex items-center justify-center mr-4 mb-2 md:mb-0">
                    <MessageSquare className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-green-800">5. Kafka Message Broker</h4>
                    <p className="text-sm text-gray-600">Distributes sensor data messages through dedicated topics</p>
                  </div>
                </div>
                
                {/* Arrow */}
                <div className="flex justify-center my-2">
                  <div className="flex flex-col items-center">
                    <ArrowRight className="w-6 h-6 text-teal-500 transform -rotate-90" />
                    <div className="text-xs text-teal-500">Message Publishing</div>
                  </div>
                </div>
                
                {/* Step 6: Producer Service */}
                <div className="flex flex-col md:flex-row items-start md:items-center bg-teal-50 p-4 rounded-lg border-l-4 border-teal-500">
                  <div className="bg-teal-100 p-3 rounded-lg flex items-center justify-center mr-4 mb-2 md:mb-0">
                    <Zap className="w-8 h-8 text-teal-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-teal-800">6. Producer Service</h4>
                    <p className="text-sm text-gray-600">Generates simulated IoT sensor data using multithreading and publishes to Kafka</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Technologies Tab */}
        {activeTab === 'tech' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Backend */}
              <div className="bg-gradient-to-b from-green-50 to-green-100 rounded-xl p-6 shadow-sm">
                <div className="bg-white rounded-lg p-4 shadow-sm mb-4 flex items-center">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <Server className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-green-800">Backend Microservices</h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="font-medium text-teal-800 flex items-center">
                      <Zap className="w-4 h-4 mr-2 text-teal-600" />
                      Producer Service
                    </div>
                    <div className="text-sm text-teal-600 mt-1">Spring Boot service that generates sensor data using multithreaded simulation</div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs bg-teal-50 px-2 py-1 rounded-full text-teal-700">Multithreading</span>
                      <span className="text-xs bg-teal-50 px-2 py-1 rounded-full text-teal-700">Kafka Producer</span>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="font-medium text-orange-800 flex items-center">
                      <RefreshCw className="w-4 h-4 mr-2 text-orange-600" />
                      Consumer Service
                    </div>
                    <div className="text-sm text-orange-600 mt-1">Spring Boot service that processes Kafka messages and stores data in Redis</div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs bg-orange-50 px-2 py-1 rounded-full text-orange-700">Kafka Consumer</span>
                      <span className="text-xs bg-orange-50 px-2 py-1 rounded-full text-orange-700">Redis Client</span>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="font-medium text-purple-800 flex items-center">
                      <Server className="w-4 h-4 mr-2 text-purple-600" />
                      API Service
                    </div>
                    <div className="text-sm text-purple-600 mt-1">Spring Boot REST API that retrieves processed sensor data from Redis</div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs bg-purple-50 px-2 py-1 rounded-full text-purple-700">REST Endpoints</span>
                      <span className="text-xs bg-purple-50 px-2 py-1 rounded-full text-purple-700">Redis Integration</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Messaging & Storage */}
              <div className="bg-gradient-to-b from-blue-50 to-blue-100 rounded-xl p-6 shadow-sm">
                <div className="bg-white rounded-lg p-4 shadow-sm mb-4 flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <Database className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-blue-800">Data Layer</h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="font-medium text-blue-800">Apache Kafka</div>
                    <div className="text-sm text-blue-600">Message streaming platform</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="font-medium text-blue-800">Redis</div>
                    <div className="text-sm text-blue-600">In-memory data store</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="font-medium text-blue-800">ZooKeeper</div>
                    <div className="text-sm text-blue-600">Kafka coordination service</div>
                  </div>
                </div>
              </div>
              
              {/* Frontend & DevOps */}
              <div className="bg-gradient-to-b from-purple-50 to-purple-100 rounded-xl p-6 shadow-sm">
                <div className="bg-white rounded-lg p-4 shadow-sm mb-4 flex items-center">
                  <div className="bg-purple-100 p-2 rounded-full mr-3">
                    <BarChart className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold text-purple-800">Frontend & DevOps</h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="font-medium text-purple-800">Next.js</div>
                    <div className="text-sm text-purple-600">React framework</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="font-medium text-purple-800">Docker</div>
                    <div className="text-sm text-purple-600">Containerization</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="font-medium text-purple-800">Oracle Cloud</div>
                    <div className="text-sm text-purple-600">VM-based deployment</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Key Features */}
      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-green-50 p-4 rounded-lg shadow-sm">
            <h3 className="font-medium text-green-800 mb-1">Real-time Processing</h3>
            <p className="text-sm text-gray-600">Instant data processing with Kafka streaming</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
            <h3 className="font-medium text-blue-800 mb-1">Microservices</h3>
            <p className="text-sm text-gray-600">3 Spring Boot applications working together</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg shadow-sm">
            <h3 className="font-medium text-purple-800 mb-1">Interactive UI</h3>
            <p className="text-sm text-gray-600">Real-time dashboards and visualizations</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg shadow-sm">
            <h3 className="font-medium text-orange-800 mb-1">Containerized</h3>
            <p className="text-sm text-gray-600">Docker-based deployment for portability</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
