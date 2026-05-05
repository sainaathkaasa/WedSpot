package com.wedspot.backend.Model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class TaskDTO {
    private Long id;
    private String text;
    private String priority;
    private LocalDate dueDate;
    private boolean completed;
    private String category;
    private Integer points;
    private UserDTO assignedTo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
