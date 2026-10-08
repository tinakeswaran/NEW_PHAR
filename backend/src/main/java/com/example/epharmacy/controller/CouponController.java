package com.example.epharmacy.controller;

import com.example.epharmacy.entity.Coupon;
import com.example.epharmacy.entity.User;
import com.example.epharmacy.service.CouponService;
import com.example.epharmacy.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/coupons")
public class CouponController {

    private final CouponService couponService;
    private final UserService userService;

    public CouponController(CouponService couponService, UserService userService) {
        this.couponService = couponService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<Coupon>> getActiveCoupons() {
        return ResponseEntity.ok(couponService.getActiveCoupons());
    }

    @RequestMapping(value = "/validate", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseEntity<Map<String, Object>> validateCoupon(
            Authentication authentication,
            @RequestParam String code,
            @RequestParam(required = false) BigDecimal amount,
            @RequestParam(required = false) BigDecimal cartTotal) {
        BigDecimal effectiveAmount = amount != null ? amount : (cartTotal != null ? cartTotal : BigDecimal.ZERO);
        Long userId = null;
        if (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getPrincipal())) {
            try {
                User user = userService.getUserByEmail(authentication.getName());
                if (user != null) {
                    userId = user.getId();
                }
            } catch (Exception ignored) {}
        }
        return ResponseEntity.ok(couponService.validateAndCalculateDiscount(code, effectiveAmount, userId));
    }
}
