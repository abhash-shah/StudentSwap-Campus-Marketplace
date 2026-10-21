package com.studentswap.backend.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity @Table(name="buyer_messages")
public class BuyerMessage {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false) private Long listingId;
 @Column(nullable=false) private Long buyerId;
 @Column(nullable=false) private Long sellerId;
 @Column(nullable=false,length=1000) private String message;
 @Column(nullable=false) private LocalDateTime createdAt=LocalDateTime.now();
 public Long getId(){return id;} public Long getListingId(){return listingId;} public void setListingId(Long v){listingId=v;}
 public Long getBuyerId(){return buyerId;} public void setBuyerId(Long v){buyerId=v;}
 public Long getSellerId(){return sellerId;} public void setSellerId(Long v){sellerId=v;}
 public String getMessage(){return message;} public void setMessage(String v){message=v;}
 public LocalDateTime getCreatedAt(){return createdAt;}
}
