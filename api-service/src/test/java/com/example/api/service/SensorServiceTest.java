package com.example.api.service;

import com.example.api.model.SensorReading;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * simple tests for the sensor service
 * basic tests to check key things:
 * - key generation works right
 * - handles nonexistent data ok
 * - retrieves actual sensor data
 */
@ExtendWith(MockitoExtension.class)
class SensorServiceTest {

    @Mock
    private RedisTemplate<String, Object> redisTemplate;

    @Mock
    private ValueOperations<String, Object> valueOperations;

    @InjectMocks
    private SensorService sensorService;

    @BeforeEach
    void setUp() {
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        
        // inject the key prefix
        ReflectionTestUtils.setField(sensorService, "redisKeyPrefix", "sensor:");
    }

    @Test
    void check_key_generation() {
        // setup
        String sensorId = "101";
        String expectedKey = "sensor:101";
        
        // do it
        sensorService.getLatestSensorReading(sensorId);
        
        // check results
        verify(valueOperations).get(expectedKey);
        
        // try the other method too
        sensorService.sensorExists(sensorId);
        verify(redisTemplate).hasKey(expectedKey);
    }

    @Test
    void no_data_for_sensor999() {
        // setup stuff
        String nonExistentSensorId = "999";
        when(valueOperations.get("sensor:" + nonExistentSensorId)).thenReturn(null);

        // call the method
        Optional<SensorReading> result = sensorService.getLatestSensorReading(nonExistentSensorId);

        // make sure it's empty
        assertFalse(result.isPresent());
        verify(valueOperations).get("sensor:" + nonExistentSensorId);
    }

    @Test
    void get_sensor101_data() {
        // prep test data
        String sensorId = "101";
        SensorReading expectedReading = new SensorReading(
            sensorId, 
            "TEMP_PRESSURE", 
            25.5, 
            1013.25, 
            LocalDateTime.now(),
            "Location-1"
        );
        
        when(valueOperations.get("sensor:" + sensorId))
            .thenReturn(expectedReading);

        // run the test
        Optional<SensorReading> result = sensorService.getLatestSensorReading(sensorId);

        // verify it works
        assertTrue(result.isPresent());
        assertEquals(expectedReading.getSensorId(), result.get().getSensorId());
        assertEquals(expectedReading.getTemperature(), result.get().getTemperature());
        assertEquals(expectedReading.getPressure(), result.get().getPressure());
        verify(valueOperations).get("sensor:" + sensorId);
    }
}
