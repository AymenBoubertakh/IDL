package com.example.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ApiGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
        System.out.println("\n" + "=".repeat(60));
        System.out.println("🚀 API GATEWAY STARTED SUCCESSFULLY!");
        System.out.println("=".repeat(60));
        System.out.println("📍 Gateway URL: http://localhost:9090");
        System.out.println("📊 Health Check: http://localhost:9090/actuator/health");
        System.out.println("=".repeat(60));
        System.out.println("\n📋 AVAILABLE ROUTES:");
        System.out.println("   🎓 Student Service:  http://localhost:9090/api/students");
        System.out.println("   🏛️  University:       http://localhost:9090/api/universities");
        System.out.println("   📚 Course Service:   http://localhost:9090/api/courses");
        System.out.println("   📝 Enrollments:      http://localhost:9090/api/enrollments");
        System.out.println("   🤖 Chatbot (Trans):  http://localhost:9090/api/translate");
        System.out.println("   📄 Chatbot (Summ):   http://localhost:9090/api/summarize");
        System.out.println("   🌍 Languages:        http://localhost:9090/api/languages");
        System.out.println("=".repeat(60) + "\n");
    }

}