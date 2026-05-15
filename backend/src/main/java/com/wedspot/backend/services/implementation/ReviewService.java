package com.wedspot.backend.services.implementation;

import com.wedspot.backend.Model.APIResponse;
import com.wedspot.backend.Model.ReviewDTO;
import com.wedspot.backend.Model.ReviewRequest;
import com.wedspot.backend.Model.UserDTO;
import com.wedspot.backend.Model.Entity.Review;
import com.wedspot.backend.Model.Entity.User;
import com.wedspot.backend.Model.Entity.VendorService;
import com.wedspot.backend.exception.ResourceNotFoundException;
import com.wedspot.backend.mappers.IReviewMapper;
import com.wedspot.backend.mappers.IUserMapper;
import com.wedspot.backend.repository.IReviewRepository;
import com.wedspot.backend.repository.IUserRepository;
import com.wedspot.backend.repository.IVendorServiceRepository;
import com.wedspot.backend.services.IReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService implements IReviewService {

    private final IReviewRepository reviewRepository;
    private final IVendorServiceRepository vendorServiceRepository;
    private final IUserRepository userRepository;
    private final IReviewMapper reviewMapper;
    private final IUserMapper userMapper;

    @Override
    public APIResponse<ReviewDTO> createReview(ReviewRequest request) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User reviewer = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        VendorService service = vendorServiceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Vendor service not found"));

        Review review = new Review();
        review.setService(service);
        review.setReviewer(reviewer);
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        Review savedReview = reviewRepository.save(review);

        ReviewDTO dto = buildReviewDTO(savedReview);

        APIResponse<ReviewDTO> apiResponse = new APIResponse<>();
        apiResponse.setMessage("Review created successfully");
        apiResponse.setData(dto);
        return apiResponse;
    }

    @Override
    public APIResponse<ReviewDTO> getReview(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        APIResponse<ReviewDTO> apiResponse = new APIResponse<>();
        apiResponse.setMessage("Review retrieved successfully");
        apiResponse.setData(buildReviewDTO(review));
        return apiResponse;
    }

    @Override
    public APIResponse<List<ReviewDTO>> getAllReviews() {
        List<Review> reviews = reviewRepository.findAll();
        if (reviews.isEmpty()) {
            APIResponse<List<ReviewDTO>> apiResponse = new APIResponse<>();
            apiResponse.setMessage("No reviews found");
            apiResponse.setData(Collections.emptyList());
            return apiResponse;
        }

        List<ReviewDTO> dtos = reviews.stream().map(this::buildReviewDTO).toList();

        APIResponse<List<ReviewDTO>> apiResponse = new APIResponse<>();
        apiResponse.setMessage("All reviews retrieved successfully");
        apiResponse.setData(dtos);
        return apiResponse;
    }

    @Override
    public APIResponse<List<ReviewDTO>> getReviewsByServiceId(Long serviceId) {
        List<Review> reviews = reviewRepository.findByServiceId(serviceId);

        if (reviews.isEmpty()) {
            APIResponse<List<ReviewDTO>> apiResponse = new APIResponse<>();
            apiResponse.setMessage("No reviews found for this service");
            apiResponse.setData(Collections.emptyList());
            return apiResponse;
        }

        List<ReviewDTO> dtos = reviews.stream().map(this::buildReviewDTO).toList();

        APIResponse<List<ReviewDTO>> apiResponse = new APIResponse<>();
        apiResponse.setMessage("Reviews retrieved successfully");
        apiResponse.setData(dtos);
        return apiResponse;
    }

    @Override
    public APIResponse<Void> deleteReview(Long id) {
        if (!reviewRepository.existsById(id)) {
            throw new ResourceNotFoundException("Review not found");
        }
        reviewRepository.deleteById(id);

        APIResponse<Void> apiResponse = new APIResponse<>();
        apiResponse.setMessage("Review deleted successfully");
        return apiResponse;
    }

    private ReviewDTO buildReviewDTO(Review review) {
        ReviewDTO dto = new ReviewDTO();
        dto.setId(review.getId());
        dto.setServiceId(review.getService().getId());
        dto.setServiceName(review.getService().getName());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setCreatedAt(review.getCreatedAt());

        UserDTO reviewerDTO = userMapper.toDTO(review.getReviewer());
        dto.setReviewer(reviewerDTO);

        return dto;
    }
}
