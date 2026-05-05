package com.wedspot.backend.repository;

import com.wedspot.backend.Model.Entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IBillRepository extends JpaRepository<Bill, Long> {
    List<Bill> findByClientId(Long clientId);
    List<Bill> findByStatus(String status);
    boolean existsByInvoiceNumber(String invoiceNumber);
}
