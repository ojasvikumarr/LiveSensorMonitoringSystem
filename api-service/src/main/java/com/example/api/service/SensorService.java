package com.example.api.service;

import com.example.api.model.SensorReading;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class SensorService {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Value("${sensor.redis.key-prefix}")
    private String redisKeyPrefix;

    private final ObjectMapper objectMapper;

    public SensorService() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    @PostConstruct
    public void init() {
        log.info("Sensor Service initialized with Redis key prefix: {}", redisKeyPrefix);
    }

    // Get sensor data by ID
    public Optional<SensorReading> getLatestSensorReading(String sensorId) {
        try {
            String redisKey = redisKeyPrefix + sensorId;
            Object value = redisTemplate.opsForValue().get(redisKey);
            
            if (value != null) {
                SensorReading reading = deserializeSensorReading(value);
                return Optional.of(reading);
            }
            
            return Optional.empty();
            
        } catch (Exception e) {
            log.error("Error getting sensor data for {}: {}", sensorId, e.getMessage());
            return Optional.empty();
        }
    }

    // Get all sensor data
    public List<SensorReading> getAllLatestSensorReadings() {
        try {
            Set<String> keys = redisTemplate.keys(redisKeyPrefix + "*");
            if (keys == null || keys.isEmpty()) {
                return Collections.emptyList();
            }

            List<SensorReading> readings = new ArrayList<>();
            for (String key : keys) {
                try {
                    Object value = redisTemplate.opsForValue().get(key);
                    if (value != null) {
                        SensorReading reading = deserializeSensorReading(value);
                        readings.add(reading);
                    }
                } catch (Exception e) {
                    log.warn("Failed to read sensor data for key {}: {}", key, e.getMessage());
                }
            }

            // Sort by sensor ID
            readings.sort(Comparator.comparing(SensorReading::getSensorId));
            
            return readings;
            
        } catch (Exception e) {
            log.error("Error retrieving all sensor data: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    // Get multiple sensors
    public Map<String, SensorReading> getSensorReadings(List<String> sensorIds) {
        Map<String, SensorReading> results = new HashMap<>();
        
        for (String sensorId : sensorIds) {
            Optional<SensorReading> reading = getLatestSensorReading(sensorId);
            reading.ifPresent(r -> results.put(sensorId, r));
        }
        
        return results;
    }

    // Get stats
    public Map<String, Object> getSensorStatistics() {
        try {
            Set<String> keys = redisTemplate.keys(redisKeyPrefix + "*");
            int totalSensors = keys != null ? keys.size() : 0;
            
            List<SensorReading> readings = getAllLatestSensorReadings();
            
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalSensors", totalSensors);
            stats.put("activeSensors", readings.size());
            
            if (!readings.isEmpty()) {
                double avgTemp = readings.stream()
                    .mapToDouble(SensorReading::getTemperature)
                    .average()
                    .orElse(0.0);
                
                double avgPressure = readings.stream()
                    .mapToDouble(SensorReading::getPressure)
                    .average()
                    .orElse(0.0);
                
                double minTemp = readings.stream()
                    .mapToDouble(SensorReading::getTemperature)
                    .min()
                    .orElse(0.0);
                
                double maxTemp = readings.stream()
                    .mapToDouble(SensorReading::getTemperature)
                    .max()
                    .orElse(0.0);
                
                // Round to 2 decimal places
                stats.put("averageTemperature", Math.round(avgTemp * 100.0) / 100.0);
                stats.put("averagePressure", Math.round(avgPressure * 100.0) / 100.0);
                stats.put("minTemperature", Math.round(minTemp * 100.0) / 100.0);
                stats.put("maxTemperature", Math.round(maxTemp * 100.0) / 100.0);
            }
            
            stats.put("timestamp", System.currentTimeMillis());
            
            return stats;
            
        } catch (Exception e) {
            log.error("Error getting stats: {}", e.getMessage());
            return Collections.emptyMap();
        }
    }

    public boolean sensorExists(String sensorId) {
        String redisKey = redisKeyPrefix + sensorId;
        return Boolean.TRUE.equals(redisTemplate.hasKey(redisKey));
    }

    // Get all sensor IDs
    public List<String> getAllSensorIds() {
        try {
            Set<String> keys = redisTemplate.keys(redisKeyPrefix + "*");
            if (keys == null || keys.isEmpty()) {
                return Collections.emptyList();
            }
            
            return keys.stream()
                .map(key -> key.substring(redisKeyPrefix.length()))
                .sorted()
                .collect(Collectors.toList());
                
        } catch (Exception e) {
            log.error("Error getting sensor IDs: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    // Helper to convert Redis data
    private SensorReading deserializeSensorReading(Object value) throws JsonProcessingException {
        if (value instanceof SensorReading) {
            return (SensorReading) value;
        } else {
            // Convert from JSON string
            return objectMapper.readValue(value.toString(), SensorReading.class);
        }
    }
}
