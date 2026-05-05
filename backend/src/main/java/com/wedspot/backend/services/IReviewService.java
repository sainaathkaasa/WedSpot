package com.wedspot.backend.services;

import com.wedspot.backend.Model.APIResponse;
import com.wedspot.backend.Model.ReviewDTO;
import com.wedspot.backend.Model.ReviewRequest;

import java.util.List;

public interface IReviewService {
    APIResponse<ReviewDTO> createReview(ReviewRequest request);
    APIResponse<ReviewDTO> getReview(Long id);
    APIResponse<List<ReviewDTO>> getAllReviews();
    APIResponse<List<ReviewDTO>> getReviewsByServiceId(Long serviceId);
    APIResponse<Void> deleteReview(Long id);
}
