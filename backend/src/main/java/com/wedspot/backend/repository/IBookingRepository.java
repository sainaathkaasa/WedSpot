package com.wedspot.backend.repository;

import com.wedspot.backend.Model.Entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface IBookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByClientId(Long id);

    @Query("SELECT b FROM Booking b JOIN b.serviceBookings bs JOIN bs.service s WHERE s.vendor.id = :id")
    List<Booking> findByVendorId(@Param("id") Long id);

    @Query("SELECT COUNT(b) > 0 FROM Booking b " +
            "JOIN b.serviceBookings bs " +
            "JOIN bs.service s " +
            "WHERE b.client.id = :clientId AND s.id = :serviceId AND b.status != 'CANCELLED'")
    boolean isServiceAlreadyBookedByClient(@Param("clientId") Long clientId, @Param("serviceId") Long serviceId);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.createdAt >= :start AND b.createdAt < :end")
    long countByCreatedAtBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT SUM(b.totalAmount) FROM Booking b WHERE b.status = 'COMPLETED' AND b.createdAt >= :start AND b.createdAt < :end")
    BigDecimal sumTotalAmountByStatusAndCreatedAtBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
