package com.example.consumer.service;

import com.example.consumer.model.SensorReading;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.time.Duration;
import java.util.concurrent.atomic.AtomicLong;

@Service
@Slf4j
public class SensorDataConsumer {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Value("${sensor.redis.key-prefix}")
    private String redisKeyPrefix;

    private final ObjectMapper objectMapper;
    private final AtomicLong processedMessages = new AtomicLong(0);

    public SensorDataConsumer() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    @PostConstruct
    public void init() {
        log.info("Sensor Data Consumer initialized with Redis key prefix: {}", redisKeyPrefix);
    }

    @KafkaListener(topics = "${sensor.topic}", groupId = "${spring.kafka.consumer.group-id}")
    public void consumeSensorData(
            @Payload String message,
            @Header(KafkaHeaders.RECEIVED_KEY) String key,
            @Header(KafkaHeaders.RECEIVED_TOPIC) String topic,
            @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
            @Header(KafkaHeaders.OFFSET) long offset) {

        try {
            log.debug("Received message from topic: {}, partition: {}, offset: {}, key: {}", 
                     topic, partition, offset, key);

            // Parse the JSON and store in Redis
            SensorReading sensorReading = objectMapper.readValue(message, SensorReading.class);
            
            String redisKey = redisKeyPrefix + sensorReading.getSensorId();
            
            // Store data in Redis (expires after 1 hour)
            String jsonValue = objectMapper.writeValueAsString(sensorReading);
            redisTemplate.opsForValue().set(redisKey, jsonValue, Duration.ofHours(1));
            
            long messageCount = processedMessages.incrementAndGet();
            
            log.info("Saved sensor data - Key: {}, Sensor: {}, Temp: {}°C, Pressure: {}hPa, Total processed: {}", 
                    redisKey, 
                    sensorReading.getSensorId(), 
                    sensorReading.getTemperature(), 
                    sensorReading.getPressure(),
                    messageCount);

        } catch (JsonProcessingException e) {
            log.error("Error reading JSON: {} - Message: {}", e.getMessage(), message);
        } catch (Exception e) {
            log.error("Error processing message: {} - Message: {}", e.getMessage(), message);
        }
    }

    // Get sensor data from Redis
    public SensorReading getLatestSensorReading(String sensorId) {
        try {
            String redisKey = redisKeyPrefix + sensorId;
            Object value = redisTemplate.opsForValue().get(redisKey);
            
            if (value != null) {
                if (value instanceof SensorReading) {
                    return (SensorReading) value;
                } else {
                    return objectMapper.readValue(value.toString(), SensorReading.class);
                }
            }
            
            return null;
            
        } catch (Exception e) {
            log.error("Error getting sensor data for {}: {}", sensorId, e.getMessage());
            return null;
        }
    }

    public long getProcessedMessageCount() {
        return processedMessages.get();
    }

    public boolean sensorExists(String sensorId) {
        String redisKey = redisKeyPrefix + sensorId;
        return Boolean.TRUE.equals(redisTemplate.hasKey(redisKey));
    }
}
