package com.example.api.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Sensor Monitoring API")
                        .version("1.0")
                        .description("Simple API to get sensor data from Redis"))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8083")
                                .description("Development server"),
                        new Server()
                                .url("http://80.225.196.247:8083")
                                .description("Production server")));
    }
}
