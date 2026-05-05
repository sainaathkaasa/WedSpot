package com.wedspot.backend.Model;

import lombok.Data;

@Data
public class TokenVerificationResponse {
    private boolean valid;
    private String email;
    private String role;
    private String message;
}
