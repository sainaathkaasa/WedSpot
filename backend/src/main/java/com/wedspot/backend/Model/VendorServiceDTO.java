package com.wedspot.backend.Model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.wedspot.backend.Model.Entity.Review;
import lombok.Data;

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

    private double price;

    private String location;

    private String category;

    private double quantity;

    private UserDTO vendor;

    private List<ReviewDTO> reviews;
}
