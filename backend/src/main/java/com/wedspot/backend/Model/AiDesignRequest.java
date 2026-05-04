package com.wedspot.backend.Model;

import lombok.Data;

@Data
public class AiDesignRequest {
    private String productType;
    private String theme;
    private String colorScheme;
    private String additionalDetails;
}
