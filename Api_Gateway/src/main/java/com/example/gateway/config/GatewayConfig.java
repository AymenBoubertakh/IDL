package com.example.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    /**
     * Additional route configurations can be added here if needed
     * Routes are primarily configured in application.yml
     */
    
    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                // Health check route for gateway itself
                .route("gateway-health", r -> r
                        .path("/health")
                        .uri("forward:/actuator/health"))
                .build();
    }
}