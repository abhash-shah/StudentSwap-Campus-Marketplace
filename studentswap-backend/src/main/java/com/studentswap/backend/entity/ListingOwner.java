package com.studentswap.backend.entity;
import jakarta.persistence.*;
@Entity @Table(name="listing_owners")
public class ListingOwner {
 @Id private Long listingId;
 @Column(nullable=false) private Long userId;
 public ListingOwner(){} public ListingOwner(Long l,Long u){listingId=l;userId=u;}
 public Long getListingId(){return listingId;} public Long getUserId(){return userId;}
}
