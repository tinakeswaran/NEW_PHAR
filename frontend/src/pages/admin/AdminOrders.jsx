import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  ClipboardList, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  Truck, 
  AlertCircle,
  Eye,
  MapPin
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { 
  PageHeader, 
  StatusBadge, 
  EmptyState, 
  LoadingState, 
  ErrorState, 
  currency, 
  formatDate 
} from '../../components/admin/AdminUI';

const statusFlow = [
  'PLACED',
  'CONFIRMED',
  'PROCESSING',
  'PACKED',
  'SHIPPED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED'
];

export const AdminOrders = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminService.getAllOrders();
      setOrders(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to retrieve order records.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setSearch(searchParams.get('search') || ''); }, [searchParams]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      await load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order fulfillment status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || 
      String(order.id).includes(q) || 
      (order.user?.name || '').toLowerCase().includes(q) || 
      (order.user?.email || '').toLowerCase().includes(q) || 
      (order.shippingAddress || '').toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'ALL' || order.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        eyebrow="DISPATCH PIPELINE"
        title="Clinical Order Fulfillment"
        subtitle="Monitor incoming orders, transition fulfillment statuses, and manage courier dispatches."
        actions={
          <span className="text-xs font-bold text-sand-500 dark:text-sand-400">
            {orders.length} Cumulative Records
          </span>
        }
      />

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-forest-900/60 p-5 rounded-3xl border border-sand-200 dark:border-forest-800 shadow-subtle flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 transition-colors">
        <div className="flex-1 flex items-center px-3.5 bg-sand-50/70 dark:bg-forest-950/60 rounded-2xl border border-sand-200 dark:border-forest-800 max-w-md">
          <Search className="w-4 h-4 text-sand-400 dark:text-sand-400 mr-2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, patient name, email, or address…"
            className="w-full bg-transparent py-2.5 text-xs text-forest-950 dark:text-sand-100 placeholder-sand-400 dark:placeholder-forest-500 outline-none"
          />
        </div>

        {/* Status Filter Dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-sand-50 dark:bg-forest-950/60 border border-sand-200 dark:border-forest-800 text-xs font-bold text-forest-900 dark:text-sand-200 rounded-xl outline-none cursor-pointer"
          >
            <option value="ALL" className="bg-sand-50 dark:bg-forest-900 text-forest-950 dark:text-sand-100">All Statuses ({orders.length})</option>
            {statusFlow.map((s) => (
              <option key={s} value={s} className="bg-sand-50 dark:bg-forest-900 text-forest-950 dark:text-sand-100">{s.replaceAll('_', ' ')}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingState label="Indexing fulfillment orders…" />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <div className="bg-white dark:bg-forest-900/60 rounded-3xl border border-sand-200 dark:border-forest-800 shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-sand-200 dark:border-forest-800 bg-sand-50/50 dark:bg-forest-950/50 text-sand-500 dark:text-sand-400 uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4 font-black">Order ID</th>
                  <th className="py-3.5 px-4 font-black">Patient Details</th>
                  <th className="py-3.5 px-4 font-black">Items & Dosage</th>
                  <th className="py-3.5 px-4 font-black">Amount</th>
                  <th className="py-3.5 px-4 font-black">Current Status</th>
                  <th className="py-3.5 px-4 font-black text-right">Fulfillment Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100 dark:divide-forest-800">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-sand-50/50 dark:hover:bg-forest-800/40 transition">
                    <td className="py-3.5 px-4 font-extrabold text-forest-950 dark:text-white">
                      #{ord.id}
                      <span className="block text-[10px] text-sand-400 dark:text-sand-500 font-medium">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <strong className="font-bold text-forest-900 dark:text-sand-100 block">{ord.user?.name || 'Customer'}</strong>
                      <span className="text-[11px] text-sand-500 dark:text-sand-400 block">{ord.user?.email}</span>
                      <span className="text-[10px] text-sand-400 dark:text-sand-500 block truncate max-w-xs mt-0.5">
                        {ord.shippingAddress}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        {ord.items?.slice(0, 2).map((item) => (
                          <div key={item.id} className="text-[11px] text-forest-900 dark:text-sand-200 font-medium">
                            <span className="font-bold">{item.quantity}×</span> {item.medicine?.name}
                          </div>
                        ))}
                        {ord.items?.length > 2 && (
                          <span className="text-[10px] text-sand-400 dark:text-sand-500 block italic">
                            +{ord.items.length - 2} more item(s)
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-black text-forest-950 dark:text-white block">
                        {currency(ord.totalAmount)}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                        {ord.paymentStatus || 'PAID'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={ord.orderStatus} />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <select
                        disabled={updatingId === ord.id || ord.orderStatus === 'CANCELLED'}
                        value={ord.orderStatus}
                        onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                        className="px-2.5 py-1.5 bg-sand-100 dark:bg-forest-800 hover:bg-sand-200 dark:hover:bg-forest-700 border border-sand-300 dark:border-forest-700 text-[11px] font-bold text-forest-900 dark:text-sand-100 rounded-xl outline-none cursor-pointer disabled:opacity-50"
                      >
                        {statusFlow.map((s) => (
                          <option key={s} value={s} className="bg-sand-50 dark:bg-forest-900 text-forest-950 dark:text-sand-100">{s.replaceAll('_', ' ')}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
