package com.example.epharmacy.service;

import com.example.epharmacy.entity.Coupon;
import com.example.epharmacy.entity.OrderStatus;
import com.example.epharmacy.exception.BadRequestException;
import com.example.epharmacy.exception.ResourceNotFoundException;
import com.example.epharmacy.repository.CouponRepository;
import com.example.epharmacy.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CouponService {

    private final CouponRepository couponRepository;
    private final OrderRepository orderRepository;

    public CouponService(CouponRepository couponRepository, OrderRepository orderRepository) {
        this.couponRepository = couponRepository;
        this.orderRepository = orderRepository;
    }

    public List<Coupon> getActiveCoupons() {
        return couponRepository.findByIsActiveTrue();
    }

    public Map<String, Object> validateAndCalculateDiscount(String code, BigDecimal orderAmount) {
        return validateAndCalculateDiscount(code, orderAmount, null);
    }

    public Map<String, Object> validateAndCalculateDiscount(String code, BigDecimal orderAmount, Long userId) {
        if (code == null || code.trim().isEmpty()) {
            throw new BadRequestException("Coupon code is required");
        }

        Coupon coupon = couponRepository.findByCodeIgnoreCase(code.trim())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid coupon code: " + code));

        if (!Boolean.TRUE.equals(coupon.getIsActive())) {
            throw new BadRequestException("This coupon is no longer active");
        }

        if (coupon.getExpiresAt() != null && coupon.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("This coupon has expired");
        }

        if (Boolean.TRUE.equals(coupon.getFirstOrderOnly()) && userId != null) {
            boolean hasPreviousOrders = orderRepository.existsByUserIdAndOrderStatusNot(userId, OrderStatus.CANCELLED);
            if (hasPreviousOrders) {
                throw new BadRequestException("Coupon " + coupon.getCode() + " is valid for first-time orders only");
            }
        }

        if (coupon.getMinOrderAmount() != null && orderAmount.compareTo(coupon.getMinOrderAmount()) < 0) {
            throw new BadRequestException("Minimum order of ₹" + coupon.getMinOrderAmount() + " required to apply coupon " + coupon.getCode());
        }

        BigDecimal discount = BigDecimal.ZERO;
        if ("PERCENTAGE".equalsIgnoreCase(coupon.getDiscountType())) {
            discount = orderAmount.multiply(coupon.getDiscountValue())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            if (coupon.getMaxDiscountAmount() != null && discount.compareTo(coupon.getMaxDiscountAmount()) > 0) {
                discount = coupon.getMaxDiscountAmount();
            }
        } else if ("FLAT".equalsIgnoreCase(coupon.getDiscountType())) {
            discount = coupon.getDiscountValue();
        }

        if (discount.compareTo(orderAmount) > 0) {
            discount = orderAmount;
        }

        BigDecimal finalTotal = orderAmount.subtract(discount).setScale(2, RoundingMode.HALF_UP);

        Map<String, Object> result = new HashMap<>();
        result.put("valid", true);
        result.put("couponCode", coupon.getCode());
        result.put("description", coupon.getDescription());
        result.put("discountType", coupon.getDiscountType());
        result.put("discountValue", coupon.getDiscountValue());
        result.put("minOrderAmount", coupon.getMinOrderAmount());
        result.put("firstOrderOnly", Boolean.TRUE.equals(coupon.getFirstOrderOnly()));
        result.put("discountAmount", discount);
        result.put("orderAmount", orderAmount);
        result.put("finalTotal", finalTotal);
        return result;
    }
}
