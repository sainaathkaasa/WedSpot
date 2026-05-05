package com.wedspot.backend.services.implementation;

import com.wedspot.backend.Model.*;
import com.wedspot.backend.Model.Entity.Booking;
import com.wedspot.backend.Model.Entity.Task;
import com.wedspot.backend.Model.Entity.User;
import com.wedspot.backend.exception.ResourceNotFoundException;
import com.wedspot.backend.mappers.IUserMapper;
import com.wedspot.backend.repository.IBookingRepository;
import com.wedspot.backend.repository.ITaskRepository;
import com.wedspot.backend.repository.IUserRepository;
import com.wedspot.backend.services.ITaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService implements ITaskService {

    private final ITaskRepository taskRepository;
    private final IUserRepository userRepository;
    private final IBookingRepository bookingRepository;
    private final IUserMapper userMapper;

    @Override
    public APIResponse<TaskDTO> createTask(CreateTask request) {
        Task task = new Task();
        task.setText(request.getText());
        task.setPriority(request.getPriority());
        task.setDueDate(request.getDueDate());
        task.setCategory(request.getCategory());
        task.setPoints(request.getPoints() != null ? request.getPoints() : 10);

        if (request.getAssignedToId() != null) {
            User assignedTo = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            task.setAssignedTo(assignedTo);
        }

        if (request.getBookingId() != null) {
            Booking booking = bookingRepository.findById(request.getBookingId())
                    .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
            task.setBooking(booking);
        }

        Task saved = taskRepository.save(task);

        APIResponse<TaskDTO> apiResponse = new APIResponse<>();
        apiResponse.setMessage("Task created successfully");
        apiResponse.setData(buildDTO(saved));
        return apiResponse;
    }

    @Override
    public APIResponse<List<TaskDTO>> getAllTasks() {
        List<Task> tasks = taskRepository.findAll();
        if (tasks.isEmpty()) {
            APIResponse<List<TaskDTO>> apiResponse = new APIResponse<>();
            apiResponse.setMessage("No tasks found");
            apiResponse.setData(Collections.emptyList());
            return apiResponse;
        }

        List<TaskDTO> dtos = tasks.stream().map(this::buildDTO).toList();

        APIResponse<List<TaskDTO>> apiResponse = new APIResponse<>();
        apiResponse.setMessage("All tasks retrieved successfully");
        apiResponse.setData(dtos);
        return apiResponse;
    }

    @Override
    public APIResponse<List<TaskDTO>> getTasksByUser(Long userId) {
        List<Task> tasks = taskRepository.findByAssignedToId(userId);
        if (tasks.isEmpty()) {
            APIResponse<List<TaskDTO>> apiResponse = new APIResponse<>();
            apiResponse.setMessage("No tasks found");
            apiResponse.setData(Collections.emptyList());
            return apiResponse;
        }

        List<TaskDTO> dtos = tasks.stream().map(this::buildDTO).toList();

        APIResponse<List<TaskDTO>> apiResponse = new APIResponse<>();
        apiResponse.setMessage("User tasks retrieved successfully");
        apiResponse.setData(dtos);
        return apiResponse;
    }

    @Override
    public APIResponse<TaskDTO> getTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        APIResponse<TaskDTO> apiResponse = new APIResponse<>();
        apiResponse.setMessage("Task retrieved successfully");
        apiResponse.setData(buildDTO(task));
        return apiResponse;
    }

    @Override
    public APIResponse<Void> updateTask(Long id, CreateTask request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        task.setText(request.getText());
        task.setPriority(request.getPriority());
        task.setDueDate(request.getDueDate());
        task.setCategory(request.getCategory());
        if (request.getPoints() != null) task.setPoints(request.getPoints());

        if (request.getAssignedToId() != null) {
            User assignedTo = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            task.setAssignedTo(assignedTo);
        }

        taskRepository.save(task);

        APIResponse<Void> apiResponse = new APIResponse<>();
        apiResponse.setMessage("Task updated successfully");
        return apiResponse;
    }

    @Override
    public APIResponse<Void> toggleTaskCompletion(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        task.setCompleted(!task.isCompleted());
        taskRepository.save(task);

        APIResponse<Void> apiResponse = new APIResponse<>();
        apiResponse.setMessage(task.isCompleted() ? "Task marked as completed" : "Task marked as pending");
        return apiResponse;
    }

    @Override
    public APIResponse<Void> deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new ResourceNotFoundException("Task not found");
        }
        taskRepository.deleteById(id);

        APIResponse<Void> apiResponse = new APIResponse<>();
        apiResponse.setMessage("Task deleted successfully");
        return apiResponse;
    }

    private TaskDTO buildDTO(Task task) {
        TaskDTO dto = new TaskDTO();
        dto.setId(task.getId());
        dto.setText(task.getText());
        dto.setPriority(task.getPriority());
        dto.setDueDate(task.getDueDate());
        dto.setCompleted(task.isCompleted());
        dto.setCategory(task.getCategory());
        dto.setPoints(task.getPoints());
        if (task.getAssignedTo() != null) {
            dto.setAssignedTo(userMapper.toDTO(task.getAssignedTo()));
        }
        dto.setCreatedAt(task.getCreatedAt());
        dto.setUpdatedAt(task.getUpdatedAt());
        return dto;
    }
}
