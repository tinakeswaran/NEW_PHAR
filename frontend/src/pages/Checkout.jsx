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
  Tag,
  QrCode,
  X,
  Copy,
  Check
} from 'lucide-react';

export const Checkout = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState(user?.address || '');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [userPrescriptions, setUserPrescriptions] = useState([]);
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdOrder, setCreatedOrder] = useState(null);

  // UPI Payment States
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [upiPaid, setUpiPaid] = useState(false);
  const [upiPaymentSuccess, setUpiPaymentSuccess] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [qrNonce, setQrNonce] = useState(Date.now());

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const stored = sessionStorage.getItem('valence_applied_coupon');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  const itemsRequiringPrescriptionInCart = cart?.items?.filter(
    (item) => item.medicine.requiresPrescription || item.quantity > 100
  ) || [];
  const hasRxItem = itemsRequiringPrescriptionInCart.length > 0;

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
        return itemsRequiringPrescriptionInCart.every((cartItem) =>
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

  const openUpiModal = () => {
    setQrNonce(Date.now() + '-' + Math.floor(Math.random() * 10000));
    setUpiPaymentSuccess(false);
    setShowUpiModal(true);
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText('pharmed@upi');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const submitOrder = async () => {
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
        paymentMethod: paymentMethod === 'UPI' ? 'UPI' : paymentMethod,
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

  const handlePlaceOrder = (e) => {
    if (e) e.preventDefault();

    if (!shippingAddress.trim()) {
      setError('Please provide a valid delivery address.');
      return;
    }

    if (hasRxItem && !selectedPrescriptionId) {
      setError('An approved doctor prescription covering all restricted medications is required to proceed.');
      return;
    }

    if (paymentMethod === 'CARD') {
      setError('Credit/Debit Card payments are currently unavailable. Please select Instant UPI / QR or Cash on Delivery.');
      return;
    }

    if (paymentMethod === 'NET_BANKING') {
      setError('Net Banking is currently unavailable. Please select Instant UPI / QR or Cash on Delivery.');
      return;
    }

    if (paymentMethod === 'UPI' && !upiPaid) {
      openUpiModal();
      return;
    }

    submitOrder();
  };

  const handleCompleteUpiPayment = () => {
    setUpiPaymentSuccess(true);
    setUpiPaid(true);
    setTimeout(() => {
      setShowUpiModal(false);
      submitOrder();
    }, 1200);
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
                className="w-full bg-sand-50/70 dark:bg-forest-950/70 p-3.5 rounded-2xl border border-sand-200 dark:border-forest-700 text-xs text-forest-950 dark:text-sand-100 outline-none focus:border-forest-700 dark:focus:border-emerald-500 transition"
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
                  <label className="text-xs font-bold text-forest-900 dark:text-sand-200 block">
                    Select Approved Active Prescription:
                  </label>

                  <div className="space-y-2">
                    {userPrescriptions.map((rx) => (
                      <label
                        key={rx.id}
                        className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition ${
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
                { id: 'UPI', label: 'Instant UPI / QR', icon: QrCode, enabled: true, badge: 'ACTIVE' },
                { id: 'CARD', label: 'Credit / Debit Card', icon: CreditCard, enabled: false, badge: 'UNAVAILABLE' },
                { id: 'NET_BANKING', label: 'Net Banking', icon: ShieldCheck, enabled: false, badge: 'UNAVAILABLE' },
                { id: 'COD', label: 'Cash on Delivery', icon: ShoppingBag, enabled: true, badge: 'AVAILABLE' },
              ].map((m) => {
                const isSelected = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setPaymentMethod(m.id);
                      setError('');
                    }}
                    className={`p-4 rounded-2xl border text-center space-y-2 transition relative ${
                      isSelected
                        ? m.enabled
                          ? 'bg-forest-900 text-sand-50 border-forest-800 dark:bg-emerald-600 dark:text-forest-950 shadow-sm'
                          : 'bg-rose-950/90 text-rose-100 border-rose-700 shadow-sm'
                        : m.enabled
                          ? 'bg-sand-50/60 dark:bg-forest-950 text-forest-900 dark:text-sand-200 border-sand-200 dark:border-forest-800 hover:bg-sand-100'
                          : 'bg-sand-100/40 dark:bg-forest-950/40 text-sand-400 dark:text-sand-600 border-sand-200/50 dark:border-forest-900 opacity-75'
                    }`}
                  >
                    <m.icon className={`w-5 h-5 mx-auto ${
                      isSelected
                        ? m.enabled ? 'text-mint-400 dark:text-forest-950' : 'text-rose-300'
                        : m.enabled ? 'text-forest-700 dark:text-emerald-400' : 'text-sand-400 dark:text-sand-600'
                    }`} />

                    <span className="text-xs font-bold block">{m.label}</span>

                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full inline-block ${
                      !m.enabled
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                        : isSelected
                          ? 'bg-emerald-500 text-forest-950 dark:bg-forest-950 dark:text-emerald-400'
                          : 'bg-sand-200 text-sand-700 dark:bg-forest-800 dark:text-sand-300'
                    }`}>
                      {m.badge}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Detailed Selected Payment Method Box */}
            {paymentMethod === 'UPI' && (
              <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-extrabold text-emerald-950 dark:text-emerald-100">
                      Instant UPI / QR Payment Configured
                    </span>
                  </div>
                  <span className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900 px-2 py-0.5 rounded-md">
                    DEMO UPI GATEWAY
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-emerald-900 dark:text-emerald-200 font-medium">
                  <div>
                    <span className="text-emerald-700 dark:text-emerald-400 block text-[10px] uppercase font-bold">UPI VPA:</span>
                    <strong className="font-mono font-bold">pharmed@upi</strong>
                  </div>
                  <div>
                    <span className="text-emerald-700 dark:text-emerald-400 block text-[10px] uppercase font-bold">Merchant:</span>
                    <strong>PHARMED Digital Pharmacy</strong>
                  </div>
                  <div>
                    <span className="text-emerald-700 dark:text-emerald-400 block text-[10px] uppercase font-bold">Total Due:</span>
                    <strong className="text-emerald-950 dark:text-emerald-100">{formatINR(finalPayable)}</strong>
                  </div>
                </div>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={openUpiModal}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-forest-900 dark:bg-emerald-600 hover:bg-forest-800 dark:hover:bg-emerald-500 text-sand-50 dark:text-forest-950 font-bold text-xs transition shadow-sm"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Pay via Instant UPI / QR</span>
                  </button>
                </div>
              </div>
            )}

            {paymentMethod === 'CARD' && (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs space-y-1.5">
                <div className="flex items-center gap-2 text-rose-800 dark:text-rose-200 font-extrabold">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>Credit/Debit Card payments are currently unavailable.</span>
                </div>
                <p className="text-[11px] text-rose-700 dark:text-rose-300/90 leading-relaxed pl-6">
                  Card processing is undergoing scheduled clinical gateway maintenance. Please select <strong>Instant UPI / QR</strong> or <strong>Cash on Delivery</strong> to complete your order.
                </p>
              </div>
            )}

            {paymentMethod === 'NET_BANKING' && (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs space-y-1.5">
                <div className="flex items-center gap-2 text-rose-800 dark:text-rose-200 font-extrabold">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>Net Banking is currently unavailable.</span>
                </div>
                <p className="text-[11px] text-rose-700 dark:text-rose-300/90 leading-relaxed pl-6">
                  Net Banking portal is undergoing scheduled clinical gateway maintenance. Please select <strong>Instant UPI / QR</strong> or <strong>Cash on Delivery</strong> to complete your order.
                </p>
              </div>
            )}

            {paymentMethod === 'COD' && (
              <div className="p-4 rounded-2xl bg-sand-50 dark:bg-forest-950/60 border border-sand-200 dark:border-forest-800 text-xs space-y-1">
                <div className="flex items-center gap-2 text-forest-950 dark:text-sand-100 font-extrabold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Cash on Delivery Selected</span>
                </div>
                <p className="text-[11px] text-sand-600 dark:text-sand-400 leading-relaxed pl-6">
                  Pay via Cash or digital UPI directly to the delivery agent upon doorstep arrival.
                </p>
              </div>
            )}
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
            disabled={loading || (hasRxItem && !selectedPrescriptionId) || paymentMethod === 'CARD' || paymentMethod === 'NET_BANKING'}
            className="w-full py-4 px-6 rounded-2xl bg-forest-900 hover:bg-forest-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-sand-50 dark:text-forest-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            {paymentMethod === 'CARD' || paymentMethod === 'NET_BANKING' ? (
              <>
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <span>Payment Method Unavailable</span>
              </>
            ) : paymentMethod === 'UPI' ? (
              <>
                <QrCode className="w-4 h-4" />
                <span>{upiPaid ? 'Place Certified Order' : 'Pay via Instant UPI / QR'}</span>
              </>
            ) : (
              <>
                <span>{loading ? 'Clearing Order…' : 'Place Certified Order'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-[11px] text-sand-500 dark:text-sand-400 text-center leading-relaxed">
            By placing this order, you confirm authorization for clinical dispensing and dispatch.
          </p>
        </div>
      </form>

      {/* UPI QR Payment Modal */}
      {showUpiModal && (
        <div className="fixed inset-0 bg-forest-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-forest-900 border border-sand-200 dark:border-forest-800 rounded-4xl p-6 sm:p-8 max-w-md w-full shadow-premium text-center space-y-5 relative overflow-hidden">
            <button
              type="button"
              onClick={() => setShowUpiModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-sand-400 hover:text-forest-950 dark:hover:text-sand-100 hover:bg-sand-100 dark:hover:bg-forest-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 pt-2">
              <span className="text-[10px] uppercase font-black tracking-widest text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-full inline-block">
                Instant UPI / QR Payment
              </span>
              <h3 className="text-xl font-black text-forest-950 dark:text-sand-100 tracking-tight">
                Scan to Pay Order
              </h3>
              <p className="text-xs text-sand-500 dark:text-sand-400">
                Use Google Pay, PhonePe, Paytm or BHIM UPI app
              </p>
            </div>

            {/* QR Code Container */}
            <div className="bg-white p-4 rounded-3xl border border-sand-300 shadow-inner w-56 h-56 mx-auto flex items-center justify-center relative">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=pharmed@upi%26pn=PHARMED%20Digital%20Pharmacy%26am=${finalPayable}%26cu=INR%26ref=${qrNonce}`}
                alt="Demo UPI QR Code"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>

            {/* Payment Meta Details */}
            <div className="p-4 rounded-2xl bg-sand-50 dark:bg-forest-950/80 border border-sand-200 dark:border-forest-800 text-xs space-y-2 text-left">
              <div className="flex justify-between items-center">
                <span className="text-sand-500 dark:text-sand-400 font-medium">Merchant:</span>
                <span className="font-extrabold text-forest-950 dark:text-sand-100">PHARMED Digital Pharmacy</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sand-500 dark:text-sand-400 font-medium">UPI ID:</span>
                <button
                  type="button"
                  onClick={copyUpiId}
                  className="font-mono font-bold text-forest-900 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>pharmed@upi</span>
                  {copiedUpi ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-sand-200 dark:border-forest-800">
                <span className="text-sand-600 dark:text-sand-400 font-bold">Total Amount:</span>
                <span className="text-base font-black text-forest-950 dark:text-emerald-400">
                  {formatINR(finalPayable)}
                </span>
              </div>
            </div>

            {/* Action / Success Banner */}
            {upiPaymentSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center justify-center gap-2 animate-bounce">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>Payment Status: Success (Demo Mode)</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleCompleteUpiPayment}
                className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition duration-200 shadow-md hover:shadow-lg active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>I've Completed Payment</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
