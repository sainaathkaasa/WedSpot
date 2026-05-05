package com.wedspot.backend.services;

import com.wedspot.backend.Model.APIResponse;
import com.wedspot.backend.Model.DashboardMetrics;

public interface IDashboardService {
    APIResponse<DashboardMetrics> getAdminMetrics();
    APIResponse<DashboardMetrics> getManagerMetrics();
    APIResponse<DashboardMetrics> getStaffMetrics();
    APIResponse<DashboardMetrics> getVendorMetrics(Long vendorId);
    APIResponse<DashboardMetrics> getClientMetrics(Long clientId);
}
