package com.wedspot.backend.services.implementation;

import com.wedspot.backend.Model.*;
import com.wedspot.backend.Model.Entity.Request;
import com.wedspot.backend.Model.Entity.User;
import com.wedspot.backend.exception.ResourceNotFoundException;
import com.wedspot.backend.mappers.IUserMapper;
import com.wedspot.backend.repository.IRequestRepository;
import com.wedspot.backend.repository.IUserRepository;
import com.wedspot.backend.services.IRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RequestService implements IRequestService {

    private final IRequestRepository requestRepository;
    private final IUserRepository userRepository;
    private final IUserMapper userMapper;

    @Override
    public APIResponse<RequestDTO> createRequest(CreateRequest request) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User client = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Request entity = new Request();
        entity.setSubject(request.getSubject());
        entity.setDescription(request.getDescription());
        entity.setCategory(request.getCategory());
        entity.setType(request.getType() != null ? request.getType() : "Inquiry");
        entity.setClient(client);

        Request saved = requestRepository.save(entity);

        APIResponse<RequestDTO> apiResponse = new APIResponse<>();
        apiResponse.setMessage("Request created successfully");
        apiResponse.setData(buildDTO(saved));
        return apiResponse;
    }

    @Override
    public APIResponse<RequestDTO> getRequest(Long id) {
        Request request = requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

        APIResponse<RequestDTO> apiResponse = new APIResponse<>();
        apiResponse.setMessage("Request retrieved successfully");
        apiResponse.setData(buildDTO(request));
        return apiResponse;
    }

    @Override
    public APIResponse<List<RequestDTO>> getAllRequests() {
        List<Request> requests = requestRepository.findAll();
        if (requests.isEmpty()) {
            APIResponse<List<RequestDTO>> apiResponse = new APIResponse<>();
            apiResponse.setMessage("No requests found");
            apiResponse.setData(Collections.emptyList());
            return apiResponse;
        }

        List<RequestDTO> dtos = requests.stream().map(this::buildDTO).toList();

        APIResponse<List<RequestDTO>> apiResponse = new APIResponse<>();
        apiResponse.setMessage("All requests retrieved successfully");
        apiResponse.setData(dtos);
        return apiResponse;
    }

    @Override
    public APIResponse<List<RequestDTO>> getClientRequests(Long clientId) {
        List<Request> requests = requestRepository.findByClientId(clientId);
        if (requests.isEmpty()) {
            APIResponse<List<RequestDTO>> apiResponse = new APIResponse<>();
            apiResponse.setMessage("No requests found");
            apiResponse.setData(Collections.emptyList());
            return apiResponse;
        }

        List<RequestDTO> dtos = requests.stream().map(this::buildDTO).toList();

        APIResponse<List<RequestDTO>> apiResponse = new APIResponse<>();
        apiResponse.setMessage("Client requests retrieved successfully");
        apiResponse.setData(dtos);
        return apiResponse;
    }

    @Override
    public APIResponse<List<RequestDTO>> getVendorRequests(Long vendorId) {
        List<Request> requests = requestRepository.findByVendorId(vendorId);
        if (requests.isEmpty()) {
            APIResponse<List<RequestDTO>> apiResponse = new APIResponse<>();
            apiResponse.setMessage("No requests found");
            apiResponse.setData(Collections.emptyList());
            return apiResponse;
        }

        List<RequestDTO> dtos = requests.stream().map(this::buildDTO).toList();

        APIResponse<List<RequestDTO>> apiResponse = new APIResponse<>();
        apiResponse.setMessage("Vendor requests retrieved successfully");
        apiResponse.setData(dtos);
        return apiResponse;
    }

    @Override
    public APIResponse<Void> updateRequestStatus(Long id, String status) {
        Request request = requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));
        request.setStatus(status);
        requestRepository.save(request);

        APIResponse<Void> apiResponse = new APIResponse<>();
        apiResponse.setMessage("Request status updated to " + status);
        return apiResponse;
    }

    @Override
    public APIResponse<Void> deleteRequest(Long id) {
        if (!requestRepository.existsById(id)) {
            throw new ResourceNotFoundException("Request not found");
        }
        requestRepository.deleteById(id);

        APIResponse<Void> apiResponse = new APIResponse<>();
        apiResponse.setMessage("Request deleted successfully");
        return apiResponse;
    }

    private RequestDTO buildDTO(Request request) {
        RequestDTO dto = new RequestDTO();
        dto.setId(request.getId());
        dto.setSubject(request.getSubject());
        dto.setDescription(request.getDescription());
        dto.setCategory(request.getCategory());
        dto.setType(request.getType());
        dto.setStatus(request.getStatus());
        dto.setClient(userMapper.toDTO(request.getClient()));
        if (request.getVendor() != null) {
            dto.setVendor(userMapper.toDTO(request.getVendor()));
        }
        dto.setCreatedAt(request.getCreatedAt());
        dto.setUpdatedAt(request.getUpdatedAt());
        return dto;
    }
}
