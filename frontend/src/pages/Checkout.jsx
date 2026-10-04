import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { orderService } from '../services/orderService';
import { prescriptionService } from '../services/prescriptionService';
import { formatINR } from '../utils/formatters';
import { generateInvoicePDF } from '../utils/invoiceGenerator';
import { 
  MapPin, 
  CreditCard, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle, 
  ShoppingBag, 
  ArrowRight,
  Truck,
  Lock,
  Download,
  Upload,
  Tag
} from 'lucide-react';

export const Checkout = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState(user?.address || '');
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [userPrescriptions, setUserPrescriptions] = useState([]);
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdOrder, setCreatedOrder] = useState(null);

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const stored = sessionStorage.getItem('valence_applied_coupon');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  const rxItemsInCart = cart?.items?.filter((item) => item.medicine.requiresPrescription) || [];
  const hasRxItem = rxItemsInCart.length > 0;

  useEffect(() => {
    if (user?.address) {
      setShippingAddress(user.address);
    } else {
      authService
        .getProfile()
        .then((data) => {
          if (data?.address) {
            setShippingAddress(data.address);
            if (updateUser) updateUser(data);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    if (!cart?.items?.length) {
      setUserPrescriptions([]);
      setSelectedPrescriptionId('');
      return;
    }

    prescriptionService.getUserPrescriptions().then((data) => {
      const validApproved = data.filter((p) => {
        const isApproved = p.status === 'APPROVED';
        if (!isApproved) return false;
        return rxItemsInCart.every((cartItem) =>
          p.medicines?.some((coveredMed) => String(coveredMed.id) === String(cartItem.medicine.id))
        );
      });

      setUserPrescriptions(validApproved);
      setSelectedPrescriptionId((previous) => {
        if (previous && validApproved.some((item) => String(item.id) === String(previous))) {
          return previous;
        }
        return validApproved[0]?.id ? String(validApproved[0].id) : '';
      });
    });
  }, [cart]);

  const discountAmount = appliedCoupon?.discountAmount || 0;
  const finalPayable = Math.max(0, totalPrice - discountAmount);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!shippingAddress.trim()) {
      setError('Please provide a valid delivery address.');
      return;
    }

    if (hasRxItem && !selectedPrescriptionId) {
      setError('An approved doctor prescription covering all restricted medications is required to proceed.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        shippingAddress: shippingAddress.trim(),
        paymentMethod,
        prescriptionId: selectedPrescriptionId ? Number(selectedPrescriptionId) : undefined,
        couponCode: appliedCoupon?.code || undefined,
      };

      const order = await orderService.createOrder(payload);
      setCreatedOrder(order);
      sessionStorage.removeItem('valence_applied_coupon');
      clearCart();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please review your details.');
    } finally {
      setLoading(false);
    }
  };

  // Order Confirmed State
  if (createdOrder) {
    return (
      <div className="max-w-2xl mx-auto my-12 bg-white dark:bg-forest-900/60 rounded-4xl p-8 sm:p-12 border border-sand-200 dark:border-forest-800 shadow-elevated text-center space-y-6 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] uppercase font-black tracking-widest text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-full">
            Order Dispatched to Fulfillment
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-forest-950 dark:text-sand-100 tracking-tight">
            Order #{createdOrder.id} Confirmed
          </h2>
          <p className="text-xs sm:text-sm text-sand-600 dark:text-sand-400 max-w-md mx-auto leading-relaxed">
            Your medications have entered our temperature-guarded clinical fulfillment queue. You will receive active tracking updates as your courier departs.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-sand-50 dark:bg-forest-950/60 border border-sand-200 dark:border-forest-800 text-left text-xs space-y-2 max-w-md mx-auto">
          <div className="flex justify-between">
            <span className="text-sand-500 dark:text-sand-400">Total Billed:</span>
            <span className="font-extrabold text-forest-950 dark:text-sand-100">
              {formatINR(createdOrder.totalAmount || finalPayable)}
            </span>
          </div>
          {createdOrder.discountAmount > 0 && (
            <div className="flex justify-between text-emerald-700 dark:text-emerald-400">
              <span>Coupon Savings ({createdOrder.couponCode}):</span>
              <span className="font-bold">- {formatINR(createdOrder.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-sand-500 dark:text-sand-400">Destination:</span>
            <span className="font-bold text-forest-900 dark:text-sand-200 truncate max-w-[240px]">{createdOrder.shippingAddress}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sand-500 dark:text-sand-400">Payment Gateway:</span>
            <span className="font-bold text-forest-900 dark:text-sand-200">{createdOrder.paymentMethod || paymentMethod} (PAID)</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {/* Download Invoice Button */}
          <button
            onClick={() => generateInvoicePDF(createdOrder, user)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm"
          >
            <Download className="w-4 h-4" /> Download Tax Invoice (PDF)
          </button>

          <Link
            to="/orders"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-forest-900 hover:bg-forest-800 dark:bg-forest-800 dark:hover:bg-forest-700 text-sand-50 font-bold text-xs transition"
          >
            Track Order Status
          </Link>
          <Link
            to="/medicines"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-sand-100 hover:bg-sand-200 dark:bg-forest-900 dark:hover:bg-forest-800 text-forest-900 dark:text-sand-200 font-bold text-xs transition border border-sand-200 dark:border-forest-700"
          >
            Back to Dispensary
          </Link>
        </div>
      </div>
    );
  }

  if (!cart?.items?.length) {
    return (
      <div className="max-w-xl mx-auto my-16 bg-white dark:bg-forest-900/40 p-12 rounded-4xl text-center border border-sand-200 dark:border-forest-800 shadow-elevated space-y-4">
        <ShoppingBag className="w-10 h-10 text-sand-400 mx-auto" />
        <h2 className="text-xl font-black text-forest-950 dark:text-sand-100">Your Basket is Empty</h2>
        <p className="text-xs text-sand-500 dark:text-sand-400">Please add medications from the dispensary catalog before proceeding to checkout.</p>
        <Link to="/medicines" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-forest-900 text-sand-50 text-xs font-bold">
          Explore Medications
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10 py-6 sm:py-8 max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="border-b border-sand-200 dark:border-forest-800 pb-5">
        <span className="text-xs font-black uppercase tracking-widest text-forest-700 dark:text-emerald-400">
          Patient Finalization
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-forest-950 dark:text-sand-100 tracking-tight mt-1">
          Clinical Order Checkout
        </h1>
        <p className="text-xs sm:text-sm text-sand-500 dark:text-sand-400 font-medium mt-1">
          Review shipping destination, verify prescription eligibility, and select payment settlement.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs font-medium text-rose-800 dark:text-rose-300 flex items-center gap-2.5" role="alert">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid */}
      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Delivery Details */}
          <div className="bg-white dark:bg-forest-900/40 p-6 sm:p-8 rounded-3xl border border-sand-200 dark:border-forest-800 shadow-subtle space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-sand-100 dark:border-forest-800">
              <div className="w-8 h-8 rounded-xl bg-forest-900 text-mint-400 dark:bg-emerald-500 dark:text-forest-950 flex items-center justify-center font-black text-xs">
                01
              </div>
              <div>
                <h3 className="font-extrabold text-forest-950 dark:text-sand-100 text-sm">Delivery Destination</h3>
                <p className="text-[11px] text-sand-500 dark:text-sand-400">Provide the direct patient delivery address</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-forest-900 dark:text-sand-200 block">
                Full Street Address, Apartment, City & Postal Code (India)
              </label>
              <textarea
                required
                rows={3}
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="e.g. 104 Richmond Road, Shanthi Nagar, Bengaluru, Karnataka 560025"
                className="w-full bg-sand-50/70 dark:bg-forest-950/70 p-3.5 rounded-2xl border border-sand-200 dark:border-forest-700 text-xs text-forest-950 dark:text-sand-100 outline-none focus:border-forest-700 dark:focus-border-emerald-500 transition"
              />
            </div>
          </div>

          {/* 2. Prescription Requirement Check (If applicable) */}
          {hasRxItem && (
            <div className="bg-white dark:bg-forest-900/40 p-6 sm:p-8 rounded-3xl border border-ochre-200/80 dark:border-ochre-900/60 shadow-subtle space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-sand-100 dark:border-forest-800">
                <div className="w-8 h-8 rounded-xl bg-ochre-600 text-white flex items-center justify-center font-black text-xs">
                  02
                </div>
                <div>
                  <h3 className="font-extrabold text-forest-950 dark:text-sand-100 text-sm">Prescription Clearance</h3>
                  <p className="text-[11px] text-sand-500 dark:text-sand-400">Restricted items require an approved doctor document</p>
                </div>
              </div>

              {userPrescriptions.length === 0 ? (
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-extrabold text-rose-900 dark:text-rose-200">No Eligible Approved Prescriptions Found</h4>
                      <p className="text-xs text-rose-700 dark:text-rose-300 mt-1 leading-relaxed">
                        Your cart contains prescription-required medications, but no approved prescription in your account covers all selected items.
                      </p>
                    </div>
                  </div>
                  <div>
                    <Link
                      to="/prescriptions"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition shadow-xs"
                    >
                      <Upload className="w-3.5 h-3.5" /> Upload Prescription Script
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-forest-900 dark:text-sand-200 block">
                    Select Validated Prescription:
                  </span>
                  <div className="space-y-2">
                    {userPrescriptions.map((rx) => (
                      <label
                        key={rx.id}
                        className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition ${
                          selectedPrescriptionId === String(rx.id)
                            ? 'bg-forest-900/5 dark:bg-emerald-950/50 border-forest-800 dark:border-emerald-500'
                            : 'bg-sand-50/50 dark:bg-forest-950/40 border-sand-200 dark:border-forest-800 hover:bg-sand-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="rxSelection"
                            value={rx.id}
                            checked={selectedPrescriptionId === String(rx.id)}
                            onChange={(e) => setSelectedPrescriptionId(e.target.value)}
                            className="w-4 h-4 accent-forest-900 text-forest-900"
                          />
                          <div>
                            <span className="text-xs font-extrabold text-forest-950 dark:text-sand-100 block">
                              Prescription Document #{rx.id}
                            </span>
                            <span className="text-[11px] text-sand-500 dark:text-sand-400 block">
                              Approved by {rx.verifiedBy || 'Registered Pharmacist'}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-full">
                          APPROVED
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. Payment Method */}
          <div className="bg-white dark:bg-forest-900/40 p-6 sm:p-8 rounded-3xl border border-sand-200 dark:border-forest-800 shadow-subtle space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-sand-100 dark:border-forest-800">
              <div className="w-8 h-8 rounded-xl bg-forest-900 text-mint-400 dark:bg-emerald-500 dark:text-forest-950 flex items-center justify-center font-black text-xs">
                {hasRxItem ? '03' : '02'}
              </div>
              <div>
                <h3 className="font-extrabold text-forest-950 dark:text-sand-100 text-sm">Payment Gateway</h3>
                <p className="text-[11px] text-sand-500 dark:text-sand-400">Secure digital settlement protocol (INR)</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'UPI', label: 'Instant UPI / QR', icon: Lock },
                { id: 'CARD', label: 'Credit / Debit Card', icon: CreditCard },
                { id: 'NET_BANKING', label: 'Net Banking', icon: ShieldCheck },
                { id: 'COD', label: 'Cash on Delivery', icon: ShoppingBag },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id)}
                  className={`p-4 rounded-2xl border text-center space-y-2 transition ${
                    paymentMethod === m.id
                      ? 'bg-forest-900 text-sand-50 border-forest-800 dark:bg-emerald-600 dark:text-forest-950 shadow-sm'
                      : 'bg-sand-50/60 dark:bg-forest-950 text-forest-900 dark:text-sand-200 border-sand-200 dark:border-forest-800 hover:bg-sand-100'
                  }`}
                >
                  <m.icon className={`w-5 h-5 mx-auto ${paymentMethod === m.id ? 'text-mint-400 dark:text-forest-950' : 'text-forest-700 dark:text-emerald-400'}`} />
                  <span className="text-xs font-bold block">{m.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Summary Column */}
        <div className="lg:col-span-4 bg-white dark:bg-forest-900/40 p-6 sm:p-8 rounded-3xl border border-sand-200 dark:border-forest-800/80 shadow-elevated space-y-6 sticky top-28">
          <h3 className="font-extrabold text-forest-950 dark:text-sand-100 text-base border-b border-sand-100 dark:border-forest-800 pb-3">
            Review Items ({cart.items.length})
          </h3>

          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {cart.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 truncate pr-2">
                  <span className="w-5 h-5 rounded-md bg-sand-100 dark:bg-forest-950 text-forest-900 dark:text-sand-200 font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                    {item.quantity}×
                  </span>
                  <span className="truncate font-semibold text-forest-950 dark:text-sand-100">{item.medicine.name}</span>
                </div>
                <span className="font-bold text-forest-950 dark:text-sand-100 flex-shrink-0">
                  {formatINR(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-sand-200 dark:border-forest-800 space-y-2.5 text-xs">
            <div className="flex justify-between text-sand-600 dark:text-sand-400">
              <span>Gross Subtotal</span>
              <span className="font-bold text-forest-950 dark:text-sand-100">{formatINR(totalPrice)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-medium">
                <span>Coupon Savings ({appliedCoupon?.code})</span>
                <span className="font-bold">- {formatINR(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-sand-600 dark:text-sand-400">
              <span>Delivery Dispatch</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400 uppercase">Complimentary</span>
            </div>

            <div className="pt-2 border-t border-sand-200 dark:border-forest-800 flex justify-between items-baseline">
              <span className="text-sm font-extrabold text-forest-950 dark:text-sand-100">Total Payable</span>
              <span className="text-2xl font-black text-forest-950 dark:text-sand-100">
                {formatINR(finalPayable)}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || (hasRxItem && !selectedPrescriptionId)}
            className="w-full py-4 px-6 rounded-2xl bg-forest-900 hover:bg-forest-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-sand-50 dark:text-forest-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            <span>{loading ? 'Clearing Order…' : 'Place Certified Order'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-[11px] text-sand-500 dark:text-sand-400 text-center leading-relaxed">
            By placing this order, you confirm authorization for clinical dispensing and dispatch.
          </p>
        </div>
      </form>
    </div>
  );
};
