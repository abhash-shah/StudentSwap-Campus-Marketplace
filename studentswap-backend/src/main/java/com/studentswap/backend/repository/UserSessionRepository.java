package com.studentswap.backend.repository;
import com.studentswap.backend.entity.UserSession;
import org.springframework.data.jpa.repository.JpaRepository;
public interface UserSessionRepository extends JpaRepository<UserSession,String> { java.util.List<UserSession> findByUserId(Long userId); }
