package com.example.api.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Simple JUnit tests for SensorReading model
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
        assertNotEquals(sensorReading, "not a sensor reading", "Reading should not equal different type");

        // Test hashCode (from Lombok @Data)
        assertEquals(sensorReading.hashCode(), identicalReading.hashCode(), 
                    "Identical readings should have same hash code");
        assertNotEquals(sensorReading.hashCode(), differentReading.hashCode(), 
                       "Different readings should have different hash codes");
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
    void testTemperatureAndPressureValues() {
        // Test with extreme values
        SensorReading extremeReading = new SensorReading();
        
        // Test negative temperature
        extremeReading.setTemperature(-40.0);
        assertEquals(-40.0, extremeReading.getTemperature(), 0.01, "Should handle negative temperature");
        
        // Test high temperature
        extremeReading.setTemperature(100.0);
        assertEquals(100.0, extremeReading.getTemperature(), 0.01, "Should handle high temperature");
        
        // Test zero pressure
        extremeReading.setPressure(0.0);
        assertEquals(0.0, extremeReading.getPressure(), 0.01, "Should handle zero pressure");
        
        // Test high pressure
        extremeReading.setPressure(2000.0);
        assertEquals(2000.0, extremeReading.getPressure(), 0.01, "Should handle high pressure");
    }

    @Test
    void testTimestampHandling() {
        // Test with null timestamp
        SensorReading readingWithNullTimestamp = new SensorReading();
        readingWithNullTimestamp.setTimestamp(null);
        assertNull(readingWithNullTimestamp.getTimestamp(), "Should handle null timestamp");
        
        // Test with past timestamp
        LocalDateTime pastTime = LocalDateTime.of(2020, 1, 1, 0, 0, 0);
        SensorReading readingWithPastTimestamp = new SensorReading();
        readingWithPastTimestamp.setTimestamp(pastTime);
        assertEquals(pastTime, readingWithPastTimestamp.getTimestamp(), "Should handle past timestamp");
        
        // Test with future timestamp
        LocalDateTime futureTime = LocalDateTime.of(2030, 12, 31, 23, 59, 59);
        SensorReading readingWithFutureTimestamp = new SensorReading();
        readingWithFutureTimestamp.setTimestamp(futureTime);
        assertEquals(futureTime, readingWithFutureTimestamp.getTimestamp(), "Should handle future timestamp");
    }
}
