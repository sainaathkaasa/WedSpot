package com.wedspot.backend.Model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class RequestDTO {
    private Long id;
    private String subject;
    private String description;
    private String category;
    private String type;
    private String status;
    private UserDTO client;
    private UserDTO vendor;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
