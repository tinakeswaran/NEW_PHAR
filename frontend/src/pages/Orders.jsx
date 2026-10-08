import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import { formatINR } from '../utils/formatters';
import { generateInvoicePDF } from '../utils/invoiceGenerator';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  AlertCircle, 
  XCircle, 
  ShieldCheck, 
  MapPin, 
  ArrowRight,
  Sparkles,
  Calendar,
  Download,
  Tag
} from 'lucide-react';

const FULFILLMENT_STEPS = [
  { key: 'CONFIRMED', label: 'Confirmed', sub: 'Logged & Authorized' },
  { key: 'PRESCRIPTION_VERIFIED', label: 'Rx Verified', sub: 'Clinical Clearance' },
  { key: 'PREPARING', label: 'Preparing', sub: 'Dispensing Formulations' },
  { key: 'PACKED', label: 'Packed', sub: 'Sealed & Inspected' },
  { key: 'DISPATCHED', label: 'Dispatched', sub: 'Handed to Courier' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', sub: 'Courier in Transit' },
  { key: 'DELIVERED', label: 'Delivered', sub: 'Handed to Patient' },
];

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [deliveries, setDeliveries] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchOrders = async () => {
    try {
      const data = await orderService.getUserOrders();
      setOrders(data || []);
      const deliveryResults = await Promise.allSettled(
        (data || []).map(async (order) => [order.id, await orderService.getDeliveryTracking(order.id)])
      );
      setDeliveries(Object.fromEntries(
        deliveryResults
          .filter((result) => result.status === 'fulfilled')
          .map((result) => result.value)
      ));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you wish to cancel this order?')) return;
    try {
      await orderService.cancelOrder(orderId);
      alert('Order cancelled successfully.');
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order.');
    }
  };

  const mapStatusToStepIndex = (status, order) => {
    switch (status) {
      case 'PLACED':
      case 'PENDING':
        return 0; // Confirmed
      case 'CONFIRMED':
        return order?.prescription ? 1 : 0;
      case 'PROCESSING':
      case 'PREPARING':
        return 2; // Preparing
      case 'PACKED':
        return 3; // Packed
      case 'SHIPPED':
      case 'DISPATCHED':
        return 4; // Dispatched
      case 'OUT_FOR_DELIVERY':
        return 5; // Out for Delivery
      case 'DELIVERED':
      case 'COMPLETED':
        return 6; // Delivered
      default:
        return 0;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DELIVERED':
        return <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase">DELIVERED</span>;
      case 'CANCELLED':
        return <span className="bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase">CANCELLED</span>;
      case 'SHIPPED':
      case 'DISPATCHED':
      case 'OUT_FOR_DELIVERY':
        return <span className="bg-forest-900 text-sand-50 dark:bg-emerald-600 dark:text-forest-950 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase">{status.replaceAll('_', ' ')}</span>;
      case 'CONFIRMED':
        return <span className="bg-ochre-50 text-ochre-800 border border-ochre-200 dark:bg-ochre-950/60 dark:text-ochre-300 dark:border-ochre-800 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase">CONFIRMED</span>;
      default:
        return <span className="bg-sand-100 text-forest-900 border border-sand-200 dark:bg-forest-800 dark:text-sand-200 dark:border-forest-700 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase">{status.replaceAll('_', ' ')}</span>;
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-sand-300 dark:border-forest-700 border-t-forest-900 dark:border-t-emerald-400 animate-spin mx-auto"></div>
        <p className="text-xs font-bold text-sand-500 dark:text-sand-400 uppercase tracking-widest">
          Retrieving Fulfillment Records…
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 py-6 sm:py-8 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="border-b border-sand-200 dark:border-forest-800 pb-5">
        <span className="text-xs font-black uppercase tracking-widest text-forest-700 dark:text-emerald-400">
          Patient History
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-forest-950 dark:text-sand-100 tracking-tight mt-1">
          Fulfillment & Order Tracking
        </h1>
        <p className="text-xs sm:text-sm text-sand-500 dark:text-sand-400 font-medium mt-1">
          Review past dispensary orders, real-time courier dispatch progress, and download official tax invoices.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white dark:bg-forest-900/40 p-12 rounded-4xl border border-sand-200 dark:border-forest-800 shadow-elevated text-center space-y-4 max-w-lg mx-auto">
          <Package className="w-12 h-12 text-sand-400 mx-auto" />
          <h3 className="text-lg font-black text-forest-950 dark:text-sand-100">No Order History Found</h3>
          <p className="text-xs text-sand-500 dark:text-sand-400">You haven't placed any medication orders with PHARMED yet.</p>
          <Link
            to="/medicines"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-forest-900 text-sand-50 dark:bg-emerald-600 dark:text-forest-950 text-xs font-bold hover:bg-forest-800 transition"
          >
            Explore Catalog <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const delivery = deliveries[order.id];
            const canCancel = ['PLACED', 'CONFIRMED'].includes(order.orderStatus);
            const currentStepIdx = mapStatusToStepIndex(order.orderStatus, order);

            return (
              <div
                key={order.id}
                className="bg-white dark:bg-forest-900/40 rounded-3xl border border-sand-200/90 dark:border-forest-800/80 shadow-subtle hover:shadow-elevated transition p-6 sm:p-8 space-y-6"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sand-100 dark:border-forest-800">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-black text-forest-950 dark:text-sand-100">
                        Order #{order.id}
                      </h3>
                      {getStatusBadge(order.orderStatus)}
                    </div>
                    <p className="text-xs text-sand-500 dark:text-sand-400 font-medium flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Placed on {new Date(order.createdAt || order.orderDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6 self-start sm:self-auto">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] uppercase font-bold text-sand-400 block">Total Billed</span>
                      <span className="text-xl font-black text-forest-950 dark:text-sand-100">
                        {formatINR(order.totalAmount)}
                      </span>
                    </div>

                    {/* Download Invoice Button */}
                    <button
                      onClick={() => generateInvoicePDF(order, user)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-sand-100 hover:bg-forest-900 hover:text-white dark:bg-forest-800 dark:hover:bg-emerald-600 dark:text-sand-200 dark:hover:text-forest-950 border border-sand-200 dark:border-forest-700 transition shadow-xs"
                      title="Download official PDF invoice"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Tax Invoice</span>
                    </button>
                  </div>
                </div>

                {/* 7-Stage Fulfillment Pipeline Visualizer (When not cancelled) */}
                {order.orderStatus !== 'CANCELLED' && (
                  <div className="p-4 sm:p-5 rounded-2.5xl bg-sand-50/70 dark:bg-forest-950/60 border border-sand-200/80 dark:border-forest-800/60 space-y-3">
                    <div className="flex items-center justify-between text-xs font-extrabold text-forest-900 dark:text-sand-200">
                      <span className="flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-forest-700 dark:text-emerald-400" />
                        <span>7-Stage Fulfillment Pipeline</span>
                      </span>
                      {delivery?.estimatedDeliveryTime && (
                        <span className="text-sand-500 dark:text-sand-400 font-medium">
                          Estimated ETA: {new Date(delivery.estimatedDeliveryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>

                    {/* Progress Bar / Steps */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-2">
                      {FULFILLMENT_STEPS.map((step, idx) => {
                        const isDone = currentStepIdx >= idx;
                        const isCurrent = currentStepIdx === idx;

                        return (
                          <div key={step.key} className="space-y-1">
                            <div
                              className={`h-1.5 rounded-full transition-colors ${
                                isDone ? 'bg-emerald-500' : 'bg-sand-200 dark:bg-forest-800'
                              }`}
                            ></div>
                            <span className={`block text-[11px] leading-tight ${
                              isCurrent 
                                ? 'font-black text-forest-950 dark:text-emerald-300' 
                                : isDone 
                                ? 'font-bold text-forest-800 dark:text-sand-200' 
                                : 'text-sand-400 dark:text-sand-600'
                            }`}>
                              {step.label}
                            </span>
                            <span className="block text-[9px] text-sand-500 dark:text-sand-400 leading-none">
                              {step.sub}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <h4 className="font-black uppercase tracking-wider text-sand-500 dark:text-sand-400">
                      Dispensed Medications ({order.items?.length || 0})
                    </h4>
                    {order.couponCode && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                        <Tag className="w-3 h-3" /> Coupon: {order.couponCode} (-{formatINR(order.discountAmount || 0)})
                      </span>
                    )}
                  </div>

                  <div className="divide-y divide-sand-100 dark:divide-forest-800">
                    {order.items?.map((item) => (
                      <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-sand-100 dark:bg-forest-950 p-1 border border-sand-200 dark:border-forest-800 flex-shrink-0 flex items-center justify-center">
                            <img
                              src={item.medicine?.imageUrl || '/images/medicines/placeholder.svg'}
                              alt={item.medicine?.name}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/images/medicines/placeholder.svg';
                              }}
                              className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                            />
                          </div>
                          <div>
                            <span className="font-bold text-forest-950 dark:text-sand-100 block">{item.medicine?.name}</span>
                            <span className="text-[11px] text-sand-500 dark:text-sand-400">
                              {item.quantity} × {formatINR(item.price)}
                            </span>
                          </div>
                        </div>
                        <span className="font-extrabold text-forest-950 dark:text-sand-100">
                          {formatINR(item.quantity * item.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer metadata & Cancel action */}
                <div className="pt-3 border-t border-sand-100 dark:border-forest-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-sand-500 dark:text-sand-400">
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-forest-700 dark:text-emerald-400 flex-shrink-0" />
                    <span className="truncate max-w-sm">{order.shippingAddress}</span>
                  </div>

                  {canCancel && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="self-start sm:self-auto text-xs font-bold text-rose-600 hover:text-rose-800 dark:text-rose-400 dark:hover:text-rose-300 border border-rose-200 dark:border-rose-900 bg-rose-50/60 dark:bg-rose-950/40 px-3 py-1.5 rounded-xl transition"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
