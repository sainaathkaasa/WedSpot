package com.wedspot.backend.repository;

import com.wedspot.backend.Model.Entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByServiceId(Long serviceId);
}
