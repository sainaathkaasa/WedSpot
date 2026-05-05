package com.wedspot.backend.controller;

import com.wedspot.backend.Model.APIResponse;
import com.wedspot.backend.Model.CreateRequest;
import com.wedspot.backend.Model.RequestDTO;
import com.wedspot.backend.services.IRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/requests")
@RequiredArgsConstructor
public class RequestController {

    private final IRequestService requestService;

    @PostMapping
    public ResponseEntity<APIResponse<RequestDTO>> createRequest(@RequestBody @Valid CreateRequest request) {
        APIResponse<RequestDTO> response = requestService.createRequest(request);
        return ResponseEntity.status(201).body(response);
    }

    @GetMapping
    public ResponseEntity<APIResponse<List<RequestDTO>>> getAllRequests() {
        APIResponse<List<RequestDTO>> response = requestService.getAllRequests();
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<APIResponse<RequestDTO>> getRequest(@PathVariable Long id) {
        APIResponse<RequestDTO> response = requestService.getRequest(id);
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<APIResponse<List<RequestDTO>>> getClientRequests(@PathVariable Long clientId) {
        APIResponse<List<RequestDTO>> response = requestService.getClientRequests(clientId);
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<APIResponse<List<RequestDTO>>> getVendorRequests(@PathVariable Long vendorId) {
        APIResponse<List<RequestDTO>> response = requestService.getVendorRequests(vendorId);
        return ResponseEntity.ok().body(response);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<APIResponse<Void>> updateStatus(@PathVariable Long id, @RequestParam String status) {
        APIResponse<Void> response = requestService.updateRequestStatus(id, status);
        return ResponseEntity.ok().body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<APIResponse<Void>> deleteRequest(@PathVariable Long id) {
        APIResponse<Void> response = requestService.deleteRequest(id);
        return ResponseEntity.ok().body(response);
    }
}
