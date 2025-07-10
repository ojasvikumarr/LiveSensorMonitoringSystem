package com.example.consumer.service;

import com.example.consumer.model.SensorReading;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Duration;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Simple JUnit tests for SensorDataConsumer
 * These tests demonstrate basic testing concepts suitable for fresher interviews
 */
@ExtendWith(MockitoExtension.class)
class SensorDataConsumerTest {

    @Mock
    private RedisTemplate<String, Object> redisTemplate;

    @Mock
    private ValueOperations<String, Object> valueOperations;

    @InjectMocks
    private SensorDataConsumer sensorDataConsumer;

    private ObjectMapper objectMapper;
    private String testKeyPrefix = "sensor:data:";

    @BeforeEach
    void setUp() {
        // Set up test properties
        ReflectionTestUtils.setField(sensorDataConsumer, "redisKeyPrefix", testKeyPrefix);
        
        // Mock Redis operations
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        
        // Initialize ObjectMapper for test data
        objectMapper = new ObjectMapper();
    }

    @Test
    void testInitialState() {
        // Test initial state
        assertEquals(0, sensorDataConsumer.getProcessedMessageCount(), 
                    "Processed message count should be 0 initially");
    }

    @Test
    void testConsumeSensorData() throws Exception {
        // Create test sensor reading
        SensorReading testReading = new SensorReading(
            "101", "TEMP_PRESSURE", 25.5, 1013.25, LocalDateTime.now(), "Location-1"
        );
        
        String testMessage = objectMapper.writeValueAsString(testReading);
        String testKey = "101";
        String testTopic = "sensor-data";
        int testPartition = 0;
        long testOffset = 123L;

        // Mock Redis operations
        doNothing().when(valueOperations).set(anyString(), anyString(), any(Duration.class));

        // Call the method
        sensorDataConsumer.consumeSensorData(testMessage, testKey, testTopic, testPartition, testOffset);

        // Verify Redis was called
        verify(valueOperations, times(1)).set(
            eq(testKeyPrefix + "101"),
            anyString(),
            eq(Duration.ofHours(1))
        );

        // Verify message count increased
        assertEquals(1, sensorDataConsumer.getProcessedMessageCount(), 
                    "Processed message count should be 1 after consuming one message");
    }

    @Test
    void testConsumeSensorDataWithInvalidJson() {
        // Test with invalid JSON
        String invalidJson = "{ invalid json }";
        String testKey = "101";
        String testTopic = "sensor-data";
        int testPartition = 0;
        long testOffset = 123L;

        // Call the method with invalid JSON
        sensorDataConsumer.consumeSensorData(invalidJson, testKey, testTopic, testPartition, testOffset);

        // Verify Redis was not called due to JSON parsing error
        verify(valueOperations, never()).set(anyString(), anyString(), any(Duration.class));

        // Message count should still be 0
        assertEquals(0, sensorDataConsumer.getProcessedMessageCount(), 
                    "Processed message count should remain 0 for invalid JSON");
    }

    @Test
    void testGetLatestSensorReadingFound() throws Exception {
        // Create test sensor reading
        SensorReading testReading = new SensorReading(
            "101", "TEMP_PRESSURE", 25.5, 1013.25, LocalDateTime.now(), "Location-1"
        );
        
        String testJson = objectMapper.writeValueAsString(testReading);
        String testSensorId = "101";
        String expectedKey = testKeyPrefix + testSensorId;

        // Mock Redis to return the test data
        when(valueOperations.get(expectedKey)).thenReturn(testJson);

        // Call the method
        SensorReading result = sensorDataConsumer.getLatestSensorReading(testSensorId);

        // Verify result
        assertNotNull(result, "Result should not be null");
        assertEquals(testSensorId, result.getSensorId(), "Sensor ID should match");
        assertEquals(25.5, result.getTemperature(), 0.01, "Temperature should match");
        assertEquals(1013.25, result.getPressure(), 0.01, "Pressure should match");
        assertEquals("Location-1", result.getLocation(), "Location should match");

        // Verify Redis was called
        verify(valueOperations, times(1)).get(expectedKey);
    }

    @Test
    void testGetLatestSensorReadingNotFound() {
        // Test with non-existent sensor
        String testSensorId = "999";
        String expectedKey = testKeyPrefix + testSensorId;

        // Mock Redis to return null
        when(valueOperations.get(expectedKey)).thenReturn(null);

        // Call the method
        SensorReading result = sensorDataConsumer.getLatestSensorReading(testSensorId);

        // Verify result is null
        assertNull(result, "Result should be null for non-existent sensor");

        // Verify Redis was called
        verify(valueOperations, times(1)).get(expectedKey);
    }

    @Test
    void testGetLatestSensorReadingWithSensorReadingObject() {
        // Test when Redis returns a SensorReading object directly
        SensorReading testReading = new SensorReading(
            "101", "TEMP_PRESSURE", 25.5, 1013.25, LocalDateTime.now(), "Location-1"
        );
        
        String testSensorId = "101";
        String expectedKey = testKeyPrefix + testSensorId;

        // Mock Redis to return the SensorReading object directly
        when(valueOperations.get(expectedKey)).thenReturn(testReading);

        // Call the method
        SensorReading result = sensorDataConsumer.getLatestSensorReading(testSensorId);

        // Verify result
        assertNotNull(result, "Result should not be null");
        assertEquals(testSensorId, result.getSensorId(), "Sensor ID should match");
        assertEquals(25.5, result.getTemperature(), 0.01, "Temperature should match");

        // Verify Redis was called
        verify(valueOperations, times(1)).get(expectedKey);
    }

    @Test
    void testSensorExistsTrue() {
        // Test when sensor exists
        String testSensorId = "101";
        String expectedKey = testKeyPrefix + testSensorId;

        // Mock Redis to return true
        when(redisTemplate.hasKey(expectedKey)).thenReturn(true);

        // Call the method
        boolean result = sensorDataConsumer.sensorExists(testSensorId);

        // Verify result
        assertTrue(result, "Sensor should exist");

        // Verify Redis was called
        verify(redisTemplate, times(1)).hasKey(expectedKey);
    }

    @Test
    void testSensorExistsFalse() {
        // Test when sensor doesn't exist
        String testSensorId = "999";
        String expectedKey = testKeyPrefix + testSensorId;

        // Mock Redis to return false
        when(redisTemplate.hasKey(expectedKey)).thenReturn(false);

        // Call the method
        boolean result = sensorDataConsumer.sensorExists(testSensorId);

        // Verify result
        assertFalse(result, "Sensor should not exist");

        // Verify Redis was called
        verify(redisTemplate, times(1)).hasKey(expectedKey);
    }

    @Test
    void testGetProcessedMessageCountAfterMultipleMessages() throws Exception {
        // Create multiple test messages
        SensorReading reading1 = new SensorReading("101", "TEMP_PRESSURE", 25.5, 1013.25, LocalDateTime.now(), "Location-1");
        SensorReading reading2 = new SensorReading("102", "TEMP_PRESSURE", 26.0, 1014.0, LocalDateTime.now(), "Location-2");
        
        String message1 = objectMapper.writeValueAsString(reading1);
        String message2 = objectMapper.writeValueAsString(reading2);

        // Mock Redis operations
        doNothing().when(valueOperations).set(anyString(), anyString(), any(Duration.class));

        // Process multiple messages
        sensorDataConsumer.consumeSensorData(message1, "101", "sensor-data", 0, 123L);
        sensorDataConsumer.consumeSensorData(message2, "102", "sensor-data", 0, 124L);

        // Verify message count
        assertEquals(2, sensorDataConsumer.getProcessedMessageCount(), 
                    "Processed message count should be 2 after processing two messages");
    }
}
