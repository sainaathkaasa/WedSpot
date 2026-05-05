package com.wedspot.backend.repository;

import com.wedspot.backend.Model.Entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ITaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByAssignedToId(Long assignedToId);
    List<Task> findByCompleted(boolean completed);
    List<Task> findByCategory(String category);
}
