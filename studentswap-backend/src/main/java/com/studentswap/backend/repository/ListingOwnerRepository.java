package com.studentswap.backend.repository;
import com.studentswap.backend.entity.ListingOwner;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ListingOwnerRepository extends JpaRepository<ListingOwner,Long> { java.util.List<ListingOwner> findByUserId(Long userId); }
