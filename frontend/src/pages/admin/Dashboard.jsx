import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  ClipboardList, 
  DollarSign, 
  FileCheck2, 
  PackageSearch, 
  Pill, 
  Users, 
  TrendingUp,
  ShieldCheck,
  Calendar,
  Clock
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { 
  PageHeader, 
  MetricCard, 
  StatusBadge, 
  EmptyState, 
  LoadingState, 
  ErrorState, 
  currency, 
  formatDate 
} from '../../components/admin/AdminUI';

const attentionStatus = new Set(['PLACED', 'CONFIRMED', 'PROCESSING', 'PACKED']);

export const Dashboard = () => {
  const [data, setData] = useState({ stats: null, orders: [], inventory: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    const results = await Promise.allSettled([
      adminService.getDashboardStats(),
      adminService.getAllOrders(),
      adminService.getInventoryReport(),
    ]);

    if (results.every((result) => result.status === 'rejected')) {
      setError(results[0].reason?.response?.data?.message || 'The clinical operations data could not be retrieved.');
    } else {
      setData({
        stats: results[0].status === 'fulfilled' ? results[0].value : null,
        orders: results[1].status === 'fulfilled' ? results[1].value : [],
        inventory: results[2].status === 'fulfilled' ? results[2].value : [],
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <LoadingState label="Synthesizing operational ledger…" />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const { stats, orders, inventory } = data;
  const pendingOrders = orders.filter((order) => attentionStatus.has(order.orderStatus));
  const lowStock = inventory.filter((medicine) => Number(medicine.stockQuantity) > 0 && Number(medicine.stockQuantity) <= 10);
  const outOfStock = inventory.filter((medicine) => Number(medicine.stockQuantity) <= 0);
  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        eyebrow="EXECUTIVE OPERATIONS"
        title="Dispensary Operations Cockpit"
        subtitle="Real-time clinical metrics, pharmacist review queues, and medication inventory tracking."
        actions={
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live System Telemetry</span>
          </div>
        }
      />

      {/* 1. Primary Metrics Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          label="Total Orders"
          value={stats?.totalOrders ?? orders.length}
          note="Cumulative patient orders"
          icon={ClipboardList}
          tone="forest"
        />
        <MetricCard
          label="Dispensed Revenue"
          value={stats?.totalRevenue == null ? '—' : currency(stats.totalRevenue)}
          note="Gross pharmaceutical sales"
          icon={DollarSign}
          tone="amber"
        />
        <MetricCard
          label="Rx Review Queue"
          value={stats?.pendingPrescriptions ?? '0'}
          note="Awaiting clinical clearance"
          icon={FileCheck2}
          tone="blue"
        />
        <MetricCard
          label="Inventory Alerts"
          value={stats?.lowStockMedicines ?? (lowStock.length + outOfStock.length)}
          note="Formulations ≤ 10 units"
          icon={AlertTriangle}
          tone="red"
        />
      </section>

      {/* 2. Urgent Queue Actions */}
      <section className="bg-white dark:bg-forest-900/60 rounded-3xl p-6 sm:p-8 border border-sand-200 dark:border-forest-800 shadow-subtle space-y-4">
        <div className="flex items-center justify-between border-b border-sand-100 dark:border-forest-800 pb-3">
          <h2 className="text-sm font-extrabold text-forest-950 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-ochre-600 dark:text-ochre-400" />
            <span>Urgent Operational Action Queue</span>
          </h2>
          <span className="text-[11px] text-sand-400 dark:text-sand-400 font-medium">Real-time alerts</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Rx Queue Card */}
          <Link
            to="/admin/prescriptions"
            className="p-5 rounded-2xl bg-sand-50/70 dark:bg-forest-950/80 border border-sand-200 dark:border-forest-800 hover:border-ochre-400/60 dark:hover:border-ochre-500/50 transition flex items-center justify-between group"
          >
            <div className="space-y-1">
              <span className="text-xs font-black text-forest-950 dark:text-sand-100 block">Prescription Scripts</span>
              <span className="text-[11px] text-sand-500 dark:text-sand-400 block">Pending review desk</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-ochre-600 dark:text-ochre-400">{stats?.pendingPrescriptions ?? '0'}</span>
              <ArrowRight className="w-4 h-4 text-sand-400 group-hover:text-ochre-600 dark:group-hover:text-ochre-400 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          {/* Low Stock Card */}
          <Link
            to="/admin/medicines"
            className="p-5 rounded-2xl bg-sand-50/70 dark:bg-forest-950/80 border border-sand-200 dark:border-forest-800 hover:border-rose-400/60 dark:hover:border-rose-500/50 transition flex items-center justify-between group"
          >
            <div className="space-y-1">
              <span className="text-xs font-black text-forest-950 dark:text-sand-100 block">Critical Inventory</span>
              <span className="text-[11px] text-sand-500 dark:text-sand-400 block">{outOfStock.length} items out of stock</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-rose-600 dark:text-rose-400">{stats?.lowStockMedicines ?? lowStock.length}</span>
              <ArrowRight className="w-4 h-4 text-sand-400 group-hover:text-rose-600 dark:group-hover:text-rose-400 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          {/* Pending Orders Card */}
          <Link
            to="/admin/orders"
            className="p-5 rounded-2xl bg-sand-50/70 dark:bg-forest-950/80 border border-sand-200 dark:border-forest-800 hover:border-emerald-400/60 dark:hover:border-emerald-500/50 transition flex items-center justify-between group"
          >
            <div className="space-y-1">
              <span className="text-xs font-black text-forest-950 dark:text-sand-100 block">Active Dispatch Orders</span>
              <span className="text-[11px] text-sand-500 dark:text-sand-400 block">Staged for fulfillment</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{pendingOrders.length}</span>
              <ArrowRight className="w-4 h-4 text-sand-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        </div>
      </section>

      {/* 3. Recent Orders Table */}
      <section className="bg-white dark:bg-forest-900/60 rounded-3xl p-6 sm:p-8 border border-sand-200 dark:border-forest-800 shadow-subtle space-y-5">
        <div className="flex items-center justify-between border-b border-sand-100 dark:border-forest-800 pb-4">
          <div>
            <h2 className="text-base font-black text-forest-950 dark:text-white">Recent Clinical Orders</h2>
            <p className="text-xs text-sand-500 dark:text-sand-400 font-medium">Latest incoming patient orders & payments</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-forest-700 dark:text-mint-400 hover:text-forest-950 dark:hover:text-mint-300 flex items-center gap-1 transition"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-xs text-sand-500 dark:text-sand-400 py-6 text-center italic">No orders logged yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-sand-200 dark:border-forest-800 text-sand-500 dark:text-sand-400 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4 font-black">Order ID</th>
                  <th className="py-3 px-4 font-black">Patient</th>
                  <th className="py-3 px-4 font-black">Items</th>
                  <th className="py-3 px-4 font-black">Billed Total</th>
                  <th className="py-3 px-4 font-black">Fulfillment Status</th>
                  <th className="py-3 px-4 font-black text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100 dark:divide-forest-800">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-sand-50/60 dark:hover:bg-forest-800/40 transition">
                    <td className="py-3.5 px-4 font-extrabold text-forest-950 dark:text-white">#{ord.id}</td>
                    <td className="py-3.5 px-4 font-bold text-forest-900 dark:text-sand-200">{ord.user?.name || 'Customer'}</td>
                    <td className="py-3.5 px-4 text-sand-600 dark:text-sand-400">{ord.items?.length || 0} unit(s)</td>
                    <td className="py-3.5 px-4 font-extrabold text-forest-950 dark:text-white">{currency(ord.totalAmount)}</td>
                    <td className="py-3.5 px-4"><StatusBadge status={ord.orderStatus} /></td>
                    <td className="py-3.5 px-4 text-right text-sand-400 dark:text-sand-500 font-medium">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
