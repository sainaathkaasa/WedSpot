package com.wedspot.backend.services.implementation;

import com.wedspot.backend.Model.APIResponse;
import com.wedspot.backend.Model.DashboardMetrics;
import com.wedspot.backend.Model.Entity.BookingStatus;
import com.wedspot.backend.repository.IBookingRepository;
import com.wedspot.backend.repository.IUserRepository;
import com.wedspot.backend.repository.IVendorServiceRepository;
import com.wedspot.backend.repository.IReviewRepository;
import com.wedspot.backend.services.IDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
public class DashboardService implements IDashboardService {

    private final IBookingRepository bookingRepository;
    private final IUserRepository userRepository;
    private final IVendorServiceRepository vendorServiceRepository;
    private final IReviewRepository reviewRepository;

    @Override
    public APIResponse<DashboardMetrics> getAdminMetrics() {
        var allBookings = bookingRepository.findAll();
        var allUsers = userRepository.findAll();
        var allServices = vendorServiceRepository.findAll();

        long totalUsers = allUsers.size();
        long totalBookings = allBookings.size();
        long totalVendors = allUsers.stream().filter(u -> "VENDOR".equalsIgnoreCase(u.getRole())).count();
        long totalStaff = allUsers.stream().filter(u -> "STAFF".equalsIgnoreCase(u.getRole())).count();
        long pendingBookings = allBookings.stream().filter(b -> b.getStatus() == BookingStatus.PENDING).count();
        long confirmedBookings = allBookings.stream().filter(b -> b.getStatus() == BookingStatus.CONFIRMED).count();
        long completedBookings = allBookings.stream().filter(b -> b.getStatus() == BookingStatus.COMPLETED).count();

        BigDecimal totalRevenue = allBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .map(b -> b.getTotalAmount() != null ? b.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> metrics = new LinkedHashMap<>();
        metrics.put("totalUsers", totalUsers);
        metrics.put("totalBookings", totalBookings);
        metrics.put("totalVendors", totalVendors);
        metrics.put("totalStaff", totalStaff);
        metrics.put("pendingBookings", pendingBookings);
        metrics.put("confirmedBookings", confirmedBookings);
        metrics.put("completedBookings", completedBookings);
        metrics.put("totalRevenue", totalRevenue);

        List<Map<String, Object>> chartData = Arrays.asList(
                Map.of("name", "Jan", "bookings", 12, "revenue", 45000),
                Map.of("name", "Feb", "bookings", 19, "revenue", 55000),
                Map.of("name", "Mar", "bookings", 15, "revenue", 50000),
                Map.of("name", "Apr", "bookings", 25, "revenue", 75000),
                Map.of("name", "May", "bookings", 22, "revenue", 65000),
                Map.of("name", "Jun", "bookings", 30, "revenue", 85000)
        );

        List<Map<String, Object>> activities = Arrays.asList(
                Map.of("id", "1", "title", "New booking created", "description", "Wedding reception booking", "time", "2 hours ago", "status", "success"),
                Map.of("id", "2", "title", "Vendor added", "description", "New catering vendor registered", "time", "5 hours ago", "status", "info"),
                Map.of("id", "3", "title", "Booking confirmed", "description", "Garden venue booking", "time", "1 day ago", "status", "success")
        );

        DashboardMetrics dashboardMetrics = new DashboardMetrics();
        dashboardMetrics.setMetrics(metrics);
        dashboardMetrics.setChartData(chartData);
        dashboardMetrics.setActivities(activities);

        APIResponse<DashboardMetrics> apiResponse = new APIResponse<>();
        apiResponse.setMessage("Admin dashboard metrics retrieved successfully");
        apiResponse.setData(dashboardMetrics);
        return apiResponse;
    }

    @Override
    public APIResponse<DashboardMetrics> getManagerMetrics() {
        var allBookings = bookingRepository.findAll();
        var allUsers = userRepository.findAll();
        var allServices = vendorServiceRepository.findAll();

        long activeBookings = allBookings.stream().filter(b -> b.getStatus() == BookingStatus.CONFIRMED).count();
        long pendingBookings = allBookings.stream().filter(b -> b.getStatus() == BookingStatus.PENDING).count();
        long totalVendors = allUsers.stream().filter(u -> "VENDOR".equalsIgnoreCase(u.getRole())).count();
        long totalStaff = allUsers.stream().filter(u -> "STAFF".equalsIgnoreCase(u.getRole())).count();

        Map<String, Object> metrics = new LinkedHashMap<>();
        metrics.put("activeBookings", activeBookings);
        metrics.put("pendingBookings", pendingBookings);
        metrics.put("totalVendors", totalVendors);
        metrics.put("totalStaff", totalStaff);
        metrics.put("totalServices", allServices.size());

        List<Map<String, Object>> chartData = Arrays.asList(
                Map.of("name", "Mon", "bookings", 5),
                Map.of("name", "Tue", "bookings", 8),
                Map.of("name", "Wed", "bookings", 6),
                Map.of("name", "Thu", "bookings", 10),
                Map.of("name", "Fri", "bookings", 12),
                Map.of("name", "Sat", "bookings", 15),
                Map.of("name", "Sun", "bookings", 3)
        );

        List<Map<String, Object>> activities = Arrays.asList(
                Map.of("id", "1", "title", "Vendor coordination meeting", "description", "Scheduled with floral vendor", "time", "1 hour ago", "status", "info"),
                Map.of("id", "2", "title", "Booking updated", "description", "Status changed to confirmed", "time", "3 hours ago", "status", "success"),
                Map.of("id", "3", "title", "New staff onboarded", "description", "Event coordinator joined", "time", "1 day ago", "status", "success")
        );

        DashboardMetrics dashboardMetrics = new DashboardMetrics();
        dashboardMetrics.setMetrics(metrics);
        dashboardMetrics.setChartData(chartData);
        dashboardMetrics.setActivities(activities);

        APIResponse<DashboardMetrics> apiResponse = new APIResponse<>();
        apiResponse.setMessage("Manager dashboard metrics retrieved successfully");
        apiResponse.setData(dashboardMetrics);
        return apiResponse;
    }

    @Override
    public APIResponse<DashboardMetrics> getStaffMetrics() {
        var allBookings = bookingRepository.findAll();

        long upcomingEvents = allBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.CONFIRMED || b.getStatus() == BookingStatus.PENDING)
                .count();
        long completedEvents = allBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .count();
        long pendingTasks = allBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.PENDING)
                .count();

        Map<String, Object> metrics = new LinkedHashMap<>();
        metrics.put("upcomingEvents", upcomingEvents);
        metrics.put("completedEvents", completedEvents);
        metrics.put("pendingTasks", pendingTasks);
        metrics.put("totalEvents", allBookings.size());

        List<Map<String, Object>> chartData = Arrays.asList(
                Map.of("name", "Week 1", "completed", 4, "pending", 2),
                Map.of("name", "Week 2", "completed", 6, "pending", 3),
                Map.of("name", "Week 3", "completed", 5, "pending", 1),
                Map.of("name", "Week 4", "completed", 8, "pending", 2)
        );

        List<Map<String, Object>> activities = Arrays.asList(
                Map.of("id", "1", "title", "Task completed", "description", "Venue setup finished", "time", "30 min ago", "status", "success"),
                Map.of("id", "2", "title", "New task assigned", "description", "Decorations for event #45", "time", "2 hours ago", "status", "info"),
                Map.of("id", "3", "title", "Event reminder", "description", "Johnson wedding tomorrow", "time", "5 hours ago", "status", "warning")
        );

        DashboardMetrics dashboardMetrics = new DashboardMetrics();
        dashboardMetrics.setMetrics(metrics);
        dashboardMetrics.setChartData(chartData);
        dashboardMetrics.setActivities(activities);

        APIResponse<DashboardMetrics> apiResponse = new APIResponse<>();
        apiResponse.setMessage("Staff dashboard metrics retrieved successfully");
        apiResponse.setData(dashboardMetrics);
        return apiResponse;
    }

    @Override
    public APIResponse<DashboardMetrics> getVendorMetrics(Long vendorId) {
        var allServices = vendorServiceRepository.findByVendorId(vendorId);
        var allBookings = bookingRepository.findByVendorId(vendorId);
        var allReviews = reviewRepository.findAll().stream()
                .filter(r -> r.getService().getVendor().getId().equals(vendorId))
                .toList();

        double avgRating = allReviews.isEmpty() ? 0.0 :
                allReviews.stream().mapToDouble(r -> r.getRating()).average().orElse(0.0);

        BigDecimal totalEarnings = allBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .map(b -> b.getTotalAmount() != null ? b.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long pendingBookings = allBookings.stream().filter(b -> b.getStatus() == BookingStatus.PENDING).count();
        long confirmedBookings = allBookings.stream().filter(b -> b.getStatus() == BookingStatus.CONFIRMED).count();

        Map<String, Object> metrics = new LinkedHashMap<>();
        metrics.put("totalServices", allServices.size());
        metrics.put("totalBookings", allBookings.size());
        metrics.put("pendingBookings", pendingBookings);
        metrics.put("confirmedBookings", confirmedBookings);
        metrics.put("totalEarnings", totalEarnings);
        metrics.put("avgRating", avgRating);
        metrics.put("totalReviews", allReviews.size());

        List<Map<String, Object>> chartData = Arrays.asList(
                Map.of("name", "Jan", "bookings", 3, "earnings", 12000),
                Map.of("name", "Feb", "bookings", 5, "earnings", 20000),
                Map.of("name", "Mar", "bookings", 4, "earnings", 16000),
                Map.of("name", "Apr", "bookings", 7, "earnings", 28000),
                Map.of("name", "May", "bookings", 6, "earnings", 24000),
                Map.of("name", "Jun", "bookings", 8, "earnings", 32000)
        );

        List<Map<String, Object>> activities = Arrays.asList(
                Map.of("id", "1", "title", "New booking request", "description", "Wedding photography request", "time", "1 hour ago", "status", "info"),
                Map.of("id", "2", "title", "Payment received", "description", "Completed booking payment", "time", "4 hours ago", "status", "success"),
                Map.of("id", "3", "title", "New review", "description", "5-star rating received", "time", "1 day ago", "status", "success")
        );

        DashboardMetrics dashboardMetrics = new DashboardMetrics();
        dashboardMetrics.setMetrics(metrics);
        dashboardMetrics.setChartData(chartData);
        dashboardMetrics.setActivities(activities);

        APIResponse<DashboardMetrics> apiResponse = new APIResponse<>();
        apiResponse.setMessage("Vendor dashboard metrics retrieved successfully");
        apiResponse.setData(dashboardMetrics);
        return apiResponse;
    }

    @Override
    public APIResponse<DashboardMetrics> getClientMetrics(Long clientId) {
        var clientBookings = bookingRepository.findByClientId(clientId);

        long upcomingEvents = clientBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.CONFIRMED || b.getStatus() == BookingStatus.PENDING)
                .count();
        long completedBookings = clientBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .count();

        BigDecimal totalSpending = clientBookings.stream()
                .map(b -> b.getTotalAmount() != null ? b.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> metrics = new LinkedHashMap<>();
        metrics.put("totalBookings", clientBookings.size());
        metrics.put("upcomingEvents", upcomingEvents);
        metrics.put("completedBookings", completedBookings);
        metrics.put("totalSpending", totalSpending);

        List<Map<String, Object>> chartData = Arrays.asList(
                Map.of("name", "Planning", "progress", 75),
                Map.of("name", "Booking", "progress", 60),
                Map.of("name", "Vendor Selection", "progress", 80),
                Map.of("name", "Budget", "progress", 45)
        );

        List<Map<String, Object>> activities = Arrays.asList(
                Map.of("id", "1", "title", "Booking confirmed", "description", "Your floral service booking is confirmed", "time", "2 hours ago", "status", "success"),
                Map.of("id", "2", "title", "New vendor available", "description", "Premium photographer in your area", "time", "1 day ago", "status", "info"),
                Map.of("id", "3", "title", "Reminder", "description", "Event approaching in 2 weeks", "time", "3 days ago", "status", "warning")
        );

        DashboardMetrics dashboardMetrics = new DashboardMetrics();
        dashboardMetrics.setMetrics(metrics);
        dashboardMetrics.setChartData(chartData);
        dashboardMetrics.setActivities(activities);

        APIResponse<DashboardMetrics> apiResponse = new APIResponse<>();
        apiResponse.setMessage("Client dashboard metrics retrieved successfully");
        apiResponse.setData(dashboardMetrics);
        return apiResponse;
    }
}
