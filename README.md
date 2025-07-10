# LiveSensorMonitoring System

An IoT sensor monitoring system I built with Spring Boot microservices, Kafka, Redis, and Next.js.

## Architecture

- **Frontend**: Next.js dashboard (Port 3000)
- **API Service**: Spring Boot REST API (Port 8080)
- **Producer Service**: Sensor data generator (Port 8081)
- **Consumer Service**: Data processor & storage (Port 8082)
- **Infrastructure**: Kafka, Redis, Zookeeper

## Quick Start

### Prerequisites
- Docker & Docker Compose
- 8GB+ RAM recommended
- Ports 3000, 8080, 8081, 8082, 6379, 9092, 2181 available


##  Access Points

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Main dashboard |
| API | http://localhost:8080/api/sensors/health | Health check |
| Producer | http://localhost:8081/actuator/health | Producer status |
| Consumer | http://localhost:8082/actuator/health | Consumer status |

##  Management Commands

```bash

docker-compose logs -f [service-name]


docker-compose ps


docker-compose restart [service-name]

# System monitoring
./enhanced-monitor.sh

# Create backup
./backup-system.sh
```

## Testing

```bash
# Run model tests
cd api-service && mvn test -Dtest=SensorReadingTest
cd producer-service && mvn test -Dtest=SensorReadingTest
cd consumer-service && mvn test -Dtest=SensorReadingTest

# Run all tests
mvn test
```

##  Project Structure

```
├── api-service/           # REST API service
├── producer-service/      # Sensor data generator
├── consumer-service/      # Data processor
├── frontend/             # Next.js dashboard
├── docker-compose.prod.yml # Production config
```

##  Configuration

### Environment Variables
- `SPRING_PROFILES_ACTIVE`: Set profile (local/prod)
- `KAFKA_BOOTSTRAP_SERVERS`: Kafka connection
- `REDIS_HOST`: Redis connection

### Ports Configuration
All ports are configurable in docker-compose files.

##  Features

- Real-time sensor data generation
- Kafka-based message streaming
- Redis caching with TTL
- REST API with Swagger docs
- Real-time dashboard
- Health monitoring
- Comprehensive testing
- Deployment ready

## Development

### Built With
- **Backend**: Spring Boot 3, Java 17
- **Frontend**: Next.js, React, Tailwind CSS
- **Messaging**: Apache Kafka
- **Caching**: Redis
- **Testing**: JUnit 5, Mockito
- **Deployment**: Docker, Docker Compose

### Code Quality
- JUnit tests
- Clean architecture
- Error handling
- Logging
- Documentation

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8080/swagger-ui.html
- API Docs: http://localhost:8080/api-docs

## Monitoring

### Health Checks
All services expose `/actuator/health` endpoints.

### Logs
- Application logs via Docker
- Structured logging
- Log rotation configured

### Metrics
- Basic monitoring via enhanced-monitor.sh
- Service status tracking
- Resource usage monitoring

## Troubleshooting

### Common Issues

1. **Port conflicts**: Check if ports are already in use
2. **Memory issues**: Ensure 8GB+ RAM available
3. **Docker issues**: Restart Docker service
4. **Service startup**: Check logs with `docker-compose logs [service]`

### Debug Commands
```bash
# Check service health
curl http://localhost:8080/api/sensors/health

# View specific service logs
docker-compose logs -f api-service

# Check container status
docker ps

# Restart stuck service
docker-compose restart [service-name]
```

## Support

For issues or questions, check:
1. Service logs: `docker-compose logs -f`
2. Health endpoints: `/actuator/health`
3. System monitoring: `./enhanced-monitor.sh`

---
# LiveSensorMonitoringSystem
