package com.example.api.controller;

import com.example.api.model.SensorReading;
import com.example.api.service.SensorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.constraints.NotBlank;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/sensors")
@Tag(name = "Sensor API", description = "API for sensor data")
@Slf4j
public class SensorController {

    @Autowired
    private SensorService sensorService;

    @GetMapping("/latest")
    @Operation(summary = "Get sensor data", description = "Get latest data for a sensor")
    public ResponseEntity<?> getLatestSensorReading(
            @Parameter(description = "Sensor ID") @RequestParam @NotBlank String sensorId) {
        
        log.info("Getting data for sensor: {}", sensorId);
        
        Optional<SensorReading> reading = sensorService.getLatestSensorReading(sensorId);
        
        if (reading.isPresent()) {
            return ResponseEntity.ok(reading.get());
        } else {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Sensor not found");
            error.put("sensorId", sensorId);
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/all")
    @Operation(summary = "Get all sensors", description = "Get data for all sensors")
    public ResponseEntity<List<SensorReading>> getAllLatestSensorReadings() {
        
        List<SensorReading> readings = sensorService.getAllLatestSensorReadings();
        return ResponseEntity.ok(readings);
    }

    @PostMapping("/batch")
    @Operation(summary = "Get multiple sensors", description = "Get data for specific sensors")
    public ResponseEntity<Map<String, SensorReading>> getSensorReadings(@RequestBody List<String> sensorIds) {
        
        Map<String, SensorReading> readings = sensorService.getSensorReadings(sensorIds);
        return ResponseEntity.ok(readings);
    }

    @GetMapping("/statistics")
    @Operation(summary = "Get stats", description = "Get sensor statistics")
    public ResponseEntity<Map<String, Object>> getSensorStatistics() {
        
        Map<String, Object> stats = sensorService.getSensorStatistics();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/list")
    @Operation(summary = "Get sensor list", description = "Get all sensor IDs")
    public ResponseEntity<Map<String, Object>> getAllSensorIds() {
        
        List<String> sensorIds = sensorService.getAllSensorIds();
        
        Map<String, Object> response = new HashMap<>();
        response.put("sensorIds", sensorIds);
        response.put("count", sensorIds.size());
        response.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("service", "api-service");
        health.put("timestamp", System.currentTimeMillis());
        
        List<String> sensorIds = sensorService.getAllSensorIds();
        health.put("activeSensors", sensorIds.size());
        
        return ResponseEntity.ok(health);
    }

    @GetMapping("/exists/{sensorId}")
    public ResponseEntity<Map<String, Object>> checkSensorExists(@PathVariable String sensorId) {
        
        boolean exists = sensorService.sensorExists(sensorId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("sensorId", sensorId);
        response.put("exists", exists);
        response.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.ok(response);
    }
}
