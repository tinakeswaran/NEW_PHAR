package com.example.epharmacy.controller;

import com.example.epharmacy.entity.Medicine;
import com.example.epharmacy.entity.User;
import com.example.epharmacy.service.UserService;
import com.example.epharmacy.service.WishlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@PreAuthorize("hasRole('USER')")
public class WishlistController {

    private final WishlistService wishlistService;
    private final UserService userService;

    public WishlistController(WishlistService wishlistService, UserService userService) {
        this.wishlistService = wishlistService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<Medicine>> getWishlist(Authentication authentication) {
        User user = userService.getUserByEmail(authentication.getName());
        return ResponseEntity.ok(wishlistService.getUserWishlist(user.getId()));
    }

    @GetMapping("/ids")
    public ResponseEntity<List<Long>> getWishlistIds(Authentication authentication) {
        User user = userService.getUserByEmail(authentication.getName());
        return ResponseEntity.ok(wishlistService.getUserWishlistMedicineIds(user.getId()));
    }

    @GetMapping("/check/{medicineId}")
    public ResponseEntity<Map<String, Boolean>> checkWishlist(Authentication authentication, @PathVariable Long medicineId) {
        User user = userService.getUserByEmail(authentication.getName());
        boolean exists = wishlistService.isInWishlist(user.getId(), medicineId);
        return ResponseEntity.ok(Map.of("inWishlist", exists));
    }

    @PostMapping("/toggle/{medicineId}")
    public ResponseEntity<Map<String, Object>> toggleWishlist(Authentication authentication, @PathVariable Long medicineId) {
        User user = userService.getUserByEmail(authentication.getName());
        boolean added = wishlistService.toggleWishlist(user.getId(), medicineId);
        return ResponseEntity.ok(Map.of(
                "medicineId", medicineId,
                "inWishlist", added,
                "message", added ? "Added to wishlist" : "Removed from wishlist"
        ));
    }

    @DeleteMapping("/{medicineId}")
    public ResponseEntity<Map<String, String>> removeFromWishlist(Authentication authentication, @PathVariable Long medicineId) {
        User user = userService.getUserByEmail(authentication.getName());
        wishlistService.removeFromWishlist(user.getId(), medicineId);
        return ResponseEntity.ok(Map.of("message", "Medicine removed from wishlist"));
    }
}
