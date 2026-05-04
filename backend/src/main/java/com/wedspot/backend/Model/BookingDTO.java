package com.wedspot.backend.Model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.wedspot.backend.Model.Entity.Booking;
import com.wedspot.backend.Model.Entity.BookingStatus;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class BookingDTO {

    private Long id;

    private UserDTO client;

    private List<VendorServiceDTO> services;

    private LocalDate eventDate;

    private String eventLocation;

    private Integer guestCount;

    private BigDecimal totalAmount;

    private BigDecimal advancePaid;

    private BookingStatus status = BookingStatus.PENDING;

    private String notes;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
