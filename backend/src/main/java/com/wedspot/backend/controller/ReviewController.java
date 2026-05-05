package com.wedspot.backend.controller;

import com.wedspot.backend.Model.APIResponse;
import com.wedspot.backend.Model.ReviewDTO;
import com.wedspot.backend.Model.ReviewRequest;
import com.wedspot.backend.services.IReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final IReviewService reviewService;

    @PostMapping
    public ResponseEntity<APIResponse<ReviewDTO>> createReview(@RequestBody @Valid ReviewRequest request) {
        APIResponse<ReviewDTO> response = reviewService.createReview(request);
        return ResponseEntity.status(201).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<APIResponse<ReviewDTO>> getReview(@PathVariable Long id) {
        APIResponse<ReviewDTO> response = reviewService.getReview(id);
        return ResponseEntity.ok().body(response);
    }

    @GetMapping
    public ResponseEntity<APIResponse<List<ReviewDTO>>> getAllReviews() {
        APIResponse<List<ReviewDTO>> response = reviewService.getAllReviews();
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/service/{serviceId}")
    public ResponseEntity<APIResponse<List<ReviewDTO>>> getReviewsByServiceId(@PathVariable Long serviceId) {
        APIResponse<List<ReviewDTO>> response = reviewService.getReviewsByServiceId(serviceId);
        return ResponseEntity.ok().body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<APIResponse<Void>> deleteReview(@PathVariable Long id) {
        APIResponse<Void> response = reviewService.deleteReview(id);
        return ResponseEntity.ok().body(response);
    }
}
