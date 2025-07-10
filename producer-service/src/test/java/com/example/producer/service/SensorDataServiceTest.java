package com.example.producer.service;

import com.example.producer.model.SensorReading;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Map;
import java.util.concurrent.CompletableFuture;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Simple JUnit tests for SensorDataService
 * These tests demonstrate basic testing concepts suitable for fresher interviews
 */
@ExtendWith(MockitoExtension.class)
class SensorDataServiceTest {

    @Mock
    private KafkaTemplate<String, String> kafkaTemplate;

    @InjectMocks
    private SensorDataService sensorDataService;

    @BeforeEach
    void setUp() {
        // Set up test properties using reflection (simulates @Value injection)
        ReflectionTestUtils.setField(sensorDataService, "sensorTopic", "test-topic");
        ReflectionTestUtils.setField(sensorDataService, "sensorCount", 2);
        ReflectionTestUtils.setField(sensorDataService, "sensorInterval", 100L);
        
        // Mock successful Kafka send
        CompletableFuture<SendResult<String, String>> future = CompletableFuture.completedFuture(null);
        when(kafkaTemplate.send(anyString(), anyString(), anyString())).thenReturn(future);
    }

    @Test
    void testInitialState() {
        // Test initial state of the service
        assertFalse(sensorDataService.isRunning(), "Service should not be running initially");
        assertEquals(0, sensorDataService.getMessagesSent(), "Messages sent should be 0 initially");
        assertEquals(2, sensorDataService.getSensorCount(), "Sensor count should match configured value");
    }

    @Test
    void testStartSimulation() {
        // Test starting the simulation
        boolean result = sensorDataService.startSimulation();
        
        assertTrue(result, "Starting simulation should return true");
        assertTrue(sensorDataService.isRunning(), "Service should be running after start");
        
        // Stop simulation to clean up
        sensorDataService.stopSimulation();
    }

    @Test
    void testStartSimulationWhenAlreadyRunning() {
        // Start simulation first
        sensorDataService.startSimulation();
        
        // Try to start again
        boolean result = sensorDataService.startSimulation();
        
        assertFalse(result, "Starting simulation when already running should return false");
        assertTrue(sensorDataService.isRunning(), "Service should still be running");
        
        // Clean up
        sensorDataService.stopSimulation();
    }

    @Test
    void testStopSimulation() {
        // Start simulation first
        sensorDataService.startSimulation();
        assertTrue(sensorDataService.isRunning(), "Service should be running");
        
        // Stop simulation
        boolean result = sensorDataService.stopSimulation();
        
        assertTrue(result, "Stopping simulation should return true");
        assertFalse(sensorDataService.isRunning(), "Service should not be running after stop");
    }

    @Test
    void testStopSimulationWhenNotRunning() {
        // Make sure service is not running
        assertFalse(sensorDataService.isRunning(), "Service should not be running initially");
        
        // Try to stop
        boolean result = sensorDataService.stopSimulation();
        
        assertFalse(result, "Stopping simulation when not running should return false");
        assertFalse(sensorDataService.isRunning(), "Service should still not be running");
    }

    @Test
    void testGetStatus() {
        // Test status when not running
        Map<String, Object> status = sensorDataService.getStatus();
        
        assertNotNull(status, "Status should not be null");
        assertFalse((Boolean) status.get("running"), "Running should be false");
        assertEquals(2, status.get("sensorCount"), "Sensor count should match");
        assertEquals(0L, status.get("messagesSent"), "Messages sent should be 0");
        assertFalse(status.containsKey("uptimeMs"), "Uptime should not be present when not running");
    }

    @Test
    void testGetStatusWhenRunning() throws InterruptedException {
        // Start simulation
        sensorDataService.startSimulation();
        
        // Wait a bit to ensure simulation is running
        Thread.sleep(50);
        
        Map<String, Object> status = sensorDataService.getStatus();
        
        assertNotNull(status, "Status should not be null");
        assertTrue((Boolean) status.get("running"), "Running should be true");
        assertEquals(2, status.get("sensorCount"), "Sensor count should match");
        assertTrue(status.containsKey("uptimeMs"), "Uptime should be present when running");
        assertTrue(status.containsKey("uptimeFormatted"), "Formatted uptime should be present");
        
        // Clean up
        sensorDataService.stopSimulation();
    }

    @Test
    void testShutdown() {
        // Start simulation
        sensorDataService.startSimulation();
        assertTrue(sensorDataService.isRunning(), "Service should be running");
        
        // Call shutdown
        sensorDataService.shutdown();
        
        assertFalse(sensorDataService.isRunning(), "Service should not be running after shutdown");
    }

    @Test
    void testHelperMethods() {
        // Test getter methods
        assertEquals(2, sensorDataService.getSensorCount(), "getSensorCount should return correct value");
        assertEquals(0, sensorDataService.getMessagesSent(), "getMessagesSent should return 0 initially");
        assertFalse(sensorDataService.isRunning(), "isRunning should return false initially");
    }
}
