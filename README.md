# LiveSensorMonitoring System

An IoT sensor monitoring system I built with Spring Boot microservices, Kafka, Redis, and Next.js.

## Architecture

- **Frontend**: Next.js dashboard (Port 3000)
- **API Service**: Spring Boot REST API (Port 8083)
- **Producer Service**: Sensor data generator (Port 8081)
- **Consumer Service**: Data processor & storage (Port 8082)
- **Infrastructure**: Kafka, Redis, Zookeeper

## Quick Start

### Prerequisites
- Docker & Docker Compose
- 2GB+ RAM recommended (If deploying on VM)
- Ports 3000, 8080, 8081, 8082, 6379, 9092, 2181 available

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
- JUnit5 testing
- Deployment ready

## Development

### Built With
- **Backend**: Spring Boot 3, Java 17
- **Frontend**: Next.js, React, Tailwind CSS
- **Messaging**: Apache Kafka
- **Caching**: Redis
- **Testing**: JUnit 5, Mockito
- **Deployment**: Docker, Docker Compose

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8080/swagger-ui.html
- API Docs: http://localhost:8080/api-docs



