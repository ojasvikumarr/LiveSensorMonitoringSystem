package com.example.api.controller;

import com.example.api.model.SensorReading;
import com.example.api.service.SensorService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.*;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Simple JUnit tests for SensorController
 * These tests demonstrate web layer testing suitable for fresher interviews
 */
@ExtendWith(MockitoExtension.class)
@WebMvcTest(SensorController.class)
class SensorControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SensorService sensorService;

    @Autowired
    private ObjectMapper objectMapper;

    private SensorReading testSensorReading;
    private List<SensorReading> testSensorReadings;
    private Map<String, Object> testStatistics;

    @BeforeEach
    void setUp() {
        // Create test data
        testSensorReading = new SensorReading(
            "101", "TEMP_PRESSURE", 25.5, 1013.25, LocalDateTime.now(), "Location-1"
        );

        testSensorReadings = Arrays.asList(
            testSensorReading,
            new SensorReading("102", "TEMP_PRESSURE", 26.0, 1014.0, LocalDateTime.now(), "Location-2")
        );

        testStatistics = new HashMap<>();
        testStatistics.put("totalSensors", 2);
        testStatistics.put("avgTemperature", 25.75);
        testStatistics.put("avgPressure", 1013.625);
    }

    @Test
    void testGetLatestSensorReadingFound() throws Exception {
        // Mock service to return sensor reading
        when(sensorService.getLatestSensorReading("101")).thenReturn(Optional.of(testSensorReading));

        // Perform GET request
        mockMvc.perform(get("/api/sensors/latest")
                .param("sensorId", "101")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.sensorId").value("101"))
                .andExpect(jsonPath("$.temperature").value(25.5))
                .andExpect(jsonPath("$.pressure").value(1013.25))
                .andExpect(jsonPath("$.location").value("Location-1"));

        // Verify service was called
        verify(sensorService, times(1)).getLatestSensorReading("101");
    }

    @Test
    void testGetLatestSensorReadingNotFound() throws Exception {
        // Mock service to return empty Optional
        when(sensorService.getLatestSensorReading("999")).thenReturn(Optional.empty());

        // Perform GET request
        mockMvc.perform(get("/api/sensors/latest")
                .param("sensorId", "999")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());

        // Verify service was called
        verify(sensorService, times(1)).getLatestSensorReading("999");
    }

    @Test
    void testGetLatestSensorReadingMissingParameter() throws Exception {
        // Perform GET request without sensorId parameter
        mockMvc.perform(get("/api/sensors/latest")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().is4xxClientError()); // Bad request due to missing parameter

        // Verify service was not called
        verify(sensorService, never()).getLatestSensorReading(anyString());
    }

    @Test
    void testGetAllLatestSensorReadings() throws Exception {
        // Mock service to return list of sensor readings
        when(sensorService.getAllLatestSensorReadings()).thenReturn(testSensorReadings);

        // Perform GET request
        mockMvc.perform(get("/api/sensors/all")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].sensorId").value("101"))
                .andExpect(jsonPath("$[1].sensorId").value("102"));

        // Verify service was called
        verify(sensorService, times(1)).getAllLatestSensorReadings();
    }

    @Test
    void testGetSensorReadingsBatch() throws Exception {
        // Create test request body
        List<String> sensorIds = Arrays.asList("101", "102");
        Map<String, SensorReading> expectedResponse = new HashMap<>();
        expectedResponse.put("101", testSensorReading);
        expectedResponse.put("102", testSensorReadings.get(1));

        // Mock service
        when(sensorService.getSensorReadings(sensorIds)).thenReturn(expectedResponse);

        // Perform POST request
        mockMvc.perform(post("/api/sensors/batch")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sensorIds)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.101.sensorId").value("101"))
                .andExpect(jsonPath("$.102.sensorId").value("102"));

        // Verify service was called
        verify(sensorService, times(1)).getSensorReadings(sensorIds);
    }

    @Test
    void testGetSensorStatistics() throws Exception {
        // Mock service to return statistics
        when(sensorService.getSensorStatistics()).thenReturn(testStatistics);

        // Perform GET request
        mockMvc.perform(get("/api/sensors/statistics")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalSensors").value(2))
                .andExpect(jsonPath("$.avgTemperature").value(25.75))
                .andExpect(jsonPath("$.avgPressure").value(1013.625));

        // Verify service was called
        verify(sensorService, times(1)).getSensorStatistics();
    }

    @Test
    void testGetAllSensorIds() throws Exception {
        // Mock service to return sensor IDs
        List<String> sensorIds = Arrays.asList("101", "102", "103");
        when(sensorService.getAllSensorIds()).thenReturn(sensorIds);

        // Perform GET request
        mockMvc.perform(get("/api/sensors/list")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.sensorIds").isArray())
                .andExpect(jsonPath("$.sensorIds.length()").value(3))
                .andExpect(jsonPath("$.count").value(3))
                .andExpect(jsonPath("$.timestamp").exists());

        // Verify service was called
        verify(sensorService, times(1)).getAllSensorIds();
    }

    @Test
    void testHealthEndpoint() throws Exception {
        // Mock service to return sensor IDs for health check
        List<String> sensorIds = Arrays.asList("101", "102");
        when(sensorService.getAllSensorIds()).thenReturn(sensorIds);

        // Perform GET request
        mockMvc.perform(get("/api/sensors/health")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.service").value("api-service"))
                .andExpect(jsonPath("$.activeSensors").value(2))
                .andExpect(jsonPath("$.timestamp").exists());

        // Verify service was called
        verify(sensorService, times(1)).getAllSensorIds();
    }

    @Test
    void testCheckSensorExistsTrue() throws Exception {
        // Mock service to return true
        when(sensorService.sensorExists("101")).thenReturn(true);

        // Perform GET request
        mockMvc.perform(get("/api/sensors/exists/101")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.sensorId").value("101"))
                .andExpect(jsonPath("$.exists").value(true))
                .andExpect(jsonPath("$.timestamp").exists());

        // Verify service was called
        verify(sensorService, times(1)).sensorExists("101");
    }

    @Test
    void testCheckSensorExistsFalse() throws Exception {
        // Mock service to return false
        when(sensorService.sensorExists("999")).thenReturn(false);

        // Perform GET request
        mockMvc.perform(get("/api/sensors/exists/999")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.sensorId").value("999"))
                .andExpect(jsonPath("$.exists").value(false))
                .andExpect(jsonPath("$.timestamp").exists());

        // Verify service was called
        verify(sensorService, times(1)).sensorExists("999");
    }

    @Test
    void testGetAllLatestSensorReadingsEmpty() throws Exception {
        // Mock service to return empty list
        when(sensorService.getAllLatestSensorReadings()).thenReturn(Collections.emptyList());

        // Perform GET request
        mockMvc.perform(get("/api/sensors/all")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(0));

        // Verify service was called
        verify(sensorService, times(1)).getAllLatestSensorReadings();
    }
}
