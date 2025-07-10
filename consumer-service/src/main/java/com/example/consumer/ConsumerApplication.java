package com.example.consumer;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.annotation.EnableKafka;

@SpringBootApplication
@EnableKafka
@Slf4j
public class ConsumerApplication {

    public static void main(String[] args) {
        SpringApplication.run(ConsumerApplication.class, args);
        log.info("Consumer Service started successfully!");
        log.info("Listening for sensor data on Kafka topic: sensor_readings");
        log.info("Storing data in Redis with key pattern: sensor:<sensorId>");
    }
}
