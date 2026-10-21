
package com.studentswap.backend.repository;

import com.studentswap.backend.entity.Listing;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ListingRepository extends JpaRepository<Listing, Long> {

    List<Listing> findByListingStatus(String listingStatus);

}
