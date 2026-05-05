package com.wedspot.backend.services;

import com.wedspot.backend.Model.APIResponse;
import com.wedspot.backend.Model.BillDTO;

import java.util.List;

public interface IBillService {
    APIResponse<BillDTO> createBill(String invoiceNumber, Long clientId, java.math.BigDecimal amount, java.time.LocalDate date);
    APIResponse<List<BillDTO>> getAllBills();
    APIResponse<List<BillDTO>> getClientBills(Long clientId);
    APIResponse<BillDTO> getBill(Long id);
    APIResponse<Void> updateBillStatus(Long id, String status);
    APIResponse<Void> deleteBill(Long id);
}
