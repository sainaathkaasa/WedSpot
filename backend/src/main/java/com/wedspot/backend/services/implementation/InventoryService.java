package com.wedspot.backend.services.implementation;

import com.wedspot.backend.Model.APIResponse;
import com.wedspot.backend.Model.InventoryDTO;
import com.wedspot.backend.Model.Entity.Inventory;
import com.wedspot.backend.exception.ResourceNotFoundException;
import com.wedspot.backend.repository.IInventoryRepository;
import com.wedspot.backend.services.IInventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryService implements IInventoryService {

    private final IInventoryRepository inventoryRepository;

    @Override
    public APIResponse<InventoryDTO> createInventory(String name, String category, Integer stock, String unit) {
        Inventory entity = new Inventory();
        entity.setName(name);
        entity.setCategory(category);
        entity.setStock(stock != null ? stock : 0);
        entity.setUnit(unit != null ? unit : "pcs");
        entity.setLastUpdated(LocalDateTime.now());
        entity.setStatus(stock == null || stock == 0 ? "out" : stock < 20 ? "low" : "available");

        Inventory saved = inventoryRepository.save(entity);

        APIResponse<InventoryDTO> apiResponse = new APIResponse<>();
        apiResponse.setMessage("Inventory item created successfully");
        apiResponse.setData(buildDTO(saved));
        return apiResponse;
    }

    @Override
    public APIResponse<List<InventoryDTO>> getAllInventory() {
        List<Inventory> items = inventoryRepository.findAll();
        if (items.isEmpty()) {
            APIResponse<List<InventoryDTO>> apiResponse = new APIResponse<>();
            apiResponse.setMessage("No inventory items found");
            apiResponse.setData(Collections.emptyList());
            return apiResponse;
        }

        List<InventoryDTO> dtos = items.stream().map(this::buildDTO).toList();

        APIResponse<List<InventoryDTO>> apiResponse = new APIResponse<>();
        apiResponse.setMessage("All inventory items retrieved successfully");
        apiResponse.setData(dtos);
        return apiResponse;
    }

    @Override
    public APIResponse<InventoryDTO> getInventoryItem(Long id) {
        Inventory item = inventoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found"));

        APIResponse<InventoryDTO> apiResponse = new APIResponse<>();
        apiResponse.setMessage("Inventory item retrieved successfully");
        apiResponse.setData(buildDTO(item));
        return apiResponse;
    }

    @Override
    public APIResponse<Void> updateInventory(Long id, String name, Integer stock, String status) {
        Inventory item = inventoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found"));

        if (name != null) item.setName(name);
        if (stock != null) {
            item.setStock(stock);
            if (status == null) {
                item.setStatus(stock == 0 ? "out" : stock < 20 ? "low" : "available");
            }
        }
        if (status != null) item.setStatus(status);
        item.setLastUpdated(LocalDateTime.now());

        inventoryRepository.save(item);

        APIResponse<Void> apiResponse = new APIResponse<>();
        apiResponse.setMessage("Inventory item updated successfully");
        return apiResponse;
    }

    @Override
    public APIResponse<Void> deleteInventory(Long id) {
        if (!inventoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Inventory item not found");
        }
        inventoryRepository.deleteById(id);

        APIResponse<Void> apiResponse = new APIResponse<>();
        apiResponse.setMessage("Inventory item deleted successfully");
        return apiResponse;
    }

    private InventoryDTO buildDTO(Inventory item) {
        InventoryDTO dto = new InventoryDTO();
        dto.setId(item.getId());
        dto.setName(item.getName());
        dto.setCategory(item.getCategory());
        dto.setStock(item.getStock());
        dto.setUnit(item.getUnit());
        dto.setStatus(item.getStatus());
        dto.setLastUpdated(item.getLastUpdated());
        dto.setCreatedAt(item.getCreatedAt());
        dto.setUpdatedAt(item.getUpdatedAt());
        return dto;
    }
}
