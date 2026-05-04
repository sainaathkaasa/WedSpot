package com.wedspot.backend.services;

import com.wedspot.backend.Model.*;

public interface IAuthService {
    APIResponse<LoginResponse> login(LoginRequest request);

    APIResponse<LoginResponse> register(RegisterRequest request);

    APIResponse<Void> forgotPassword(ForgotPasswordRequest request);

    APIResponse<Void> verifyOtp(VerifyOtpRequest request);

    APIResponse<Void> resetPassword(ResetPasswordRequest request);

    APIResponse<TokenVerificationResponse> verifyToken(String token);
}
