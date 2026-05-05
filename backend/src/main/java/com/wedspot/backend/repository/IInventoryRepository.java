package com.wedspot.backend.repository;

import com.wedspot.backend.Model.Entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IInventoryRepository extends JpaRepository<Inventory, Long> {
    List<Inventory> findByCategory(String category);
    List<Inventory> findByStatus(String status);
}
