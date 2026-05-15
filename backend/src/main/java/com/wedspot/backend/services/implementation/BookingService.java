package com.wedspot.backend.services.implementation;

import com.wedspot.backend.Model.APIResponse;
import com.wedspot.backend.Model.BookingDTO;
import com.wedspot.backend.Model.BookingRequest;
import com.wedspot.backend.Model.Entity.*;
import com.wedspot.backend.Model.VendorServiceDTO;
import com.wedspot.backend.exception.ResourceNotFoundException;
import com.wedspot.backend.mappers.IBookingMapper;
import com.wedspot.backend.mappers.IVendorServiceMapper;
import com.wedspot.backend.repository.IBookingRepository;
import com.wedspot.backend.repository.IUserRepository;
import com.wedspot.backend.repository.IVendorServiceRepository;
import com.wedspot.backend.services.IBookingService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class BookingService implements IBookingService {

    private final IBookingRepository bookingRepository;
    private final IUserRepository userRepository;
    private final IVendorServiceRepository vendorServiceRepository;

    private final IBookingMapper bookingMapper;
    private final IVendorServiceMapper vendorServiceMapper;

    @Override
    public APIResponse<List<BookingDTO>> getAllBookings() {
        List<Booking> allBookings = bookingRepository.findAll();
        if (allBookings.isEmpty()) {
            APIResponse<List<BookingDTO>> apiResponse = new APIResponse<>();
            apiResponse.setMessage("No bookings found");
            apiResponse.setData(Collections.emptyList());
            return apiResponse;
        }
        List<BookingDTO> allBookingDTOs = allBookings.stream()
                .map(this::enrichBookingDTO)
                .toList();
        APIResponse<List<BookingDTO>> apiResponse = new APIResponse<>();
        apiResponse.setMessage("All bookings fetched successfully");
        apiResponse.setData(allBookingDTOs);
        return apiResponse;
    }

    @Override
    public APIResponse<List<BookingDTO>> getClientBookings(Long clientId) {
        List<Booking> allBookings = bookingRepository.findByClientId(clientId);
        if (allBookings.isEmpty()) {
            APIResponse<List<BookingDTO>> apiResponse = new APIResponse<>();
            apiResponse.setMessage("No bookings found");
            apiResponse.setData(Collections.emptyList());
            return apiResponse;
        }

        List<BookingDTO> allBookingDTOs = allBookings.stream()
                .map(this::enrichBookingDTO)
                .toList();

        APIResponse<List<BookingDTO>> apiResponse = new APIResponse<>();
        apiResponse.setMessage("All bookings fetched successfully");
        apiResponse.setData(allBookingDTOs);
        return apiResponse;
    }

    @Override
    public APIResponse<List<BookingDTO>> getVendorBookings(Long vendorId) {
        List<Booking> allBookings = bookingRepository.findByVendorId(vendorId);

        if (allBookings.isEmpty()) {
            APIResponse<List<BookingDTO>> apiResponse = new APIResponse<>();
            apiResponse.setMessage("No bookings found");
            apiResponse.setData(Collections.emptyList());
            return apiResponse;
        }
        List<BookingDTO> allBookingDTOs = allBookings.stream()
                .map(this::enrichBookingDTO)
                .toList();

        APIResponse<List<BookingDTO>> apiResponse = new APIResponse<>();
        apiResponse.setMessage("All bookings fetched successfully");
        apiResponse.setData(allBookingDTOs);
        return apiResponse;
    }

    @Override
    public APIResponse<BookingDTO> getBooking(Long id){

        Booking booking = bookingRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        BookingDTO bookingDTO = bookingMapper.toDTO(booking);

        List<ServiceBooking> serviceBookingList = booking.getServiceBookings();

        List<VendorServiceDTO> vendorServiceList = serviceBookingList.stream()
                .map(ServiceBooking::getService)
                .filter(Objects::nonNull) // Skips any null services
                .map(vendorServiceMapper::toDTO)
                .toList();

        bookingDTO.setServices(vendorServiceList);

        APIResponse<BookingDTO> apiResponse = new  APIResponse<>();
        apiResponse.setMessage("Booking retrieved successfully");
        apiResponse.setData(bookingDTO);

        return apiResponse;

    }

    @Override
    public APIResponse<Void> updateBookingStatus(Long id, BookingStatus status) {
        Booking fetchedBooking = bookingRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        fetchedBooking.setStatus(status);

        bookingRepository.save(fetchedBooking);

        APIResponse<Void> apiResponse = new APIResponse<>();
        if (BookingStatus.CONFIRMED.equals(status)) {
            apiResponse.setMessage("Booking has been confirmed.");
        } else {
            apiResponse.setMessage("Booking has been updated to " + status + " successfully");
        }
        return apiResponse;

    }

    @Override
    public APIResponse<BookingDTO> createBooking(BookingRequest request) {
        String userEmail = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User client = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found"));

        Booking booking = new Booking();
        booking.setClient(client);
        booking.setEventDate(request.getEventDate());
        booking.setEventLocation(request.getEventLocation());
        booking.setGuestCount(request.getGuestCount());
        booking.setNotes(request.getNotes());
        booking.setStatus(BookingStatus.PENDING);

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<ServiceBooking> bookingServices = new ArrayList<>();

        if (request.getServiceIds() != null) {
            for (Long serviceId : request.getServiceIds()) {
                if (serviceId == null) continue; // Skip invalid IDs
                
                VendorService vendorService = vendorServiceRepository.findById(serviceId)
                        .orElseThrow(() -> new ResourceNotFoundException("Service not found with ID: " + serviceId));

                ServiceBooking bs = new ServiceBooking();
                bs.setBooking(booking);
                bs.setService(vendorService);
                bs.setPrice(vendorService.getPrice());
                bs.setQuantity(1); // Default quantity
                bs.setStatus(BookingStatus.PENDING);

                bookingServices.add(bs);
                totalAmount = totalAmount.add(bs.getPrice());
            }
        }

        booking.setServiceBookings(bookingServices);
        booking.setTotalAmount(totalAmount);
        booking.setAdvancePaid(BigDecimal.ZERO);

        Booking savedBooking = bookingRepository.save(booking);

        APIResponse<BookingDTO> apiResponse = new APIResponse<>();
        apiResponse.setMessage("Booking created successfully");
        apiResponse.setData(enrichBookingDTO(savedBooking));
        apiResponse.setOk(true);
        return apiResponse;
    }

    private BookingDTO enrichBookingDTO(Booking booking) {
        BookingDTO dto = bookingMapper.toDTO(booking);

        List<VendorServiceDTO> services = booking.getServiceBookings().stream()
                .map(ServiceBooking::getService)
                .filter(Objects::nonNull)
                .map(vendorServiceMapper::toDTO)
                .toList();

        dto.setServices(services);
        return dto;
    }

    @Override
    public APIResponse<Void> cancelBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (BookingStatus.CANCELLED.equals(booking.getStatus())) {
            APIResponse<Void> apiResponse = new APIResponse<>();
            apiResponse.setMessage("Booking is already cancelled");
            return apiResponse;
        }

        if (BookingStatus.COMPLETED.equals(booking.getStatus())) {
            APIResponse<Void> apiResponse = new APIResponse<>();
            apiResponse.setMessage("Cannot cancel a completed booking");
            return apiResponse;
        }

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);

        APIResponse<Void> apiResponse = new APIResponse<>();
        apiResponse.setMessage("Booking cancelled successfully");
        return apiResponse;
    }
}
