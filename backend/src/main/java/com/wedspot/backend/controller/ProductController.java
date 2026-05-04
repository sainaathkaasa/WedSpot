package com.wedspot.backend.controller;

import com.wedspot.backend.Model.APIResponse;
import com.wedspot.backend.Model.VendorServiceDTO;
import com.wedspot.backend.services.IVendorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final IVendorService vendorService;

    @GetMapping
    public ResponseEntity<APIResponse<java.util.List<VendorServiceDTO>>> getAllProducts() {
        APIResponse<java.util.List<VendorServiceDTO>> response = vendorService.getAllVendorServices();
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<APIResponse<VendorServiceDTO>> getProductById(@PathVariable Long id) {
        APIResponse<VendorServiceDTO> response = vendorService.getVendorService(id);
        return ResponseEntity.ok().body(response);
    }
}
