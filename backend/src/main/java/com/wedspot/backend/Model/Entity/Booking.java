package com.wedspot.backend.Model.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Client who made the booking
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CLIENT_ID", nullable = false)
    @JsonIgnoreProperties({"reviews", "serviceBookings"})
    private User client;

    @Column(name = "EVENT_DATE", nullable = false)
    private LocalDate eventDate;

    @Column(name = "EVENT_LOCATION")
    private String eventLocation;

    @Column(name = "GUEST_COUNT")
    private Integer guestCount;

    @Column(name = "TOTAL_AMOUNT", precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "ADVANCE_PAID", precision = 10, scale = 2)
    private BigDecimal advancePaid;

    @Enumerated(EnumType.STRING)
    @Column(name = "STATUS", nullable = false)
    private BookingStatus status = BookingStatus.PENDING;

    @Column(name = "NOTES")
    private String notes;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("booking")
    private List<ServiceBooking> serviceBookings = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;


}
