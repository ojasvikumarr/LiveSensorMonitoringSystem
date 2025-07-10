package com.example.api;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@Slf4j
public class ApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiApplication.class, args);
        log.info("API Service started successfully!");
        log.info("Available endpoints:");
        log.info("  GET  /api/sensors/latest?sensorId=101  - Get latest reading for a sensor");
        log.info("  GET  /api/sensors/all                  - Get all latest readings");
        log.info("  POST /api/sensors/batch               - Get readings for multiple sensors");
        log.info("  GET  /api/sensors/statistics          - Get sensor statistics");
        log.info("  GET  /api/sensors/list                - Get all sensor IDs");
        log.info("  GET  /api/sensors/health              - Health check");
        log.info("  GET  /swagger-ui.html                 - API Documentation");
    }
}
