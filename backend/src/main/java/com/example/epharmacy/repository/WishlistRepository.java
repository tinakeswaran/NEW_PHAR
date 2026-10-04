package com.example.epharmacy.repository;

import com.example.epharmacy.entity.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<WishlistItem, Long> {
    List<WishlistItem> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<WishlistItem> findByUserIdAndMedicineId(Long userId, Long medicineId);
    boolean existsByUserIdAndMedicineId(Long userId, Long medicineId);
    void deleteByUserIdAndMedicineId(Long userId, Long medicineId);
}
