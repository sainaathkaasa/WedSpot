package com.wedspot.backend.controller;

import com.wedspot.backend.Model.*;
import com.wedspot.backend.services.IAuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final IAuthService authService;

    @PostMapping("/login")
    public ResponseEntity<APIResponse<LoginResponse>> login(@RequestBody @Valid LoginRequest request) {
        APIResponse<LoginResponse> response = authService.login(request);
        return ResponseEntity.status(200).body(response);
    }

    @PostMapping("/register")
    public ResponseEntity<APIResponse<LoginResponse>> register(@RequestBody @Valid RegisterRequest request) {
        APIResponse<LoginResponse> response = authService.register(request);
        return ResponseEntity.status(200).body(response);
    }

    @GetMapping("/logout/{id}")
    public ResponseEntity<APIResponse<Void>> logout(@PathVariable Long id) {
        APIResponse<Void> apiResponse = new APIResponse<>();
        apiResponse.setMessage("Successfully logged out");
        return ResponseEntity.status(200).body(apiResponse);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<APIResponse<Void>> forgotPassword(@RequestBody @Valid ForgotPasswordRequest request) {
        APIResponse<Void> response = authService.forgotPassword(request);
        return ResponseEntity.status(200).body(response);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<APIResponse<Void>> verifyOtp(@RequestBody @Valid VerifyOtpRequest request) {
        APIResponse<Void> response = authService.verifyOtp(request);
        return ResponseEntity.status(200).body(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<APIResponse<Void>> resetPassword(@RequestBody @Valid ResetPasswordRequest request) {
        APIResponse<Void> response = authService.resetPassword(request);
        return ResponseEntity.status(200).body(response);
    }

    @PostMapping("/verify-token")
    public ResponseEntity<APIResponse<TokenVerificationResponse>> verifyToken(@RequestParam String token) {
        APIResponse<TokenVerificationResponse> response = authService.verifyToken(token);
        return ResponseEntity.status(200).body(response);
    }
}
