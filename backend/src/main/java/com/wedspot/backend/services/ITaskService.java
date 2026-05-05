package com.wedspot.backend.services;

import com.wedspot.backend.Model.APIResponse;
import com.wedspot.backend.Model.CreateTask;
import com.wedspot.backend.Model.TaskDTO;

import java.util.List;

public interface ITaskService {
    APIResponse<TaskDTO> createTask(CreateTask request);
    APIResponse<List<TaskDTO>> getAllTasks();
    APIResponse<List<TaskDTO>> getTasksByUser(Long userId);
    APIResponse<TaskDTO> getTask(Long id);
    APIResponse<Void> updateTask(Long id, CreateTask request);
    APIResponse<Void> toggleTaskCompletion(Long id);
    APIResponse<Void> deleteTask(Long id);
}
