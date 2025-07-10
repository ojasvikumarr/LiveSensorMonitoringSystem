package com.example.api.integration;

import com.example.api.model.SensorReading;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Simple Integration Tests for API Service
 * These tests demonstrate integration testing suitable for fresher interviews
 * Note: These tests require the full Spring context and may need Redis/Kafka to be mocked or available
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class ApiServiceIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    private String getBaseUrl() {
        return "http://localhost:" + port + "/api/sensors";
    }

    @Test
    void testHealthEndpoint() {
        // Test the health endpoint - this should always work
        ResponseEntity<Map> response = restTemplate.getForEntity(
            getBaseUrl() + "/health", Map.class
        );

        assertEquals(HttpStatus.OK, response.getStatusCode(), "Health endpoint should return OK");
        
        Map<String, Object> body = response.getBody();
        assertNotNull(body, "Health response body should not be null");
        assertEquals("UP", body.get("status"), "Status should be UP");
        assertEquals("api-service", body.get("service"), "Service name should match");
        assertTrue(body.containsKey("timestamp"), "Response should contain timestamp");
        assertTrue(body.containsKey("activeSensors"), "Response should contain active sensors count");
    }

    @Test
    void testGetSensorListEndpoint() {
        // Test the sensor list endpoint
        ResponseEntity<Map> response = restTemplate.getForEntity(
            getBaseUrl() + "/list", Map.class
        );

        assertEquals(HttpStatus.OK, response.getStatusCode(), "Sensor list endpoint should return OK");
        
        Map<String, Object> body = response.getBody();
        assertNotNull(body, "Sensor list response body should not be null");
        assertTrue(body.containsKey("sensorIds"), "Response should contain sensorIds");
        assertTrue(body.containsKey("count"), "Response should contain count");
        assertTrue(body.containsKey("timestamp"), "Response should contain timestamp");
        
        // The count should match the size of sensorIds list
        List<?> sensorIds = (List<?>) body.get("sensorIds");
        Integer count = (Integer) body.get("count");
        assertEquals(sensorIds.size(), count.intValue(), "Count should match sensorIds size");
    }

    @Test
    void testGetAllSensorsEndpoint() {
        // Test the get all sensors endpoint
        ResponseEntity<List> response = restTemplate.getForEntity(
            getBaseUrl() + "/all", List.class
        );

        assertEquals(HttpStatus.OK, response.getStatusCode(), "Get all sensors endpoint should return OK");
        
        List<?> body = response.getBody();
        assertNotNull(body, "Get all sensors response body should not be null");
        
        // Even if no sensors, should return empty list, not null
        assertTrue(body instanceof List, "Response should be a list");
    }

    @Test
    void testGetStatisticsEndpoint() {
        // Test the statistics endpoint
        ResponseEntity<Map> response = restTemplate.getForEntity(
            getBaseUrl() + "/statistics", Map.class
        );

        assertEquals(HttpStatus.OK, response.getStatusCode(), "Statistics endpoint should return OK");
        
        Map<String, Object> body = response.getBody();
        assertNotNull(body, "Statistics response body should not be null");
        
        // Statistics should contain relevant fields (may be empty if no data)
        assertTrue(body instanceof Map, "Response should be a map");
    }

    @Test
    void testSensorExistsEndpoint() {
        // Test sensor exists endpoint with a test sensor ID
        String testSensorId = "999";
        ResponseEntity<Map> response = restTemplate.getForEntity(
            getBaseUrl() + "/exists/" + testSensorId, Map.class
        );

        assertEquals(HttpStatus.OK, response.getStatusCode(), "Sensor exists endpoint should return OK");
        
        Map<String, Object> body = response.getBody();
        assertNotNull(body, "Sensor exists response body should not be null");
        assertEquals(testSensorId, body.get("sensorId"), "Response should contain correct sensor ID");
        assertTrue(body.containsKey("exists"), "Response should contain exists field");
        assertTrue(body.containsKey("timestamp"), "Response should contain timestamp");
        
        // The exists field should be a boolean
        Object exists = body.get("exists");
        assertTrue(exists instanceof Boolean, "Exists field should be boolean");
    }

    @Test
    void testGetLatestSensorReadingNotFound() {
        // Test getting data for a non-existent sensor
        String nonExistentSensorId = "NON_EXISTENT_999";
        ResponseEntity<String> response = restTemplate.getForEntity(
            getBaseUrl() + "/latest?sensorId=" + nonExistentSensorId, String.class
        );

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode(), 
                    "Non-existent sensor should return NOT_FOUND");
    }

    @Test
    void testGetLatestSensorReadingMissingParameter() {
        // Test getting data without sensorId parameter
        ResponseEntity<String> response = restTemplate.getForEntity(
            getBaseUrl() + "/latest", String.class
        );

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode(), 
                    "Missing sensorId parameter should return BAD_REQUEST");
    }

    @Test
    void testBatchEndpointWithEmptyList() {
        // Test batch endpoint with empty sensor ID list
        List<String> emptySensorIds = List.of();
        
        ResponseEntity<Map> response = restTemplate.postForEntity(
            getBaseUrl() + "/batch", emptySensorIds, Map.class
        );

        assertEquals(HttpStatus.OK, response.getStatusCode(), "Batch endpoint should return OK even for empty list");
        
        Map<String, Object> body = response.getBody();
        assertNotNull(body, "Batch response body should not be null");
        assertTrue(body.isEmpty(), "Empty sensor list should return empty response");
    }

    @Test
    void testBatchEndpointWithNonExistentSensors() {
        // Test batch endpoint with non-existent sensor IDs
        List<String> nonExistentSensorIds = List.of("NON_EXIST_1", "NON_EXIST_2");
        
        ResponseEntity<Map> response = restTemplate.postForEntity(
            getBaseUrl() + "/batch", nonExistentSensorIds, Map.class
        );

        assertEquals(HttpStatus.OK, response.getStatusCode(), "Batch endpoint should return OK");
        
        Map<String, Object> body = response.getBody();
        assertNotNull(body, "Batch response body should not be null");
        
        // Response should be empty or contain null values for non-existent sensors
        // The exact behavior depends on the service implementation
        assertTrue(body instanceof Map, "Response should be a map");
    }

    @Test
    void testApiEndpointsReturnValidJsonStructure() {
        // Test that all GET endpoints return valid JSON structures
        String[] endpoints = {"/health", "/list", "/all", "/statistics"};
        
        for (String endpoint : endpoints) {
            ResponseEntity<String> response = restTemplate.getForEntity(
                getBaseUrl() + endpoint, String.class
            );
            
            assertEquals(HttpStatus.OK, response.getStatusCode(), 
                        "Endpoint " + endpoint + " should return OK");
            
            String jsonResponse = response.getBody();
            assertNotNull(jsonResponse, "Response body should not be null for " + endpoint);
            
            // Verify it's valid JSON by parsing it
            assertDoesNotThrow(() -> {
                if (endpoint.equals("/all")) {
                    objectMapper.readValue(jsonResponse, List.class);
                } else {
                    objectMapper.readValue(jsonResponse, Map.class);
                }
            }, "Response should be valid JSON for " + endpoint);
        }
    }

    @Test
    void testResponseTimesAreReasonable() {
        // Test that API responses are reasonably fast (for simple operations)
        long startTime = System.currentTimeMillis();
        
        ResponseEntity<Map> response = restTemplate.getForEntity(
            getBaseUrl() + "/health", Map.class
        );
        
        long endTime = System.currentTimeMillis();
        long responseTime = endTime - startTime;
        
        assertEquals(HttpStatus.OK, response.getStatusCode(), "Health endpoint should return OK");
        assertTrue(responseTime < 5000, "Health endpoint should respond within 5 seconds"); // Very generous for local testing
    }
}
