package com.wedspot.backend.repository;

import com.wedspot.backend.Model.Entity.Request;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IRequestRepository extends JpaRepository<Request, Long> {
    List<Request> findByClientId(Long clientId);
    List<Request> findByVendorId(Long vendorId);
    List<Request> findByStatus(String status);
}
