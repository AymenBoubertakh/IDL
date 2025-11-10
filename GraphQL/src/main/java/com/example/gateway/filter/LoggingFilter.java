package com.example.gateway.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Component
public class LoggingFilter extends AbstractGatewayFilterFactory<LoggingFilter.Config> {

    private static final Logger logger = LoggerFactory.getLogger(LoggingFilter.class);
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public LoggingFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            String path = exchange.getRequest().getPath().toString();
            String method = exchange.getRequest().getMethod().toString();
            String timestamp = LocalDateTime.now().format(formatter);
            
            logger.info("📥 [{}] {} {} - Routing request...", 
                timestamp, method, path);
            
            return chain.filter(exchange).then(Mono.fromRunnable(() -> {
                int statusCode = exchange.getResponse().getStatusCode().value();
                logger.info("📤 [{}] {} {} - Response: {}", 
                    timestamp, method, path, statusCode);
            }));
        };
    }

    public static class Config {
        // Configuration properties can be added here if needed
    }
}