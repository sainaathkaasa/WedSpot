package com.wedspot.backend.Model.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "vendor_services")
@Data
public class VendorService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ElementCollection
    @CollectionTable(name = "service_tags", joinColumns = @JoinColumn(name = "service_id"))
    @Column(name = "tag")
    private List<String> tags = new ArrayList<>();

    @Column(name = "image_url")
    private String imageUrl;

    private BigDecimal price;

    private String location;

    private String category;

    private Integer quantity = 1;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", nullable = false)
    @JsonIgnoreProperties({"reviews", "serviceBookings"})
    private User vendor;

    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnoreProperties("service")
    private List<Review> reviews = new ArrayList<>();

    public double getRating() {
        if (reviews == null || reviews.isEmpty()) return 0.0;
        return reviews.stream()
                .mapToDouble(Review::getRating)
                .average()
                .orElse(0.0);
    }

    public int getReviewCount() {
        return reviews == null ? 0 : reviews.size();
    }

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}