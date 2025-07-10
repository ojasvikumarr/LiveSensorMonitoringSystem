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
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

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
        
        // Set the Redis key prefix using reflection (simulates @Value injection)
        ReflectionTestUtils.setField(sensorService, "redisKeyPrefix", "sensor:");
    }

    @Test
    void getLatestSensorReading_Success() {
        // Given
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

        // When
        Optional<SensorReading> result = sensorService.getLatestSensorReading(sensorId);

        // Then
        assertTrue(result.isPresent());
        assertEquals(expectedReading.getSensorId(), result.get().getSensorId());
        assertEquals(expectedReading.getTemperature(), result.get().getTemperature());
        verify(valueOperations).get("sensor:" + sensorId);
    }

    @Test
    void getLatestSensorReading_NotFound() {
        // Given
        String sensorId = "999";
        when(valueOperations.get("sensor:" + sensorId)).thenReturn(null);

        // When
        Optional<SensorReading> result = sensorService.getLatestSensorReading(sensorId);

        // Then
        assertFalse(result.isPresent());
        verify(valueOperations).get("sensor:" + sensorId);
    }

    @Test
    void sensorExists_True() {
        // Given
        String sensorId = "101";
        when(redisTemplate.hasKey("sensor:" + sensorId)).thenReturn(true);

        // When
        boolean result = sensorService.sensorExists(sensorId);

        // Then
        assertTrue(result);
        verify(redisTemplate).hasKey("sensor:" + sensorId);
    }
}
