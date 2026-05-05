package com.wedspot.backend.controller;

import com.wedspot.backend.Model.APIResponse;
import com.wedspot.backend.Model.DashboardMetrics;
import com.wedspot.backend.services.IDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final IDashboardService dashboardService;

    @GetMapping("/admin")
    public ResponseEntity<APIResponse<DashboardMetrics>> getAdminMetrics() {
        APIResponse<DashboardMetrics> response = dashboardService.getAdminMetrics();
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/manager")
    public ResponseEntity<APIResponse<DashboardMetrics>> getManagerMetrics() {
        APIResponse<DashboardMetrics> response = dashboardService.getManagerMetrics();
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/staff")
    public ResponseEntity<APIResponse<DashboardMetrics>> getStaffMetrics() {
        APIResponse<DashboardMetrics> response = dashboardService.getStaffMetrics();
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/vendor")
    public ResponseEntity<APIResponse<DashboardMetrics>> getVendorMetrics(@RequestParam Long vendorId) {
        APIResponse<DashboardMetrics> response = dashboardService.getVendorMetrics(vendorId);
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/client")
    public ResponseEntity<APIResponse<DashboardMetrics>> getClientMetrics(@RequestParam Long clientId) {
        APIResponse<DashboardMetrics> response = dashboardService.getClientMetrics(clientId);
        return ResponseEntity.ok().body(response);
    }
}
