package com.wedspot.backend.Model;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class BookingRequest {
    @NotNull(message = "Event date is required")
    private LocalDate eventDate;

    @NotNull(message = "Event location is required")
    private String eventLocation;

    @NotNull(message = "Guest count is required")
    private Integer guestCount;

    private String notes;

    @NotEmpty(message = "At least one service must be selected")
    private List<Long> serviceIds;
}
