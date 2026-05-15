package com.wedspot.backend.controller;

import com.wedspot.backend.Model.APIResponse;
import com.wedspot.backend.Model.UpdatePasswordRequest;
import com.wedspot.backend.Model.UpdateUserRequest;
import com.wedspot.backend.Model.UserDTO;
import com.wedspot.backend.services.IUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {

    private final IUserService userService;

    @GetMapping("/users")
    public ResponseEntity<APIResponse<List<UserDTO>>> getAllUsers() {
        APIResponse<List<UserDTO>> response = userService.getAllUsers();
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<APIResponse<UserDTO>> getUser(@PathVariable Long id) {
        APIResponse<UserDTO> response = userService.getUser(id);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PutMapping("/profile/{id}")
    public ResponseEntity<APIResponse<UserDTO>> UpdateProfile(@PathVariable long id,
            @Valid @RequestBody UpdateUserRequest request) {
        APIResponse<UserDTO> response = userService.UpdateUser(id, request);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<APIResponse<Void>> deleteUser(@PathVariable Long id) {
        APIResponse<Void> response = userService.deleteUser(id);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PutMapping("/password/{id}")
    public ResponseEntity<APIResponse<Void>> UpdatePassword(@PathVariable long id,
            @Valid @RequestBody UpdatePasswordRequest request) {
        APIResponse<Void> response = userService.UpdatePassword(id, request);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
