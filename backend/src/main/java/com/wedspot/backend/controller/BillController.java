package com.wedspot.backend.controller;

import com.wedspot.backend.Model.APIResponse;
import com.wedspot.backend.Model.BillDTO;
import com.wedspot.backend.services.IBillService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/bills")
@RequiredArgsConstructor
public class BillController {

    private final IBillService billService;

    @PostMapping
    public ResponseEntity<APIResponse<BillDTO>> createBill(
            @RequestParam String invoiceNumber,
            @RequestParam Long clientId,
            @RequestParam BigDecimal amount,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        APIResponse<BillDTO> response = billService.createBill(invoiceNumber, clientId, amount, date);
        return ResponseEntity.status(201).body(response);
    }

    @GetMapping
    public ResponseEntity<APIResponse<List<BillDTO>>> getAllBills() {
        APIResponse<List<BillDTO>> response = billService.getAllBills();
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<APIResponse<BillDTO>> getBill(@PathVariable Long id) {
        APIResponse<BillDTO> response = billService.getBill(id);
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<APIResponse<List<BillDTO>>> getClientBills(@PathVariable Long clientId) {
        APIResponse<List<BillDTO>> response = billService.getClientBills(clientId);
        return ResponseEntity.ok().body(response);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<APIResponse<Void>> updateStatus(@PathVariable Long id, @RequestParam String status) {
        APIResponse<Void> response = billService.updateBillStatus(id, status);
        return ResponseEntity.ok().body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<APIResponse<Void>> deleteBill(@PathVariable Long id) {
        APIResponse<Void> response = billService.deleteBill(id);
        return ResponseEntity.ok().body(response);
    }
}
