package com.wedspot.backend.services.implementation;

import com.wedspot.backend.Model.APIResponse;
import com.wedspot.backend.Model.Entity.User;
import com.wedspot.backend.Model.UpdatePasswordRequest;
import com.wedspot.backend.Model.UpdateUserRequest;
import com.wedspot.backend.Model.UserDTO;
import com.wedspot.backend.exception.InvalidCredentialsException;
import com.wedspot.backend.exception.ResourceNotFoundException;
import com.wedspot.backend.mappers.IUserMapper;
import com.wedspot.backend.repository.IUserRepository;
import com.wedspot.backend.services.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {

    private final IUserRepository userRepository;

    private final IUserMapper IUserMapper;

    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    public APIResponse<UserDTO> getUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        UserDTO userDTO = IUserMapper.toDTO(user);
        APIResponse<UserDTO> apiResponse = new APIResponse<>();
        apiResponse.setData(userDTO);
        apiResponse.setMessage("User fetched successfully");
        return apiResponse;
    }

    @Override
    public APIResponse<List<UserDTO>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<UserDTO> userDTOs = users.stream().map(IUserMapper::toDTO).collect(Collectors.toList());
        APIResponse<List<UserDTO>> apiResponse = new APIResponse<>();
        apiResponse.setData(userDTOs);
        apiResponse.setTotalElements(userDTOs.size());
        apiResponse.setPageNumber(0);
        apiResponse.setPageSize(userDTOs.size());
        apiResponse.setTotalPages(1);
        apiResponse.setMessage("Users fetched successfully");
        return apiResponse;
    }

    @Override
    public APIResponse<UserDTO> UpdateUser(long id, UpdateUserRequest request) {
        User fetchedUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        IUserMapper.updateEntityFromRequest(request, fetchedUser);

        User savedUser = userRepository.save(fetchedUser);

        UserDTO userDTO = IUserMapper.toDTO(savedUser);

        APIResponse<UserDTO> apiResponse = new APIResponse<>();
        apiResponse.setData(userDTO);
        apiResponse.setMessage("User updated successfully");
        return apiResponse;
    }

    @Override
    public APIResponse<Void> UpdatePassword(long id, UpdatePasswordRequest request) {
        User fetchedUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getOldPassword(), fetchedUser.getPassword())) {
            throw new InvalidCredentialsException("Old password does not match");
        }

        fetchedUser.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(fetchedUser);

        APIResponse<Void> apiResponse = new APIResponse<>();
        apiResponse.setMessage("Password updated successfully");
        return apiResponse;
    }

    @Override
    public APIResponse<Void> deleteUser(long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        userRepository.delete(user);
        APIResponse<Void> apiResponse = new APIResponse<>();
        apiResponse.setMessage("User deleted successfully");
        return apiResponse;
    }
}
