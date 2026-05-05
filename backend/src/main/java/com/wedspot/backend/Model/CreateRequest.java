package com.wedspot.backend.Model;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateRequest {
    @NotBlank(message = "Subject is required")
    private String subject;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Category is required")
    private String category;

    private String type;
}
