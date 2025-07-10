package com.example.producer;

import com.example.producer.service.SensorDataService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.kafka.annotation.EnableKafka;

import jakarta.annotation.PreDestroy;

@SpringBootApplication
@EnableKafka
@Slf4j
public class ProducerApplication {

    @Autowired
    private SensorDataService sensorDataService;

    public static void main(String[] args) {
        SpringApplication.run(ProducerApplication.class, args);
        log.info("Producer Service started successfully!");
    }
    
    @EventListener(ApplicationReadyEvent.class)
    public void startProducer() {
        // Auto-start disabled - use /start endpoint instead
        // sensorDataService.startSimulation();
    }

    @PreDestroy
    public void onShutdown() {
        log.info("Shutting down Producer Service...");
        if (sensorDataService != null) {
            sensorDataService.shutdown();
        }
    }
}
