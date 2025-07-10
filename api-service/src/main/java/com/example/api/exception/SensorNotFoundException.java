package com.example.api.exception;

/**
 * Custom exception for when a sensor is not found
 * Simple exception class suitable for fresher interviews
 */
public class SensorNotFoundException extends RuntimeException {
    
    public SensorNotFoundException(String message) {
        super(message);
    }
    
    public SensorNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public static SensorNotFoundException forSensorId(String sensorId) {
        return new SensorNotFoundException("Sensor not found with ID: " + sensorId);
    }
}
