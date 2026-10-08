import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartItem } from '../components/CartItem';
import { PromotionalCoupons } from '../components/PromotionalCoupons';
import { couponService } from '../services/couponService';
import { formatINR } from '../utils/formatters';
import { 
  ShoppingBag, 
  ArrowRight, 
  Trash2, 
  FileText, 
  ShieldCheck, 
  Truck, 
  AlertCircle,
  Clock,
  Tag,
  CheckCircle2,
  X
} from 'lucide-react';

export const Cart = () => {
  const { cart, totalPrice, itemCount, clearCart, loading, cartError } = useCart();
  const navigate = useNavigate();

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const stored = sessionStorage.getItem('valence_applied_coupon');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMessage, setCouponMessage] = useState(null);

  const hasRxItem = cart?.items?.some((item) => item.medicine.requiresPrescription || item.quantity > 100);

  const applyCouponCode = async (codeToApply) => {
    const code = (codeToApply || couponInput).trim().toUpperCase();
    if (!code) return;
    setCouponLoading(true);
    setCouponMessage(null);
    try {
      const result = await couponService.validateCoupon(code, totalPrice);
      if (result.valid) {
        const couponData = {
          code: result.couponCode || result.coupon?.code || code,
          discountAmount: Number(result.discountAmount || 0),
          finalTotal: Number(result.finalTotal || (totalPrice - result.discountAmount)),
          coupon: result.coupon || { code: result.couponCode }
        };
        setAppliedCoupon(couponData);
        sessionStorage.setItem('valence_applied_coupon', JSON.stringify(couponData));
        setCouponMessage({ type: 'success', text: `Coupon "${code}" applied! You save ${formatINR(result.discountAmount)}` });
      } else {
        setCouponMessage({ type: 'error', text: result.message || 'Invalid coupon code.' });
      }
    } catch (err) {
      setCouponMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Coupon could not be applied. Minimum cart criteria may apply.' 
      });
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    sessionStorage.removeItem('valence_applied_coupon');
    setCouponMessage(null);
    setCouponInput('');
  };

  const discountAmount = appliedCoupon?.discountAmount || 0;
  const finalPayable = Math.max(0, totalPrice - discountAmount);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-sand-300 dark:border-forest-700 border-t-forest-900 dark:border-t-emerald-400 animate-spin mx-auto"></div>
        <p className="text-xs font-bold text-sand-500 dark:text-sand-400 uppercase tracking-widest">
          Synchronizing Basket…
        </p>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-xl mx-auto my-16 bg-white dark:bg-forest-900/40 p-12 rounded-4xl text-center border border-sand-200 dark:border-forest-800 shadow-elevated space-y-5 animate-fade-in">
        <div className="inline-flex p-5 bg-sand-100 dark:bg-forest-950 text-forest-800 dark:text-emerald-400 rounded-3xl border border-sand-200 dark:border-forest-800">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-forest-950 dark:text-sand-100 tracking-tight">Your Dispensary Basket is Empty</h2>
        <p className="text-xs text-sand-500 dark:text-sand-400 font-medium max-w-sm mx-auto leading-relaxed">
          No medications or clinical wellness items have been selected for this session yet.
        </p>
        <div>
          <Link
            to="/medicines"
            className="inline-flex items-center gap-2 bg-forest-900 hover:bg-forest-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-sand-50 dark:text-forest-950 font-bold px-7 py-3 rounded-full transition text-xs shadow-sm hover:shadow"
          >
            <span>Explore Dispensary Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6 sm:py-8 max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-sand-200 dark:border-forest-800 pb-5">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-forest-700 dark:text-emerald-400">
            Selected Formulations
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-forest-950 dark:text-sand-100 tracking-tight mt-1">
            Prescription & Care Basket
          </h1>
          <p className="text-xs sm:text-sm text-sand-500 dark:text-sand-400 font-medium mt-1">
            {itemCount} active item{itemCount === 1 ? '' : 's'} staged for clinical fulfillment.
          </p>
        </div>

        <button
          onClick={clearCart}
          className="self-start sm:self-auto text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/40 transition"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear All Items
        </button>
      </div>

      {cartError && (
        <div className="rounded-2xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/50 p-4 text-xs font-medium text-rose-800 dark:text-rose-300 flex items-center gap-2" role="alert">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{cartError}</span>
        </div>
      )}

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Items List */}
        <div className="lg:col-span-8 space-y-4">
          {hasRxItem && (
            <div className="p-4 rounded-2.5xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300/80 dark:border-amber-700/60 text-xs flex items-start gap-3 transition-colors">
              <FileText className="w-5 h-5 text-amber-700 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-amber-950 dark:text-amber-100 block">
                  Prescription Verification Required
                </span>
                <span className="text-amber-800 dark:text-amber-300/90 leading-relaxed block mt-0.5">
                  One or more medications in your basket requires an authorized doctor prescription. You will be prompted to select or upload an active approved prescription during checkout.
                </span>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {cart.items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          <div className="pt-2">
            <Link
              to="/medicines"
              className="inline-flex items-center text-xs font-bold text-forest-700 dark:text-emerald-400 hover:text-forest-950 dark:hover:text-sand-100 gap-1.5 transition"
            >
              ← Continue adding from catalog
            </Link>
          </div>
        </div>

        {/* Right Column: Sticky Summary & Coupon Card */}
        <div className="lg:col-span-4 space-y-4 sticky top-28">
          {/* Coupon Box */}
          <div className="bg-white dark:bg-forest-900/40 p-5 rounded-3xl border border-sand-200 dark:border-forest-800/80 shadow-subtle space-y-3">
            <div className="flex items-center gap-2 text-xs font-extrabold text-forest-950 dark:text-sand-100">
              <Tag className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Promotional Offers & Coupons</span>
            </div>

            {appliedCoupon ? (
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <span className="text-xs font-black text-emerald-900 dark:text-emerald-200 block">
                      {appliedCoupon.code} Applied
                    </span>
                    <span className="text-[11px] text-emerald-700 dark:text-emerald-400">
                      Savings of {formatINR(appliedCoupon.discountAmount)}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="p-1 rounded-lg text-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition"
                  title="Remove coupon"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter Coupon (e.g. WELCOME10)"
                    className="flex-1 bg-sand-50 dark:bg-forest-950 border border-sand-200 dark:border-forest-700 rounded-xl px-3 py-2 text-xs font-semibold text-forest-950 dark:text-sand-100 outline-none uppercase placeholder:normal-case placeholder:font-normal"
                  />
                  <button
                    type="button"
                    onClick={() => applyCouponCode(couponInput)}
                    disabled={couponLoading || !couponInput.trim()}
                    className="px-3.5 py-2 rounded-xl bg-forest-900 dark:bg-emerald-600 text-sand-50 dark:text-forest-950 text-xs font-bold hover:bg-forest-800 transition disabled:opacity-50"
                  >
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </div>

                {couponMessage && (
                  <p className={`text-[11px] font-medium ${couponMessage.type === 'success' ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {couponMessage.text}
                  </p>
                )}

                {/* Promotional Coupons List */}
                <div className="pt-2 border-t border-sand-200 dark:border-forest-800">
                  <PromotionalCoupons
                    onSelectCoupon={(code) => {
                      setCouponInput(code);
                      applyCouponCode(code);
                    }}
                    appliedCouponCode={appliedCoupon?.code}
                    cartTotal={totalPrice}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Sticky Summary Card */}
          <div className="bg-white dark:bg-forest-900/40 p-6 sm:p-7 rounded-3xl border border-sand-200 dark:border-forest-800/80 shadow-elevated space-y-6">
            <h3 className="font-extrabold text-forest-950 dark:text-sand-100 text-lg border-b border-sand-100 dark:border-forest-800 pb-3">
              Order Summary
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-sand-600 dark:text-sand-400">
                <span>Gross Subtotal ({itemCount} units)</span>
                <span className="font-bold text-forest-950 dark:text-sand-100">{formatINR(totalPrice)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-medium">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span className="font-bold">- {formatINR(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-sand-600 dark:text-sand-400">
                <span className="flex items-center gap-1">
                  <span>Express Courier Dispatch</span>
                  <Truck className="w-3.5 h-3.5 text-sand-400" />
                </span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400 uppercase">Complimentary</span>
              </div>

              <div className="flex justify-between text-sand-600 dark:text-sand-400">
                <span>Pharmacist Clearance Fee</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400 uppercase">₹0.00</span>
              </div>

              <div className="pt-3 border-t border-sand-200 dark:border-forest-800 flex justify-between items-baseline">
                <span className="text-sm font-extrabold text-forest-950 dark:text-sand-100">Final Total</span>
                <span className="text-2xl font-black text-forest-950 dark:text-sand-100">
                  {formatINR(finalPayable)}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 px-6 rounded-2xl bg-forest-900 hover:bg-forest-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-sand-50 dark:text-forest-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition duration-200 shadow-md hover:shadow-lg active:scale-95"
            >
              <span>Proceed to Patient Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="space-y-2 pt-2 text-[11px] text-sand-500 dark:text-sand-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>Complies with Good Pharmacy Practice</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-sand-400 flex-shrink-0" />
                <span>Dispatched within 24 hours across India</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
