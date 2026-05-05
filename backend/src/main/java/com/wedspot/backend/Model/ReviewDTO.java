package com.wedspot.backend.Model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class ReviewDTO {
    private Long id;
    private Long serviceId;
    private String serviceName;
    private UserDTO reviewer;
    private double rating;
    private String comment;
    private LocalDateTime createdAt;
}
