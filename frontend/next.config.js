/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  
  // Proxy configuration for API routes
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: '/api/proxy/:path*',
      },
    ];
  },
  
  // Allow external hostnames in image domains
  images: {
    domains: ['localhost', '80.225.196.247'],
  },
  
  // Disable static generation for API routes to ensure they work in all environments
  trailingSlash: false,
  
  // Add some security headers
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
