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
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.TextStyle;
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
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime firstDayOfCurrentMonth = now.withDayOfMonth(1).with(LocalTime.MIN);
        LocalDateTime firstDayOfLastMonth = firstDayOfCurrentMonth.minusMonths(1);

        // Total Counts (Real-time)
        long totalUsers = userRepository.count();
        long totalBookings = bookingRepository.count();
        
        // Month-over-Month Comparison
        long usersThisMonth = userRepository.countByCreatedAtBetween(firstDayOfCurrentMonth, now);
        long usersLastMonth = userRepository.countByCreatedAtBetween(firstDayOfLastMonth, firstDayOfCurrentMonth);
        
        long bookingsThisMonth = bookingRepository.countByCreatedAtBetween(firstDayOfCurrentMonth, now);
        long bookingsLastMonth = bookingRepository.countByCreatedAtBetween(firstDayOfLastMonth, firstDayOfCurrentMonth);

        long vendorsThisMonth = userRepository.countByRoleAndCreatedAtBetween("VENDOR", firstDayOfCurrentMonth, now);
        long vendorsLastMonth = userRepository.countByRoleAndCreatedAtBetween("VENDOR", firstDayOfLastMonth, firstDayOfCurrentMonth);

        BigDecimal revenueThisMonth = bookingRepository.sumTotalAmountByStatusAndCreatedAtBetween(firstDayOfCurrentMonth, now);
        BigDecimal revenueLastMonth = bookingRepository.sumTotalAmountByStatusAndCreatedAtBetween(firstDayOfLastMonth, firstDayOfCurrentMonth);

        revenueThisMonth = revenueThisMonth != null ? revenueThisMonth : BigDecimal.ZERO;
        revenueLastMonth = revenueLastMonth != null ? revenueLastMonth : BigDecimal.ZERO;

        Map<String, Object> metrics = new LinkedHashMap<>();
        metrics.put("totalUsers", totalUsers);
        metrics.put("totalUsersChange", calculateTrend(usersThisMonth, usersLastMonth));
        
        metrics.put("totalVendors", userRepository.countByRole("VENDOR"));
        metrics.put("totalVendorsChange", calculateTrend(vendorsThisMonth, vendorsLastMonth));

        metrics.put("totalBookings", totalBookings);
        metrics.put("totalBookingsChange", calculateTrend(bookingsThisMonth, bookingsLastMonth));

        BigDecimal totalRevenue = bookingRepository.sumTotalAmountByStatusAndCreatedAtBetween(LocalDateTime.of(2000, 1, 1, 0, 0), now);
        metrics.put("totalRevenue", totalRevenue != null ? totalRevenue : BigDecimal.ZERO);
        metrics.put("totalRevenueChange", calculateTrend(revenueThisMonth, revenueLastMonth));

        // Other status counts
        metrics.put("pendingBookings", bookingRepository.countByStatus(BookingStatus.PENDING));
        metrics.put("confirmedBookings", bookingRepository.countByStatus(BookingStatus.CONFIRMED));
        metrics.put("completedBookings", bookingRepository.countByStatus(BookingStatus.COMPLETED));

        // Dynamic Chart Data (Last 6 Months)
        List<Map<String, Object>> chartData = new ArrayList<>();
        for (int i = 5; i >= 0; i--) {
            LocalDateTime start = firstDayOfCurrentMonth.minusMonths(i);
            LocalDateTime end = start.plusMonths(1);
            long count = bookingRepository.countByCreatedAtBetween(start, end);
            BigDecimal rev = bookingRepository.sumTotalAmountByStatusAndCreatedAtBetween(start, end);
            rev = rev != null ? rev : BigDecimal.ZERO;
            
            Map<String, Object> dataPoint = new HashMap<>();
            dataPoint.put("name", start.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH));
            dataPoint.put("bookings", count);
            dataPoint.put("revenue", rev);
            chartData.add(dataPoint);
        }

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

    private double calculateTrend(long current, long previous) {
        if (previous == 0) return current > 0 ? 100.0 : 0.0;
        return ((double) (current - previous) / previous) * 100;
    }

    private double calculateTrend(BigDecimal current, BigDecimal previous) {
        if (previous == null || previous.compareTo(BigDecimal.ZERO) == 0) {
            return (current != null && current.compareTo(BigDecimal.ZERO) > 0) ? 100.0 : 0.0;
        }
        return current.subtract(previous)
                .divide(previous, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .doubleValue();
    }

    @Override
    public APIResponse<DashboardMetrics> getManagerMetrics() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime firstDayOfCurrentMonth = now.withDayOfMonth(1).with(LocalTime.MIN);
        LocalDateTime firstDayOfLastMonth = firstDayOfCurrentMonth.minusMonths(1);

        long totalVendors = userRepository.countByRole("VENDOR");
        long totalStaff = userRepository.countByRole("STAFF");
        
        long activeBookings = bookingRepository.countByStatus(BookingStatus.CONFIRMED);
        long pendingBookings = bookingRepository.countByStatus(BookingStatus.PENDING);

        long bookingsThisMonth = bookingRepository.countByCreatedAtBetween(firstDayOfCurrentMonth, now);
        long bookingsLastMonth = bookingRepository.countByCreatedAtBetween(firstDayOfLastMonth, firstDayOfCurrentMonth);

        Map<String, Object> metrics = new LinkedHashMap<>();
        metrics.put("activeBookings", activeBookings);
        metrics.put("pendingBookings", pendingBookings);
        metrics.put("totalVendors", totalVendors);
        metrics.put("totalStaff", totalStaff);
        metrics.put("totalServices", vendorServiceRepository.count());
        metrics.put("bookingsChange", calculateTrend(bookingsThisMonth, bookingsLastMonth));

        List<Map<String, Object>> chartData = new ArrayList<>();
        // Daily chart data for the current week
        for (int i = 6; i >= 0; i--) {
            LocalDateTime dayStart = now.minusDays(i).with(LocalTime.MIN);
            LocalDateTime dayEnd = dayStart.plusDays(1);
            long count = bookingRepository.countByCreatedAtBetween(dayStart, dayEnd);
            chartData.add(Map.of("name", dayStart.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH), "bookings", count));
        }

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

        long upcomingEvents = bookingRepository.countByStatus(BookingStatus.CONFIRMED) + bookingRepository.countByStatus(BookingStatus.PENDING);
        long completedEvents = bookingRepository.countByStatus(BookingStatus.COMPLETED);
        long pendingTasks = bookingRepository.countByStatus(BookingStatus.PENDING);

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
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime firstDayOfCurrentMonth = now.withDayOfMonth(1).with(LocalTime.MIN);
        LocalDateTime firstDayOfLastMonth = firstDayOfCurrentMonth.minusMonths(1);

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

        long bookingsThisMonth = bookingRepository.countByVendorIdAndCreatedAtBetween(vendorId, firstDayOfCurrentMonth, now);
        long bookingsLastMonth = bookingRepository.countByVendorIdAndCreatedAtBetween(vendorId, firstDayOfLastMonth, firstDayOfCurrentMonth);

        BigDecimal earningsThisMonth = allBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED && b.getCreatedAt().isAfter(firstDayOfCurrentMonth))
                .map(b -> b.getTotalAmount() != null ? b.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal earningsLastMonth = allBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED && b.getCreatedAt().isAfter(firstDayOfLastMonth) && b.getCreatedAt().isBefore(firstDayOfCurrentMonth))
                .map(b -> b.getTotalAmount() != null ? b.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> metrics = new LinkedHashMap<>();
        metrics.put("totalServices", allServices.size());
        metrics.put("totalBookings", allBookings.size());
        metrics.put("totalBookingsChange", calculateTrend(bookingsThisMonth, bookingsLastMonth));
        metrics.put("totalEarnings", totalEarnings);
        metrics.put("totalEarningsChange", calculateTrend(earningsThisMonth, earningsLastMonth));
        metrics.put("avgRating", avgRating);
        metrics.put("totalReviews", allReviews.size());

        List<Map<String, Object>> chartData = new ArrayList<>();
        for (int i = 5; i >= 0; i--) {
            LocalDateTime start = firstDayOfCurrentMonth.minusMonths(i);
            LocalDateTime end = start.plusMonths(1);
            long count = allBookings.stream().filter(b -> b.getCreatedAt().isAfter(start) && b.getCreatedAt().isBefore(end)).count();
            BigDecimal rev = allBookings.stream()
                    .filter(b -> b.getStatus() == BookingStatus.COMPLETED && b.getCreatedAt().isAfter(start) && b.getCreatedAt().isBefore(end))
                    .map(b -> b.getTotalAmount() != null ? b.getTotalAmount() : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            chartData.add(Map.of("name", start.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH), "bookings", count, "earnings", rev));
        }

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
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime firstDayOfCurrentMonth = now.withDayOfMonth(1).with(LocalTime.MIN);
        LocalDateTime firstDayOfLastMonth = firstDayOfCurrentMonth.minusMonths(1);

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

        BigDecimal spendingThisMonth = clientBookings.stream()
                .filter(b -> b.getCreatedAt().isAfter(firstDayOfCurrentMonth))
                .map(b -> b.getTotalAmount() != null ? b.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal spendingLastMonth = clientBookings.stream()
                .filter(b -> b.getCreatedAt().isAfter(firstDayOfLastMonth) && b.getCreatedAt().isBefore(firstDayOfCurrentMonth))
                .map(b -> b.getTotalAmount() != null ? b.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> metrics = new LinkedHashMap<>();
        metrics.put("totalBookings", clientBookings.size());
        metrics.put("upcomingEvents", upcomingEvents);
        metrics.put("completedBookings", completedBookings);
        metrics.put("totalSpending", totalSpending);
        metrics.put("spendingChange", calculateTrend(spendingThisMonth, spendingLastMonth));

        List<Map<String, Object>> chartData = Arrays.asList(
                Map.of("name", "Venue", "progress", clientBookings.stream().anyMatch(b -> b.getServiceBookings().stream().anyMatch(sb -> sb.getService().getCategory().equalsIgnoreCase("venue"))) ? 100 : 25),
                Map.of("name", "Catering", "progress", clientBookings.stream().anyMatch(b -> b.getServiceBookings().stream().anyMatch(sb -> sb.getService().getCategory().equalsIgnoreCase("catering"))) ? 100 : 40),
                Map.of("name", "Decor", "progress", clientBookings.stream().anyMatch(b -> b.getServiceBookings().stream().anyMatch(sb -> sb.getService().getCategory().equalsIgnoreCase("decor"))) ? 100 : 15),
                Map.of("name", "Photography", "progress", clientBookings.stream().anyMatch(b -> b.getServiceBookings().stream().anyMatch(sb -> sb.getService().getCategory().equalsIgnoreCase("photography"))) ? 100 : 10)
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
