package com.wedspot.backend.mappers;

import com.wedspot.backend.Model.Entity.Review;
import com.wedspot.backend.Model.ReviewDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

@Mapper(
        componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        uses = {IUserMapper.class}
)
public interface IReviewMapper {

    @Mapping(target = "serviceId", ignore = true)
    @Mapping(target = "serviceName", ignore = true)
    @Mapping(target = "reviewer", ignore = true)
    ReviewDTO toDTO(Review review);
}
    