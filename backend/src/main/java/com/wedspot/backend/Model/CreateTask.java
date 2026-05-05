package com.wedspot.backend.Model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateTask {
    @NotBlank(message = "Task text is required")
    private String text;

    @NotBlank(message = "Priority is required")
    private String priority;

    @NotNull(message = "Due date is required")
    private LocalDate dueDate;

    @NotBlank(message = "Category is required")
    private String category;

    private Integer points;
    private Long assignedToId;
    private Long bookingId;
}
