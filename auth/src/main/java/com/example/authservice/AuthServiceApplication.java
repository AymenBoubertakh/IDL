package com.example.authservice;

import com.example.authservice.model.Role;
import com.example.authservice.model.User;
import com.example.authservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class AuthServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuthServiceApplication.class, args);
        System.out.println("\n" + "=".repeat(70));
        System.out.println("🔐 AUTH SERVICE STARTED SUCCESSFULLY!");
        System.out.println("=".repeat(70));
        System.out.println("📍 Auth Service:      http://localhost:8082");
        System.out.println("📍 Health Check:      http://localhost:8082/api/auth/health");
        System.out.println("=".repeat(70));
        System.out.println("\n📋 AVAILABLE ENDPOINTS:");
        System.out.println("   POST /api/auth/register  - Register new user");
        System.out.println("   POST /api/auth/login     - Login and get JWT token");
        System.out.println("   GET  /api/auth/me        - Get current user info");
        System.out.println("   POST /api/auth/logout    - Logout");
        System.out.println("=".repeat(70));
        System.out.println("\n👤 DEFAULT ADMIN ACCOUNT:");
        System.out.println("   Username: aymen");
        System.out.println("   Password: root");
        System.out.println("   Role: ADMIN");
        System.out.println("=".repeat(70) + "\n");
    }

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Create default admin if not exists
            if (!userRepository.existsByUsername("aymen")) {
                User admin = new User();
                admin.setUsername("aymen");
                admin.setEmail("aymen@campus.com");
                admin.setPassword(passwordEncoder.encode("root"));
                admin.setFirstName("Aymen");
                admin.setLastName("Boubertakh");
                admin.setRole(Role.ADMIN);
                admin.setEnabled(true);
                
                userRepository.save(admin);
                System.out.println("✅ Default admin user created: aymen/root");
            }
        };
    }
}