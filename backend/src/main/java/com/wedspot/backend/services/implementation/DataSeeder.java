package com.wedspot.backend.services.implementation;

import org.jspecify.annotations.NonNull;
import tools.jackson.databind.ObjectMapper;
import com.wedspot.backend.Model.Entity.*;
import com.wedspot.backend.Model.VendorServiceRequest;
import com.wedspot.backend.mappers.IVendorServiceMapper;
import com.wedspot.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import tools.jackson.core.type.TypeReference;

import java.io.InputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final PasswordEncoder passwordEncoder;
    private final IAuthRepository authRepository;
    private final IVendorServiceRepository serviceRepository;
    private final IReviewRepository reviewRepository;
    private final IRequestRepository requestRepository;
    private final IBillRepository billRepository;
    private final IInventoryRepository inventoryRepository;
    private final ITaskRepository taskRepository;

    private final IVendorServiceMapper vendorServiceMapper;
    private final ObjectMapper objectMapper;

    @Override
    public void run(String @NonNull ... args) {
        SeedUsers();
        seedServices();
        seedReviews();
        seedRequests();
        seedBills();
        seedInventory();
        seedTasks();
    }

    public void SeedUsers() {
        String defaultPassword = passwordEncoder.encode("1234567890");
        String defaultPhone = "1234567890";

        seedIfNotExists(createUser("Admin Kumar", "admin@gmail.com", defaultPassword, "Admin", defaultPhone));

        List<String[]> roles = Arrays.asList(
                new String[] { "Manager", "manager" },
                new String[] { "Staff", "staff" },
                new String[] { "Vendor", "vendor" },
                new String[] { "Client", "client" });

        for (String[] roleEntry : roles) {
            String roleName = roleEntry[0];
            String roleKey = roleEntry[1];

            for (int i = 1; i <= 5; i++) {
                String name = roleName + " " + i;
                String email = roleKey + i + "@gmail.com";
                seedIfNotExists(createUser(name, email, defaultPassword, roleName, defaultPhone));
            }
        }
    }

    private void seedServices() {
        try {
            InputStream inputStream = getClass().getResourceAsStream("/services.json");
            if (inputStream == null) {
                log.warn("Cannot read services.json from resources.");
                return;
            }

            List<VendorServiceRequest> requests = objectMapper.readValue(inputStream,
                    new TypeReference<>() {});

            int totalServices = 0;
            Optional<User> vendor = authRepository.findByEmail("vendor1@gmail.com");

            if (vendor.isPresent()) {
                for (VendorServiceRequest request : requests) {
                    if (serviceRepository.existsByNameAndVendor(request.getName(), vendor.get())) {
                        continue;
                    }

                    VendorService entity = vendorServiceMapper.toEntity(request);
                    entity.setVendor(vendor.get());
                    serviceRepository.save(entity);
                    totalServices++;
                }
            }

            log.info("Successfully seeded {} services from JSON.", totalServices);
        } catch (Exception e) {
            log.error("Failed to seed services: {} ", e.getMessage());
        }
    }

    private void seedReviews() {
        try {
            if (reviewRepository.count() > 0) {
                log.info("Reviews already exist, skipping seed.");
                return;
            }

            Optional<User> reviewer = authRepository.findByEmail("client1@gmail.com");
            List<VendorService> services = serviceRepository.findAll();

            if (reviewer.isPresent() && !services.isEmpty()) {
                String[] comments = {
                        "Absolutely amazing service! Exceeded all expectations.",
                        "Professional and creative. Would highly recommend!",
                        "Outstanding quality and attention to detail.",
                        "The team was wonderful to work with. Perfect results!",
                        "Best decision we made for our wedding. Truly unforgettable!",
                        "Incredible attention to detail. Everything was flawless!"
                };

                for (int i = 0; i < Math.min(6, services.size()); i++) {
                    Review review = new Review();
                    review.setService(services.get(i));
                    review.setReviewer(reviewer.get());
                    review.setRating(4.5 + (Math.random() * 0.5));
                    review.setComment(comments[i]);
                    reviewRepository.save(review);
                }

                log.info("Successfully seeded reviews.");
            }
        } catch (Exception e) {
            log.error("Failed to seed reviews: {}", e.getMessage());
        }
    }

    private void seedRequests() {
        try {
            if (requestRepository.count() > 0) {
                log.info("Requests already exist, skipping seed.");
                return;
            }

            InputStream inputStream = getClass().getResourceAsStream("/requests.json");
            if (inputStream == null) return;

            List<Map<String, String>> requests = objectMapper.readValue(inputStream,
                    new TypeReference<>() {});

            Optional<User> client = authRepository.findByEmail("client1@gmail.com");

            if (client.isPresent()) {
                for (Map<String, String> req : requests) {
                    Request request = new Request();
                    request.setSubject(req.get("subject"));
                    request.setDescription(req.get("description"));
                    request.setCategory(req.get("category"));
                    request.setType(req.get("type"));
                    request.setStatus(req.get("status"));
                    request.setClient(client.get());
                    requestRepository.save(request);
                }
                log.info("Successfully seeded {} requests.", requests.size());
            }
        } catch (Exception e) {
            log.error("Failed to seed requests: {}", e.getMessage());
        }
    }

    private void seedBills() {
        try {
            if (billRepository.count() > 0) {
                log.info("Bills already exist, skipping seed.");
                return;
            }

            InputStream inputStream = getClass().getResourceAsStream("/bills.json");
            if (inputStream == null) return;

            List<Map<String, Object>> bills = objectMapper.readValue(inputStream,
                    new TypeReference<>() {});

            for (Map<String, Object> billData : bills) {
                String clientEmail = (String) billData.get("clientEmail");
                Optional<User> client = authRepository.findByEmail(clientEmail);

                if (client.isPresent()) {
                    Bill bill = new Bill();
                    bill.setInvoiceNumber((String) billData.get("invoiceNumber"));
                    bill.setClient(client.get());
                    bill.setAmount(new BigDecimal(billData.get("amount").toString()));
                    bill.setDate(LocalDate.parse((String) billData.get("date")));
                    bill.setStatus((String) billData.get("status"));
                    billRepository.save(bill);
                }
            }

            log.info("Successfully seeded bills.");
        } catch (Exception e) {
            log.error("Failed to seed bills: {}", e.getMessage());
        }
    }

    private void seedInventory() {
        try {
            if (inventoryRepository.count() > 0) {
                log.info("Inventory already exists, skipping seed.");
                return;
            }

            InputStream inputStream = getClass().getResourceAsStream("/inventory.json");
            if (inputStream == null) return;

            List<Map<String, Object>> items = objectMapper.readValue(inputStream,
                    new TypeReference<>() {
                    });

            for (Map<String, Object> itemData : items) {
                Inventory item = new Inventory();
                item.setName((String) itemData.get("name"));
                item.setCategory((String) itemData.get("category"));
                item.setStock((Integer) itemData.get("stock"));
                item.setUnit((String) itemData.get("unit"));
                int stock = item.getStock();
                item.setStatus(stock == 0 ? "out" : stock < 20 ? "low" : "available");
                item.setLastUpdated(LocalDateTime.now());
                inventoryRepository.save(item);
            }

            log.info("Successfully seeded {} inventory items.", items.size());
        } catch (Exception e) {
            log.error("Failed to seed inventory: {}", e.getMessage());
        }
    }

    private void seedTasks() {
        try {
            if (taskRepository.count() > 0) {
                log.info("Tasks already exist, skipping seed.");
                return;
            }

            InputStream inputStream = getClass().getResourceAsStream("/tasks.json");
            if (inputStream == null) return;

            List<Map<String, Object>> tasks = objectMapper.readValue(inputStream,
                    new TypeReference<>() {});

            Optional<User> staff = authRepository.findByEmail("staff1@gmail.com");

            for (Map<String, Object> taskData : tasks) {
                Task task = new Task();
                task.setText((String) taskData.get("text"));
                task.setPriority((String) taskData.get("priority"));
                task.setDueDate(LocalDate.parse((String) taskData.get("dueDate")));
                task.setCategory((String) taskData.get("category"));
                task.setPoints((Integer) taskData.get("points"));
                task.setCompleted((Boolean) taskData.get("completed"));
                staff.ifPresent(task::setAssignedTo);
                taskRepository.save(task);
            }

            log.info("Successfully seeded {} tasks.", tasks.size());
        } catch (Exception e) {
            log.error("Failed to seed tasks: {}", e.getMessage());
        }
    }

    private void seedIfNotExists(User user) {
        authRepository.findByEmail(user.getEmail())
                .ifPresentOrElse(
                        existing -> log.debug("User already exists: {}", existing.getEmail()),
                        () -> {
                            authRepository.save(user);
                            log.info("Seeded user: {}", user.getEmail());
                        });
    }

    private User createUser(String name, String email, String password, String role, String phone) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(password);
        user.setRole(role);
        user.setPhoneNumber(phone);
        user.setAddress("India");
        user.setEnabled(true);
        return user;
    }
}
