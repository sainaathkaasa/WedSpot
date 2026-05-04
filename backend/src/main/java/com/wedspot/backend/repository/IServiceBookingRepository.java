package com.wedspot.backend.repository;

import com.wedspot.backend.Model.Entity.ServiceBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IServiceBookingRepository extends JpaRepository<ServiceBooking, Long> {

}
