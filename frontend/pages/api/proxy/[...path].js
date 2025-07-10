import http from 'http';
import https from 'https';

// Simple proxy to solve CORS issues
export default async function handler(req, res) {
  const { path = [] } = req.query;
  
  if (!Array.isArray(path) || path.length === 0) {
    return res.status(400).json({ error: 'Invalid path' });
  }

  // Map service to port
  const service = path[0];
  const restPath = path.slice(1).join('/');
  
  // Build the query string from the request
  const queryString = new URLSearchParams(req.url.split('?')[1] || '').toString();
  const fullPath = queryString ? `${restPath}?${queryString}` : restPath;
  
  let target = '';
  switch (service) {
    case 'api':
      target = `http://api-service:8083/${fullPath}`;
      break;
    case 'producer':
      target = `http://producer-service:8081/${fullPath}`;
      break;
    case 'consumer':
      target = `http://consumer-service:8082/${fullPath}`;
      break;
    default:
      return res.status(404).json({ error: 'Unknown service' });
  }

  try {
    const isHttps = target.startsWith('https://');
    const proxyModule = isHttps ? https : http;
    const url = new URL(target);

    return new Promise((resolve, reject) => {
      const proxyReq = proxyModule.request(
        {
          hostname: url.hostname,
          port: url.port,
          path: url.pathname + url.search,
          method: req.method,
          timeout: 10000, // 10 second timeout
          family: 4, // Force IPv4 to avoid IPv6 resolution issues
          headers: {
            ...Object.fromEntries(
              Object.entries(req.headers).filter(([key, value]) => 
                value !== undefined && 
                !['x-forwarded-for', 'x-forwarded-proto', 'x-forwarded-host', 'connection'].includes(key.toLowerCase())
              )
            ),
            host: url.host,
            'content-type': req.headers['content-type'] || 'application/json',
          },
        },
        (proxyRes) => {
          // Set status code and headers
          res.status(proxyRes.statusCode);
          
          // Copy headers
          Object.keys(proxyRes.headers).forEach(key => {
            if (proxyRes.headers[key]) {
              res.setHeader(key, proxyRes.headers[key]);
            }
          });
          
          // Handle the response data
          let data = '';
          proxyRes.on('data', (chunk) => {
            data += chunk;
          });
          
          proxyRes.on('end', () => {
            try {
              // Try to parse as JSON first
              const jsonData = JSON.parse(data);
              res.json(jsonData);
            } catch {
              // If not JSON, send as text
              res.send(data);
            }
            resolve();
          });
        }
      );

      proxyReq.on('error', (err) => {
        console.error('Proxy error:', err);
        if (!res.headersSent) {
          res.status(502).json({ error: 'Proxy error', message: err.message });
        }
        resolve();
      });

      proxyReq.on('timeout', () => {
        console.error('Proxy timeout');
        if (!res.headersSent) {
          res.status(504).json({ error: 'Gateway timeout' });
        }
        proxyReq.destroy();
        resolve();
      });

      // Handle request body for POST/PUT requests
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });
        req.on('end', () => {
          if (body) {
            proxyReq.write(body);
          }
          proxyReq.end();
        });
      } else {
        proxyReq.end();
      }
    });
    
  } catch (error) {
    console.error('Proxy setup error:', error);
    return res.status(500).json({ error: 'Proxy setup failed', message: error.message });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
