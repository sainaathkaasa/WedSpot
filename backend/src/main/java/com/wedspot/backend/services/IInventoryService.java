package com.wedspot.backend.services;

import com.wedspot.backend.Model.APIResponse;
import com.wedspot.backend.Model.InventoryDTO;

import java.util.List;

public interface IInventoryService {
    APIResponse<InventoryDTO> createInventory(String name, String category, Integer stock, String unit);
    APIResponse<List<InventoryDTO>> getAllInventory();
    APIResponse<InventoryDTO> getInventoryItem(Long id);
    APIResponse<Void> updateInventory(Long id, String name, Integer stock, String status);
    APIResponse<Void> deleteInventory(Long id);
}
