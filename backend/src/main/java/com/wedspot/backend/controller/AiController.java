package com.wedspot.backend.controller;

import com.wedspot.backend.Model.APIResponse;
import com.wedspot.backend.Model.AiDesignRequest;
import com.wedspot.backend.Model.AiDesignResponse;
import com.wedspot.backend.services.IAiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
public class AiController {

    private final IAiService aiService;

    @PostMapping("/design")
    public ResponseEntity<APIResponse<AiDesignResponse>> getAiDesign(@RequestBody @Valid AiDesignRequest request) {
        APIResponse<AiDesignResponse> response = aiService.getAiDesign(request);
        return ResponseEntity.ok().body(response);
    }
}
