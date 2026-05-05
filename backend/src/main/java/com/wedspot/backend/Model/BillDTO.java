package com.wedspot.backend.Model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class BillDTO {
    private Long id;
    private String invoiceNumber;
    private UserDTO client;
    private BigDecimal amount;
    private LocalDate date;
    private String status;
    private LocalDateTime createdAt;
}
