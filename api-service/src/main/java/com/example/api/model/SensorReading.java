package com.example.api.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SensorReading {
    private String sensorId;
    private String sensorType;
    private double temperature;
    private double pressure;
    private LocalDateTime timestamp;
    private String location;
    
    public SensorReading(String sensorId, String sensorType, double temperature, double pressure, String location) {
        this.sensorId = sensorId;
        this.sensorType = sensorType;
        this.temperature = temperature;
        this.pressure = pressure;
        this.location = location;
        this.timestamp = LocalDateTime.now();
    }
}
