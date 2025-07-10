package com.example.consumer.controller;

import com.example.consumer.service.SensorDataConsumer;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/health")
@Slf4j
public class HealthController {

    @Autowired
    private SensorDataConsumer sensorDataConsumer;

    @GetMapping
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("service", "consumer-service");
        health.put("messagesProcessed", sensorDataConsumer.getProcessedMessageCount());
        health.put("timestamp", System.currentTimeMillis());
        
        log.debug("Health check requested - Messages processed: {}", 
                 sensorDataConsumer.getProcessedMessageCount());
        
        return ResponseEntity.ok(health);
    }
}
