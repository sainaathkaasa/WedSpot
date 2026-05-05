package com.wedspot.backend.controller;

import com.wedspot.backend.Model.APIResponse;
import com.wedspot.backend.Model.CreateTask;
import com.wedspot.backend.Model.TaskDTO;
import com.wedspot.backend.services.ITaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final ITaskService taskService;

    @PostMapping
    public ResponseEntity<APIResponse<TaskDTO>> createTask(@RequestBody @Valid CreateTask request) {
        APIResponse<TaskDTO> response = taskService.createTask(request);
        return ResponseEntity.status(201).body(response);
    }

    @GetMapping
    public ResponseEntity<APIResponse<List<TaskDTO>>> getAllTasks() {
        APIResponse<List<TaskDTO>> response = taskService.getAllTasks();
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<APIResponse<TaskDTO>> getTask(@PathVariable Long id) {
        APIResponse<TaskDTO> response = taskService.getTask(id);
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<APIResponse<List<TaskDTO>>> getTasksByUser(@PathVariable Long userId) {
        APIResponse<List<TaskDTO>> response = taskService.getTasksByUser(userId);
        return ResponseEntity.ok().body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<APIResponse<Void>> updateTask(@PathVariable Long id, @RequestBody @Valid CreateTask request) {
        APIResponse<Void> response = taskService.updateTask(id, request);
        return ResponseEntity.ok().body(response);
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<APIResponse<Void>> toggleCompletion(@PathVariable Long id) {
        APIResponse<Void> response = taskService.toggleTaskCompletion(id);
        return ResponseEntity.ok().body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<APIResponse<Void>> deleteTask(@PathVariable Long id) {
        APIResponse<Void> response = taskService.deleteTask(id);
        return ResponseEntity.ok().body(response);
    }
}
