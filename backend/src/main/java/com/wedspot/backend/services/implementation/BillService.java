package com.wedspot.backend.services.implementation;

import com.wedspot.backend.Model.APIResponse;
import com.wedspot.backend.Model.BillDTO;
import com.wedspot.backend.Model.Entity.Bill;
import com.wedspot.backend.Model.Entity.User;
import com.wedspot.backend.exception.ResourceNotFoundException;
import com.wedspot.backend.mappers.IUserMapper;
import com.wedspot.backend.repository.IBillRepository;
import com.wedspot.backend.repository.IUserRepository;
import com.wedspot.backend.services.IBillService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BillService implements IBillService {

    private final IBillRepository billRepository;
    private final IUserRepository userRepository;
    private final IUserMapper userMapper;

    @Override
    public APIResponse<BillDTO> createBill(String invoiceNumber, Long clientId, BigDecimal amount, LocalDate date) {
        User client = userRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found"));

        Bill bill = new Bill();
        bill.setInvoiceNumber(invoiceNumber);
        bill.setClient(client);
        bill.setAmount(amount);
        bill.setDate(date);
        bill.setStatus("pending");

        Bill saved = billRepository.save(bill);

        APIResponse<BillDTO> apiResponse = new APIResponse<>();
        apiResponse.setMessage("Bill created successfully");
        apiResponse.setData(buildDTO(saved));
        return apiResponse;
    }

    @Override
    public APIResponse<List<BillDTO>> getAllBills() {
        List<Bill> bills = billRepository.findAll();
        if (bills.isEmpty()) {
            APIResponse<List<BillDTO>> apiResponse = new APIResponse<>();
            apiResponse.setMessage("No bills found");
            apiResponse.setData(Collections.emptyList());
            return apiResponse;
        }

        List<BillDTO> dtos = bills.stream().map(this::buildDTO).toList();

        APIResponse<List<BillDTO>> apiResponse = new APIResponse<>();
        apiResponse.setMessage("All bills retrieved successfully");
        apiResponse.setData(dtos);
        return apiResponse;
    }

    @Override
    public APIResponse<List<BillDTO>> getClientBills(Long clientId) {
        List<Bill> bills = billRepository.findByClientId(clientId);
        if (bills.isEmpty()) {
            APIResponse<List<BillDTO>> apiResponse = new APIResponse<>();
            apiResponse.setMessage("No bills found");
            apiResponse.setData(Collections.emptyList());
            return apiResponse;
        }

        List<BillDTO> dtos = bills.stream().map(this::buildDTO).toList();

        APIResponse<List<BillDTO>> apiResponse = new APIResponse<>();
        apiResponse.setMessage("Client bills retrieved successfully");
        apiResponse.setData(dtos);
        return apiResponse;
    }

    @Override
    public APIResponse<BillDTO> getBill(Long id) {
        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found"));

        APIResponse<BillDTO> apiResponse = new APIResponse<>();
        apiResponse.setMessage("Bill retrieved successfully");
        apiResponse.setData(buildDTO(bill));
        return apiResponse;
    }

    @Override
    public APIResponse<Void> updateBillStatus(Long id, String status) {
        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found"));
        bill.setStatus(status);
        billRepository.save(bill);

        APIResponse<Void> apiResponse = new APIResponse<>();
        apiResponse.setMessage("Bill status updated to " + status);
        return apiResponse;
    }

    @Override
    public APIResponse<Void> deleteBill(Long id) {
        if (!billRepository.existsById(id)) {
            throw new ResourceNotFoundException("Bill not found");
        }
        billRepository.deleteById(id);

        APIResponse<Void> apiResponse = new APIResponse<>();
        apiResponse.setMessage("Bill deleted successfully");
        return apiResponse;
    }

    private BillDTO buildDTO(Bill bill) {
        BillDTO dto = new BillDTO();
        dto.setId(bill.getId());
        dto.setInvoiceNumber(bill.getInvoiceNumber());
        dto.setClient(userMapper.toDTO(bill.getClient()));
        dto.setAmount(bill.getAmount());
        dto.setDate(bill.getDate());
        dto.setStatus(bill.getStatus());
        dto.setCreatedAt(bill.getCreatedAt());
        return dto;
    }
}
