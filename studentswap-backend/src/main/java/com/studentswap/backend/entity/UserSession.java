package com.studentswap.backend.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity @Table(name="user_sessions")
public class UserSession {
 @Id @Column(length=64) private String tokenHash;
 @Column(nullable=false) private Long userId;
 @Column(nullable=false) private LocalDateTime expiresAt;
 public String getTokenHash(){return tokenHash;} public void setTokenHash(String v){tokenHash=v;}
 public Long getUserId(){return userId;} public void setUserId(Long v){userId=v;}
 public LocalDateTime getExpiresAt(){return expiresAt;} public void setExpiresAt(LocalDateTime v){expiresAt=v;}
}
