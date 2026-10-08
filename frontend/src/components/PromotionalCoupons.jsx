import React, { useState, useEffect } from 'react';
import { couponService } from '../services/couponService';
import { formatINR } from '../utils/formatters';
import { Tag, Sparkles, Check, Clock, UserCheck, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const PromotionalCoupons = ({ onSelectCoupon, appliedCouponCode, cartTotal = 0 }) => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const data = await couponService.getActiveCoupons();
        setCoupons(data || []);
      } catch (err) {
        console.error('Failed to load active coupons:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  if (loading) {
    return (
      <div className="p-4 text-center text-xs font-semibold text-sand-500 dark:text-sand-400">
        Loading active promotional coupons…
      </div>
    );
  }

  if (!coupons || coupons.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-extrabold text-forest-950 dark:text-sand-100 uppercase tracking-wider">
        <Sparkles className="w-4 h-4 text-amber-500" />
        <span>Available Promotional Coupons</span>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {coupons.map((coupon) => {
          const isApplied = appliedCouponCode?.toUpperCase() === coupon.code.toUpperCase();
          const minAmount = Number(coupon.minOrderAmount || 0);
          const isEligibleByAmount = cartTotal >= minAmount;

          const discountText = coupon.discountType === 'PERCENTAGE' 
            ? `${coupon.discountValue}% OFF` 
            : `${formatINR(coupon.discountValue)} OFF`;

          const expiryText = coupon.expiresAt 
            ? new Date(coupon.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
            : 'No Expiry';

          return (
            <div
              key={coupon.id || coupon.code}
              className={`p-3.5 rounded-2xl border transition-all relative overflow-hidden ${
                isApplied
                  ? 'bg-emerald-50/90 dark:bg-emerald-950/60 border-emerald-400 dark:border-emerald-600 shadow-sm'
                  : 'bg-sand-50/80 dark:bg-forest-950/80 border-sand-200 dark:border-forest-800 hover:border-sand-300 dark:hover:border-forest-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-black text-xs px-2.5 py-0.5 rounded-lg bg-forest-900 text-sand-50 dark:bg-emerald-500 dark:text-forest-950 tracking-wider">
                      {coupon.code}
                    </span>

                    <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400">
                      {discountText}
                    </span>

                    {coupon.firstOrderOnly ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300/70 dark:border-amber-700/60 flex items-center gap-1">
                        <UserCheck className="w-3 h-3" /> FIRST ORDER ONLY
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sand-200 text-forest-800 dark:bg-forest-800 dark:text-sand-300 border border-sand-300 dark:border-forest-700">
                        ALL USERS
                      </span>
                    )}

                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                      Active
                    </span>
                  </div>

                  <p className="text-xs text-sand-600 dark:text-sand-300 font-medium">
                    {coupon.description}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-sand-500 dark:text-sand-400 flex-wrap">
                    <span>
                      Min Order: <strong className="text-forest-950 dark:text-sand-200">{minAmount > 0 ? formatINR(minAmount) : 'None'}</strong>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-sand-400" /> {expiryText}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectCoupon(coupon.code)}
                  disabled={isApplied}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 flex-shrink-0 ${
                    isApplied
                      ? 'bg-emerald-600 text-white cursor-default'
                      : 'bg-forest-900 hover:bg-forest-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-sand-50 dark:text-forest-950 shadow-sm'
                  }`}
                >
                  {isApplied ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Applied
                    </>
                  ) : (
                    'Apply'
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
