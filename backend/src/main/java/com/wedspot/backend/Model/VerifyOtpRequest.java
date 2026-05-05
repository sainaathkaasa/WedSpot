package com.wedspot.backend.Model;

import lombok.Data;

@Data
public class VerifyOtpRequest {
    private String email;
    private String otp;
}
