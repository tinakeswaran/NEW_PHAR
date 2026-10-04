package com.example.epharmacy.service;

import com.example.epharmacy.entity.Medicine;
import com.example.epharmacy.entity.User;
import com.example.epharmacy.entity.WishlistItem;
import com.example.epharmacy.exception.ResourceNotFoundException;
import com.example.epharmacy.repository.MedicineRepository;
import com.example.epharmacy.repository.UserRepository;
import com.example.epharmacy.repository.WishlistRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final MedicineRepository medicineRepository;

    public WishlistService(WishlistRepository wishlistRepository, UserRepository userRepository, MedicineRepository medicineRepository) {
        this.wishlistRepository = wishlistRepository;
        this.userRepository = userRepository;
        this.medicineRepository = medicineRepository;
    }

    public List<Medicine> getUserWishlist(Long userId) {
        return wishlistRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(WishlistItem::getMedicine)
                .collect(Collectors.toList());
    }

    public List<Long> getUserWishlistMedicineIds(Long userId) {
        return wishlistRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(item -> item.getMedicine().getId())
                .collect(Collectors.toList());
    }

    public boolean isInWishlist(Long userId, Long medicineId) {
        return wishlistRepository.existsByUserIdAndMedicineId(userId, medicineId);
    }

    @Transactional
    public boolean toggleWishlist(Long userId, Long medicineId) {
        if (wishlistRepository.existsByUserIdAndMedicineId(userId, medicineId)) {
            wishlistRepository.deleteByUserIdAndMedicineId(userId, medicineId);
            return false; // Removed
        } else {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
            Medicine medicine = medicineRepository.findById(medicineId)
                    .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with id: " + medicineId));

            wishlistRepository.save(new WishlistItem(user, medicine));
            return true; // Added
        }
    }

    @Transactional
    public void removeFromWishlist(Long userId, Long medicineId) {
        wishlistRepository.deleteByUserIdAndMedicineId(userId, medicineId);
    }
}
