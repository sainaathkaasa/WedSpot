package com.wedspot.backend.services.implementation;

import com.wedspot.backend.Model.*;
import com.wedspot.backend.Model.Entity.User;
import com.wedspot.backend.config.JwtUtils;
import com.wedspot.backend.exception.InvalidCredentialsException;
import com.wedspot.backend.exception.ResourceAlreadyExistsException;
import com.wedspot.backend.exception.ResourceNotFoundException;
import com.wedspot.backend.mappers.IUserMapper;
import com.wedspot.backend.repository.IAuthRepository;
import com.wedspot.backend.services.IAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class AuthService implements IAuthService {

    private final IAuthRepository authRepository;
    private final IUserMapper IUserMapper;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    private static final Map<String, OtpEntry> otpStore = new ConcurrentHashMap<>();
    private static final int OTP_EXPIRY_MINUTES = 10;

    @Override
    public APIResponse<LoginResponse> login(LoginRequest request) {
        User fetchedUser = authRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), fetchedUser.getPassword())) {
            throw new InvalidCredentialsException("Invalid credentials");
        }

        UserDTO fetchedUserDTO = IUserMapper.toDTO(fetchedUser);
        String token = jwtUtils.generateToken(fetchedUser);

        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setUser(fetchedUserDTO);
        loginResponse.setAccessToken(token);
        loginResponse.setRefreshToken(jwtUtils.generateRefreshToken(fetchedUser));

        APIResponse<LoginResponse> apiResponse = new APIResponse<>();
        apiResponse.setData(loginResponse);
        apiResponse.setMessage("Login successful");
        return apiResponse;
    }

    @Override
    public APIResponse<LoginResponse> register(RegisterRequest request) {
        Optional<User> existingUser = authRepository.findByEmail(request.getEmail());
        if (existingUser.isPresent()) {
            throw new ResourceAlreadyExistsException("Email already exists");
        }
        if (request.getRole() != null) {
            request.setRole(request.getRole().toUpperCase());
        }
        User user = IUserMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = authRepository.save(user);
        UserDTO savedUserDTO = IUserMapper.toDTO(savedUser);
        String token = jwtUtils.generateToken(savedUser);

        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setUser(savedUserDTO);
        loginResponse.setAccessToken(token);
        loginResponse.setRefreshToken(jwtUtils.generateRefreshToken(savedUser));

        APIResponse<LoginResponse> apiResponse = new APIResponse<>();
        apiResponse.setData(loginResponse);
        apiResponse.setMessage("User registered successfully");
        return apiResponse;
    }

    public APIResponse<Void> forgotPassword(ForgotPasswordRequest request) {
        User user = authRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        String otp = generateOtp();
        otpStore.put(request.getEmail(), new OtpEntry(otp, System.currentTimeMillis()));

        APIResponse<Void> apiResponse = new APIResponse<>();
        apiResponse.setMessage("OTP sent successfully to your email. (Demo OTP: " + otp + ")");
        return apiResponse;
    }

    public APIResponse<Void> verifyOtp(VerifyOtpRequest request) {
        OtpEntry entry = otpStore.get(request.getEmail());
        if (entry == null) {
            throw new InvalidCredentialsException("No OTP found for this email");
        }

        long elapsedMinutes = (System.currentTimeMillis() - entry.timestamp()) / 60000;
        if (elapsedMinutes > OTP_EXPIRY_MINUTES) {
            otpStore.remove(request.getEmail());
            throw new InvalidCredentialsException("OTP has expired");
        }

        if (!entry.otp().equals(request.getOtp())) {
            throw new InvalidCredentialsException("Invalid OTP");
        }

        APIResponse<Void> apiResponse = new APIResponse<>();
        apiResponse.setMessage("OTP verified successfully");
        return apiResponse;
    }

    public APIResponse<Void> resetPassword(ResetPasswordRequest request) {
        User user = authRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        OtpEntry entry = otpStore.get(request.getEmail());
        if (entry == null || !entry.otp().equals(request.getOtp())) {
            throw new InvalidCredentialsException("Invalid OTP");
        }

        long elapsedMinutes = (System.currentTimeMillis() - entry.timestamp()) / 60000;
        if (elapsedMinutes > OTP_EXPIRY_MINUTES) {
            otpStore.remove(request.getEmail());
            throw new InvalidCredentialsException("OTP has expired");
        }

        user.setPassword(passwordEncoder.encode(request.getPassword()));
        authRepository.save(user);
        otpStore.remove(request.getEmail());

        APIResponse<Void> apiResponse = new APIResponse<>();
        apiResponse.setMessage("Password reset successfully");
        return apiResponse;
    }

    public APIResponse<TokenVerificationResponse> verifyToken(String token) {
        TokenVerificationResponse response = new TokenVerificationResponse();

        try {
            String email = jwtUtils.extractUsername(token);
            User user = authRepository.findByEmail(email)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            boolean isValid = !jwtUtils.extractExpiration(token).before(new Date()) && user.isEnabled();

            response.setValid(isValid);
            response.setEmail(email);
            response.setRole(user.getRole());
            response.setMessage(isValid ? "Token is valid" : "Token is invalid or expired");

            APIResponse<TokenVerificationResponse> apiResponse = new APIResponse<>();
            apiResponse.setData(response);
            apiResponse.setMessage("Token verification completed");
            return apiResponse;
        } catch (Exception e) {
            response.setValid(false);
            response.setMessage("Token verification failed: " + e.getMessage());

            APIResponse<TokenVerificationResponse> apiResponse = new APIResponse<>();
            apiResponse.setData(response);
            apiResponse.setMessage("Token is invalid");
            apiResponse.setStatusCode(401);
            return apiResponse;
        }
    }

    private String generateOtp() {
        return String.format("%06d", new Random().nextInt(999999));
    }

    @Override
    public APIResponse<LoginResponse> refreshToken(RefreshTokenRequest request) {
        try {
            String email = jwtUtils.extractUsername(request.getRefreshToken());
            User user = authRepository.findByEmail(email)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            boolean isValid = !jwtUtils.extractExpiration(request.getRefreshToken()).before(new Date()) && user.isEnabled();

            if (!isValid) {
                APIResponse<LoginResponse> apiResponse = new APIResponse<>();
                apiResponse.setMessage("Refresh token is invalid or expired");
                apiResponse.setStatusCode(401);
                return apiResponse;
            }

            String newAccessToken = jwtUtils.generateToken(user);

            LoginResponse loginResponse = new LoginResponse();
            loginResponse.setUser(IUserMapper.toDTO(user));
            loginResponse.setAccessToken(newAccessToken);
            loginResponse.setRefreshToken(request.getRefreshToken());

            APIResponse<LoginResponse> apiResponse = new APIResponse<>();
            apiResponse.setData(loginResponse);
            apiResponse.setMessage("Token refreshed successfully");
            return apiResponse;
        } catch (Exception e) {
            APIResponse<LoginResponse> apiResponse = new APIResponse<>();
            apiResponse.setMessage("Token refresh failed: " + e.getMessage());
            apiResponse.setStatusCode(401);
            return apiResponse;
        }
    }

    private record OtpEntry(String otp, long timestamp) {}
}
