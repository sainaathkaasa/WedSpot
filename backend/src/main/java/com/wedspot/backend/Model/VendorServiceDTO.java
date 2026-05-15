package com.wedspot.backend.Model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class VendorServiceDTO {

    private Long id;

    private String name;

    private String description;

    private String[] tags;

    private String imageUrl;

    private double rating;

    private int ratingCount;

    private BigDecimal price;

    private String location;

    private String category;

    private Integer quantity;

    private UserDTO vendor;

    private List<ReviewDTO> reviews;
}
