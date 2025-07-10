package com.example.producer.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Simple JUnit tests for Producer SensorReading model
 * These tests demonstrate basic POJO testing suitable for fresher interviews
 */
class SensorReadingTest {

    private SensorReading sensorReading;
    private LocalDateTime testTimestamp;

    @BeforeEach
    void setUp() {
        testTimestamp = LocalDateTime.of(2024, 6, 23, 10, 30, 0);
        sensorReading = new SensorReading(
            "101", "TEMP_PRESSURE", 25.5, 1013.25, testTimestamp, "Location-1"
        );
    }

    @Test
    void testConstructorWithAllParameters() {
        // Test full constructor
        SensorReading reading = new SensorReading(
            "102", "TEMP_PRESSURE", 26.0, 1014.0, testTimestamp, "Location-2"
        );

        assertEquals("102", reading.getSensorId(), "Sensor ID should match");
        assertEquals("TEMP_PRESSURE", reading.getSensorType(), "Sensor type should match");
        assertEquals(26.0, reading.getTemperature(), 0.01, "Temperature should match");
        assertEquals(1014.0, reading.getPressure(), 0.01, "Pressure should match");
        assertEquals(testTimestamp, reading.getTimestamp(), "Timestamp should match");
        assertEquals("Location-2", reading.getLocation(), "Location should match");
    }

    @Test
    void testConstructorWithoutTimestamp() {
        // Test constructor that sets timestamp automatically
        LocalDateTime beforeCreation = LocalDateTime.now();
        
        SensorReading reading = new SensorReading(
            "103", "TEMP_PRESSURE", 27.0, 1015.0, "Location-3"
        );
        
        LocalDateTime afterCreation = LocalDateTime.now();

        assertEquals("103", reading.getSensorId(), "Sensor ID should match");
        assertEquals("TEMP_PRESSURE", reading.getSensorType(), "Sensor type should match");
        assertEquals(27.0, reading.getTemperature(), 0.01, "Temperature should match");
        assertEquals(1015.0, reading.getPressure(), 0.01, "Pressure should match");
        assertEquals("Location-3", reading.getLocation(), "Location should match");
        
        // Timestamp should be set automatically between before and after creation
        assertNotNull(reading.getTimestamp(), "Timestamp should not be null");
        assertTrue(reading.getTimestamp().isAfter(beforeCreation.minusSeconds(1)), 
                  "Timestamp should be after creation start");
        assertTrue(reading.getTimestamp().isBefore(afterCreation.plusSeconds(1)), 
                  "Timestamp should be before creation end");
    }

    @Test
    void testNoArgsConstructor() {
        // Test no-args constructor (from Lombok @NoArgsConstructor)
        SensorReading reading = new SensorReading();
        
        assertNull(reading.getSensorId(), "Sensor ID should be null initially");
        assertNull(reading.getSensorType(), "Sensor type should be null initially");
        assertEquals(0.0, reading.getTemperature(), "Temperature should be 0.0 initially");
        assertEquals(0.0, reading.getPressure(), "Pressure should be 0.0 initially");
        assertNull(reading.getTimestamp(), "Timestamp should be null initially");
        assertNull(reading.getLocation(), "Location should be null initially");
    }

    @Test
    void testGettersAndSetters() {
        // Test all getters return correct values
        assertEquals("101", sensorReading.getSensorId());
        assertEquals("TEMP_PRESSURE", sensorReading.getSensorType());
        assertEquals(25.5, sensorReading.getTemperature(), 0.01);
        assertEquals(1013.25, sensorReading.getPressure(), 0.01);
        assertEquals(testTimestamp, sensorReading.getTimestamp());
        assertEquals("Location-1", sensorReading.getLocation());

        // Test setters
        sensorReading.setSensorId("999");
        sensorReading.setSensorType("HUMIDITY");
        sensorReading.setTemperature(30.0);
        sensorReading.setPressure(1020.0);
        LocalDateTime newTimestamp = LocalDateTime.now();
        sensorReading.setTimestamp(newTimestamp);
        sensorReading.setLocation("New-Location");

        // Verify setters worked
        assertEquals("999", sensorReading.getSensorId());
        assertEquals("HUMIDITY", sensorReading.getSensorType());
        assertEquals(30.0, sensorReading.getTemperature(), 0.01);
        assertEquals(1020.0, sensorReading.getPressure(), 0.01);
        assertEquals(newTimestamp, sensorReading.getTimestamp());
        assertEquals("New-Location", sensorReading.getLocation());
    }

    @Test
    void testEqualsAndHashCode() {
        // Create identical sensor reading
        SensorReading identicalReading = new SensorReading(
            "101", "TEMP_PRESSURE", 25.5, 1013.25, testTimestamp, "Location-1"
        );

        // Create different sensor reading
        SensorReading differentReading = new SensorReading(
            "102", "TEMP_PRESSURE", 26.0, 1014.0, testTimestamp, "Location-2"
        );

        // Test equals (from Lombok @Data)
        assertEquals(sensorReading, identicalReading, "Identical readings should be equal");
        assertNotEquals(sensorReading, differentReading, "Different readings should not be equal");
        assertNotEquals(sensorReading, null, "Reading should not equal null");
        assertEquals(sensorReading, sensorReading, "Reading should equal itself");

        // Test hashCode (from Lombok @Data)
        assertEquals(sensorReading.hashCode(), identicalReading.hashCode(), 
                    "Identical readings should have same hash code");
    }

    @Test
    void testToString() {
        // Test toString (from Lombok @Data)
        String toString = sensorReading.toString();
        
        assertNotNull(toString, "toString should not be null");
        assertTrue(toString.contains("101"), "toString should contain sensor ID");
        assertTrue(toString.contains("TEMP_PRESSURE"), "toString should contain sensor type");
        assertTrue(toString.contains("25.5"), "toString should contain temperature");
        assertTrue(toString.contains("1013.25"), "toString should contain pressure");
        assertTrue(toString.contains("Location-1"), "toString should contain location");
    }

    @Test
    void testSensorDataVariations() {
        // Test with different sensor types
        SensorReading humidityReading = new SensorReading(
            "201", "HUMIDITY", 0.0, 65.5, "Indoor"
        );
        
        assertEquals("HUMIDITY", humidityReading.getSensorType(), "Should handle different sensor types");
        assertEquals(65.5, humidityReading.getPressure(), 0.01, "Should store humidity in pressure field");

        // Test with long sensor IDs
        SensorReading longIdReading = new SensorReading(
            "SENSOR_12345_TEMP_001", "TEMP_PRESSURE", 22.3, 1010.5, "Warehouse-A-Section-3"
        );
        
        assertEquals("SENSOR_12345_TEMP_001", longIdReading.getSensorId(), "Should handle long sensor IDs");
        assertEquals("Warehouse-A-Section-3", longIdReading.getLocation(), "Should handle descriptive locations");
    }

    @Test
    void testBoundaryValues() {
        SensorReading boundaryReading = new SensorReading();
        
        // Test with extreme temperature values
        boundaryReading.setTemperature(Double.MAX_VALUE);
        assertEquals(Double.MAX_VALUE, boundaryReading.getTemperature(), "Should handle maximum double value");
        
        boundaryReading.setTemperature(Double.MIN_VALUE);
        assertEquals(Double.MIN_VALUE, boundaryReading.getTemperature(), "Should handle minimum double value");
        
        // Test with extreme pressure values
        boundaryReading.setPressure(Double.MAX_VALUE);
        assertEquals(Double.MAX_VALUE, boundaryReading.getPressure(), "Should handle maximum pressure");
        
        boundaryReading.setPressure(0.0);
        assertEquals(0.0, boundaryReading.getPressure(), "Should handle zero pressure");
    }
}
