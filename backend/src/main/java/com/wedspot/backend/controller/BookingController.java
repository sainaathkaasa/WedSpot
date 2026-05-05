package com.wedspot.backend.controller;

import com.wedspot.backend.Model.*;
import com.wedspot.backend.Model.Entity.BookingStatus;
import com.wedspot.backend.services.implementation.BookingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
@Slf4j
public class BookingController {

    private final BookingService bookingService;

    @GetMapping
    public ResponseEntity<APIResponse<List<BookingDTO>>> getAllBookings() {
        APIResponse<List<BookingDTO>> apiResponse = bookingService.getAllBookings();
        return ResponseEntity.ok().body(apiResponse);
    }

    @GetMapping("/client/{id}")
    public ResponseEntity<APIResponse<List<BookingDTO>>> getClientBookings(@PathVariable Long id) {
        log.info("Received ID {}", id);
        APIResponse<List<BookingDTO>> apiResponse = bookingService.getClientBookings(id);
        return ResponseEntity.ok().body(apiResponse);
    }

    @GetMapping("/vendor/{id}")
    public ResponseEntity<APIResponse<List<BookingDTO>>> getVendorBookings(@PathVariable Long id) {
        APIResponse<List<BookingDTO>> apiResponse = bookingService.getVendorBookings(id);
        return ResponseEntity.ok().body(apiResponse);
    }

    @GetMapping("/{id}")
    public ResponseEntity<APIResponse<BookingDTO>> getBooking(@PathVariable Long id) {
        APIResponse<BookingDTO> apiResponse = bookingService.getBooking(id);
        return ResponseEntity.ok().body(apiResponse);
    }

    @PostMapping
    public ResponseEntity<APIResponse<BookingDTO>> createBooking(@RequestBody BookingRequest request) {
        APIResponse<BookingDTO> apiResponse = bookingService.createBooking(request);
        return ResponseEntity.status(201).body(apiResponse);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<APIResponse<Void>> updateBookingStatus(@PathVariable Long id, @RequestParam BookingStatus status) {
        APIResponse<Void> apiResponse = bookingService.updateBookingStatus(id, status);
        return ResponseEntity.ok().body(apiResponse);
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<APIResponse<Void>> cancelBooking(@PathVariable Long id) {
        APIResponse<Void> apiResponse = bookingService.cancelBooking(id);
        return ResponseEntity.ok().body(apiResponse);
    }
}
