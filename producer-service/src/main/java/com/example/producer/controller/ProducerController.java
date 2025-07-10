package com.example.producer.controller;

import com.example.producer.service.SensorDataService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/producer")
@RequiredArgsConstructor
@Slf4j
public class ProducerController {

    private final SensorDataService sensorDataService;

    @PostMapping("/start")
    public ResponseEntity<Map<String, Object>> startProducer() {
        log.info("Starting sensor data production");
        boolean started = sensorDataService.startSimulation();
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", started ? "STARTED" : "ALREADY_RUNNING");
        response.put("message", started ? "Started successfully" : "Already running");
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/stop")
    public ResponseEntity<Map<String, Object>> stopProducer() {
        log.info("Stopping sensor data production");
        boolean stopped = sensorDataService.stopSimulation();
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", stopped ? "STOPPED" : "ALREADY_STOPPED");
        response.put("message", stopped ? "Stopped successfully" : "Already stopped");
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        return ResponseEntity.ok(sensorDataService.getStatus());
    }
}
