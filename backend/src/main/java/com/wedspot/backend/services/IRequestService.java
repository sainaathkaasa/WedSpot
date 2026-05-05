package com.wedspot.backend.services;

import com.wedspot.backend.Model.APIResponse;
import com.wedspot.backend.Model.CreateRequest;
import com.wedspot.backend.Model.RequestDTO;

import java.util.List;

public interface IRequestService {
    APIResponse<RequestDTO> createRequest(CreateRequest request);
    APIResponse<RequestDTO> getRequest(Long id);
    APIResponse<List<RequestDTO>> getAllRequests();
    APIResponse<List<RequestDTO>> getClientRequests(Long clientId);
    APIResponse<List<RequestDTO>> getVendorRequests(Long vendorId);
    APIResponse<Void> updateRequestStatus(Long id, String status);
    APIResponse<Void> deleteRequest(Long id);
}
