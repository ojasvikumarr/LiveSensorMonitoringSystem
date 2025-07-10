package com.example.producer.service;

import com.example.producer.model.SensorReading;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicLong;

@Service
@Slf4j
public class SensorDataService {

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @Value("${sensor.topic}")
    private String sensorTopic;

    @Value("${sensor.count}")
    private int sensorCount;

    @Value("${sensor.interval}")
    private long sensorInterval;

    private final ObjectMapper objectMapper;
    private final Random random = new Random();
    private ExecutorService executorService;
    
    // Track the running state
    private final AtomicBoolean running = new AtomicBoolean(false);
    // Track number of messages sent
    private final AtomicLong messagesSent = new AtomicLong(0);
    // Track simulation start time
    private Long simulationStartTime;

    public SensorDataService() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    @PostConstruct
    public void initialize() {
        log.info("Sensor data service initialized");
        // Auto-start disabled by default - use /start endpoint instead
        // startSimulation();
    }
    
    public boolean startSimulation() {
        if (running.compareAndSet(false, true)) {
            executorService = Executors.newFixedThreadPool(sensorCount);
            simulationStartTime = System.currentTimeMillis();
            
            for (int i = 1; i <= sensorCount; i++) {
                final int sensorId = 100 + i; // Start from 101, 102, etc.
                executorService.submit(() -> simulateSensor(sensorId));
            }
            
            log.info("Started {} sensor simulation threads", sensorCount);
            return true;
        }
        
        log.info("Sensor simulation already running");
        return false;
    }

    private void simulateSensor(int sensorId) {
        String sensorIdStr = String.valueOf(sensorId);
        String location = "Location-" + (sensorId - 100);
        
        while (!Thread.currentThread().isInterrupted() && running.get()) {
            try {
                // Generate sensor readings with some random variation
                double temperature = 20 + (random.nextGaussian() * 5); 
                double pressure = 1013.25 + (random.nextGaussian() * 100); 
                
                // Keep it to 2 decimal places
                temperature = Math.round(temperature * 100.0) / 100.0;
                pressure = Math.round(pressure * 100.0) / 100.0;
                
                // Store values for callback
                final double finalTemperature = temperature;
                final double finalPressure = pressure;
                
                SensorReading reading = new SensorReading(
                    sensorIdStr,
                    "TEMP_PRESSURE",
                    temperature,
                    pressure,
                    location
                );

                String jsonMessage = objectMapper.writeValueAsString(reading);
                
                // Send to Kafka
                kafkaTemplate.send(sensorTopic, sensorIdStr, jsonMessage)
                    .whenComplete((result, ex) -> {
                        if (ex == null) {
                            log.debug("Sent data for sensor {}: temp={}°C, pressure={}hPa", 
                                      sensorIdStr, finalTemperature, finalPressure);
                            messagesSent.incrementAndGet();
                        } else {
                            log.error("Failed to send data for sensor {}: {}", 
                                     sensorIdStr, ex.getMessage());
                        }
                    });

                Thread.sleep(sensorInterval);
                
            } catch (InterruptedException e) {
                log.info("Sensor {} stopped", sensorIdStr);
                Thread.currentThread().interrupt();
                break;
            } catch (JsonProcessingException e) {
                log.error("Error converting sensor data to JSON for sensor {}: {}", sensorIdStr, e.getMessage());
            } catch (Exception e) {
                log.error("Unexpected error in sensor {} simulation: {}", sensorIdStr, e.getMessage());
            }
        }
    }

    public boolean stopSimulation() {
        if (running.compareAndSet(true, false)) {
            shutdownExecutorService();
            log.info("Stopped sensor simulation");
            return true;
        }
        
        log.info("Sensor simulation is not running");
        return false;
    }
    
    public Map<String, Object> getStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("running", running.get());
        status.put("sensorCount", sensorCount);
        status.put("messagesSent", messagesSent.get());
        
        if (running.get() && simulationStartTime != null) {
            long uptime = System.currentTimeMillis() - simulationStartTime;
            status.put("uptimeMs", uptime);
            status.put("uptimeFormatted", formatUptime(uptime));
        }
        
        return status;
    }
    
    private String formatUptime(long uptimeMs) {
        long seconds = uptimeMs / 1000;
        long minutes = seconds / 60;
        long hours = minutes / 60;
        
        seconds %= 60;
        minutes %= 60;
        
        return String.format("%d:%02d:%02d", hours, minutes, seconds);
    }

    @PreDestroy
    public void shutdown() {
        stopSimulation();
    }
    
    private void shutdownExecutorService() {
        if (executorService != null) {
            executorService.shutdownNow();
            try {
                if (!executorService.awaitTermination(5, TimeUnit.SECONDS)) {
                    log.warn("Executor service did not terminate in the specified time.");
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                log.error("Shutdown interrupted", e);
            }
        }
    }
    
    // Helper methods
    public boolean isRunning() {
        return running.get();
    }
    
    public long getMessagesSent() {
        return messagesSent.get();
    }
    
    public int getSensorCount() {
        return sensorCount;
    }
}
