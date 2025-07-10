# Sensor Monitoring Frontend

Next.js frontend for real-time sensor data monitoring.

## Pages

1. **Control Panel** (`/control`) - Service health monitoring and system controls
2. **Dashboard** (`/dashboard`) - Real-time sensor data visualization  
3. **Analytics** (`/analytics`) - System performance metrics
4. **About** (`/about`) - System architecture overview

## Tech Stack

- Next.js 14
- Tailwind CSS
- Recharts
- Lucide React
- Axios

## Setup

```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

- API Service: `http://localhost:8083/api/sensors/*`
- Consumer Health: `http://localhost:8082/health`
- Producer Health: `http://localhost:8081/actuator/health`

## Structure

```
frontend/
├── components/Layout.js
├── lib/api.js
├── pages/
│   ├── control.js
│   ├── dashboard.js
│   ├── analytics.js
│   └── about.js
└── styles/globals.css
```
