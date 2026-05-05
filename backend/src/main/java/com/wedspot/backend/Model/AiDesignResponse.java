package com.wedspot.backend.Model;

import lombok.Data;

@Data
public class AiDesignResponse {
    private String suggestion;
    private String description;
    private String[] tips;
}
