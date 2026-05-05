package com.wedspot.backend.mappers;

import com.wedspot.backend.Model.Entity.VendorService;
import com.wedspot.backend.Model.VendorServiceDTO;
import com.wedspot.backend.Model.VendorServiceRequest;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

@Mapper(
        componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        uses = {IReviewMapper.class, IUserMapper.class}
)
public interface IVendorServiceMapper {

    VendorService toEntity(VendorServiceDTO vendorServiceDTO);

    VendorServiceDTO toDTO(VendorService vendorService);

    VendorService toEntity(VendorServiceRequest vendorService);

    void updateEntityFromRequest(VendorServiceRequest request, @MappingTarget VendorService vendorService);
}
