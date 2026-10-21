package com.studentswap.backend.repository;
import com.studentswap.backend.entity.BuyerMessage;
import org.springframework.data.jpa.repository.JpaRepository;
public interface BuyerMessageRepository extends JpaRepository<BuyerMessage,Long> { java.util.List<BuyerMessage> findBySellerIdOrderByCreatedAtDesc(Long sellerId); java.util.List<BuyerMessage> findByBuyerIdOrderByCreatedAtDesc(Long buyerId); java.util.List<BuyerMessage> findByListingId(Long listingId); }
