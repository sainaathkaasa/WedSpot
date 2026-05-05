package com.wedspot.backend.controller;

import com.wedspot.backend.Model.APIResponse;
import com.wedspot.backend.Model.InventoryDTO;
import com.wedspot.backend.services.IInventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final IInventoryService inventoryService;

    @PostMapping
    public ResponseEntity<APIResponse<InventoryDTO>> createInventory(
            @RequestParam String name,
            @RequestParam String category,
            @RequestParam(defaultValue = "0") Integer stock,
            @RequestParam(defaultValue = "pcs") String unit) {
        APIResponse<InventoryDTO> response = inventoryService.createInventory(name, category, stock, unit);
        return ResponseEntity.status(201).body(response);
    }

    @GetMapping
    public ResponseEntity<APIResponse<List<InventoryDTO>>> getAllInventory() {
        APIResponse<List<InventoryDTO>> response = inventoryService.getAllInventory();
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<APIResponse<InventoryDTO>> getInventoryItem(@PathVariable Long id) {
        APIResponse<InventoryDTO> response = inventoryService.getInventoryItem(id);
        return ResponseEntity.ok().body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<APIResponse<Void>> updateInventory(
            @PathVariable Long id,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Integer stock,
            @RequestParam(required = false) String status) {
        APIResponse<Void> response = inventoryService.updateInventory(id, name, stock, status);
        return ResponseEntity.ok().body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<APIResponse<Void>> deleteInventory(@PathVariable Long id) {
        APIResponse<Void> response = inventoryService.deleteInventory(id);
        return ResponseEntity.ok().body(response);
    }
}
