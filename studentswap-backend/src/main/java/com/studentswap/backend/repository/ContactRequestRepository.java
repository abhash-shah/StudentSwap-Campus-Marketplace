
package com.studentswap.backend.repository;

import com.studentswap.backend.entity.ContactRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContactRequestRepository
        extends JpaRepository<ContactRequest, Long> {

    List<ContactRequest> findByStatusOrderByCreatedAtDesc(String status);
}
