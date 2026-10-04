import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  AlertTriangle, BarChart3, Boxes, FileCheck2, Package, TrendingUp, 
  ArrowUpRight, CheckCircle2, Clock, ShieldAlert, Sparkles, RefreshCw
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { EmptyState, ErrorState, LoadingState, MetricCard, PageHeader, StatusBadge, currency } from '../../components/admin/AdminUI';

export const AdminReports = () => {
  const [sales, setSales] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    const responses = await Promise.allSettled([
      adminService.getSalesReport(),
      adminService.getInventoryReport(),
      adminService.getPrescriptions()
    ]);
    if (responses.every((response) => response.status === 'rejected')) {
      setError('Operational intelligence telemetry is currently unavailable.');
    } else {
      setSales(responses[0].status === 'fulfilled' ? responses[0].value || [] : []);
      setInventory(responses[1].status === 'fulfilled' ? responses[1].value || [] : []);
      setPrescriptions(responses[2].status === 'fulfilled' ? responses[2].value || [] : []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const orderStatuses = useMemo(() => {
    const counts = {};
    sales.forEach((order) => { 
      counts[order.orderStatus] = (counts[order.orderStatus] || 0) + 1; 
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [sales]);

  const stock = useMemo(() => ({
    healthy: inventory.filter((medicine) => Number(medicine.stockQuantity) > 10).length,
    low: inventory.filter((medicine) => Number(medicine.stockQuantity) > 0 && Number(medicine.stockQuantity) <= 10).length,
    out: inventory.filter((medicine) => Number(medicine.stockQuantity) <= 0).length,
  }), [inventory]);

  const rxStatusCounts = useMemo(() => [
    'PENDING', 'APPROVED', 'REJECTED', 'EXPIRED'
  ].map((status) => ({ 
    status, 
    count: prescriptions.filter((prescription) => prescription.status === status).length 
  })), [prescriptions]);

  const totalRecordedAmount = sales
    .filter((order) => order.paymentStatus === 'PAID')
    .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

  const maxStatusCount = Math.max(1, ...orderStatuses.map(([, count]) => count));

  if (loading) return <LoadingState label="Synthesizing clinical and operational telemetry..." />;

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        eyebrow="OPERATIONAL INTELLIGENCE & TELEMETRY"
        title="Clinical Reports & Analytics"
        subtitle="Live cross-sectional metrics on dispensary revenue, inventory positions, and prescription compliance."
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={load}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sand-100 dark:bg-forest-900 hover:bg-sand-200 dark:hover:bg-forest-800 text-forest-800 dark:text-sand-300 text-xs font-semibold tracking-wide border border-sand-200 dark:border-forest-800 transition"
            >
              <RefreshCw size={13} className="text-forest-700 dark:text-mint-400" />
              Sync Real-Time Data
            </button>
          </div>
        }
      />

      {error && <ErrorState message={error} onRetry={load} />}

      {/* Top Telemetry Metric Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Orders Processed"
          value={sales.length}
          note="Across all fulfillment channels"
          icon={Package}
          tone="forest"
        />
        <MetricCard
          label="Settled Dispensary Revenue"
          value={currency(totalRecordedAmount)}
          note="Orders with verified PAID status"
          icon={TrendingUp}
          tone="amber"
        />
        <MetricCard
          label="Cataloged Formulations"
          value={inventory.length}
          note="Active pharmacopeia records"
          icon={Boxes}
          tone="blue"
        />
        <MetricCard
          label="Prescription Audits"
          value={prescriptions.length}
          note="Submitted patient clinical files"
          icon={FileCheck2}
          tone="mint"
        />
      </section>

      {/* 2x2 Operational Intelligence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Order Fulfillment Spectrum */}
        <section className="bg-white dark:bg-forest-900/60 rounded-3xl border border-sand-200 dark:border-forest-800 p-6 shadow-subtle flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between border-b border-sand-100 dark:border-forest-800 pb-4 mb-5">
              <div>
                <span className="text-xs uppercase font-mono tracking-widest text-ochre-700 dark:text-ochre-400 font-semibold block">
                  FULFILLMENT PIPELINE
                </span>
                <h3 className="text-lg font-bold text-forest-950 dark:text-white">Dispensary Order Pipeline</h3>
              </div>
              <span className="text-xs text-sand-500 dark:text-sand-400 font-mono">By state distribution</span>
            </div>

            {orderStatuses.length ? (
              <div className="space-y-4">
                {orderStatuses.map(([status, count]) => {
                  const percentage = Math.round((count / maxStatusCount) * 100);
                  return (
                    <div key={status} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-forest-900 dark:text-sand-200 tracking-wide">
                          {String(status).replace(/_/g, ' ')}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sand-500 dark:text-sand-400 font-mono">{count} orders</span>
                          <span className="font-mono font-bold text-forest-950 dark:text-white">{percentage}%</span>
                        </div>
                      </div>
                      <div className="w-full h-2.5 bg-sand-100 dark:bg-forest-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-forest-900 dark:bg-mint-500 rounded-full transition-all duration-700"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                title="No active order records"
                description="Fulfillment metrics will visualize as orders are placed."
                icon={BarChart3}
              />
            )}
          </div>
          <p className="text-xs text-sand-500 dark:text-sand-400 mt-6 pt-4 border-t border-sand-100 dark:border-forest-800">
            Reflects real-time statuses across the fulfillment lifecycle.
          </p>
        </section>

        {/* Card 2: Inventory Health Matrix */}
        <section className="bg-white dark:bg-forest-900/60 rounded-3xl border border-sand-200 dark:border-forest-800 p-6 shadow-subtle flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between border-b border-sand-100 dark:border-forest-800 pb-4 mb-5">
              <div>
                <span className="text-xs uppercase font-mono tracking-widest text-ochre-700 dark:text-ochre-400 font-semibold block">
                  FORMULATION RESERVES
                </span>
                <h3 className="text-lg font-bold text-forest-950 dark:text-white">Inventory Position & Health</h3>
              </div>
              <span className="text-xs text-sand-500 dark:text-sand-400 font-mono">10 unit safety threshold</span>
            </div>

            {/* Health Indicators Trio */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-sand-50 dark:bg-forest-950/60 border border-sand-200 dark:border-forest-800 rounded-xl p-3.5 text-center">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block mb-1.5" />
                <p className="text-xs text-sand-600 dark:text-sand-300 font-medium">Adequate</p>
                <p className="text-2xl font-bold text-forest-950 dark:text-white mt-1">{stock.healthy}</p>
              </div>
              <div className="bg-ochre-50/60 dark:bg-forest-950/60 border border-ochre-200 dark:border-forest-800 rounded-xl p-3.5 text-center">
                <span className="w-2.5 h-2.5 rounded-full bg-ochre-500 inline-block mb-1.5" />
                <p className="text-xs text-ochre-800 dark:text-ochre-300 font-medium">Low Stock</p>
                <p className="text-2xl font-bold text-ochre-900 dark:text-ochre-200 mt-1">{stock.low}</p>
              </div>
              <div className="bg-rose-50/60 dark:bg-forest-950/60 border border-rose-200 dark:border-forest-800 rounded-xl p-3.5 text-center">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block mb-1.5" />
                <p className="text-xs text-rose-800 dark:text-rose-300 font-medium">Stockout</p>
                <p className="text-2xl font-bold text-rose-900 dark:text-rose-200 mt-1">{stock.out}</p>
              </div>
            </div>

            {/* Critical Low Stock Alert List */}
            {inventory.filter((m) => Number(m.stockQuantity) <= 10).length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-sand-700 dark:text-sand-300 uppercase tracking-wider mb-1">
                  Urgent Reorder Attention Needed
                </p>
                {inventory.filter((m) => Number(m.stockQuantity) <= 10).slice(0, 4).map((medicine) => (
                  <div
                    key={medicine.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-sand-50/80 dark:bg-forest-950/60 border border-sand-200 dark:border-forest-800 text-sm"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <AlertTriangle size={15} className="text-ochre-600 dark:text-ochre-400 shrink-0" />
                      <span className="font-medium text-forest-950 dark:text-sand-100 truncate">{medicine.name}</span>
                    </div>
                    <StatusBadge status={Number(medicine.stockQuantity) <= 0 ? 'OUT OF STOCK' : 'LOW STOCK'} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs">
                <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>All dispensary stock formulations currently satisfy safety buffers.</span>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-sand-100 dark:border-forest-800 flex justify-end">
            <Link
              to="/admin/medicines"
              className="text-xs font-semibold text-forest-900 dark:text-mint-400 hover:text-forest-950 dark:hover:text-mint-300 flex items-center gap-1 transition"
            >
              Manage Pharmacopeia Inventory <ArrowUpRight size={13} />
            </Link>
          </div>
        </section>

        {/* Card 3: Prescription Compliance Overview */}
        <section className="bg-white dark:bg-forest-900/60 rounded-3xl border border-sand-200 dark:border-forest-800 p-6 shadow-subtle flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between border-b border-sand-100 dark:border-forest-800 pb-4 mb-5">
              <div>
                <span className="text-xs uppercase font-mono tracking-widest text-ochre-700 dark:text-ochre-400 font-semibold block">
                  REGULATORY COMPLIANCE
                </span>
                <h3 className="text-lg font-bold text-forest-950 dark:text-white">Prescription Verification Desk</h3>
              </div>
              <Link
                to="/admin/prescriptions"
                className="text-xs font-semibold text-forest-800 dark:text-mint-400 hover:text-forest-950 dark:hover:text-mint-300 flex items-center gap-1 transition"
              >
                Verification Queue <ArrowUpRight size={13} />
              </Link>
            </div>

            {prescriptions.length ? (
              <div className="grid grid-cols-2 gap-3 mb-4">
                {rxStatusCounts.map(({ status, count }) => (
                  <div
                    key={status}
                    className="p-4 rounded-xl bg-sand-50/80 dark:bg-forest-950/60 border border-sand-200 dark:border-forest-800 flex items-center justify-between"
                  >
                    <div>
                      <StatusBadge status={status} />
                      <p className="text-xs text-sand-500 dark:text-sand-400 mt-1">Audit status</p>
                    </div>
                    <span className="text-2xl font-bold text-forest-950 dark:text-white">{count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No prescription audits recorded"
                description="Prescription verification activity will accumulate here as patients submit documentation."
                icon={FileCheck2}
              />
            )}
          </div>
          <p className="text-xs text-sand-500 dark:text-sand-400 mt-4 pt-4 border-t border-sand-100 dark:border-forest-800">
            Strict pharmacist sign-off required prior to restricted medication release.
          </p>
        </section>

        {/* Card 4: Recent Financial Settlements */}
        <section className="bg-white dark:bg-forest-900/60 rounded-3xl border border-sand-200 dark:border-forest-800 p-6 shadow-subtle flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between border-b border-sand-100 dark:border-forest-800 pb-4 mb-5">
              <div>
                <span className="text-xs uppercase font-mono tracking-widest text-ochre-700 dark:text-ochre-400 font-semibold block">
                  FINANCIAL LEDGER
                </span>
                <h3 className="text-lg font-bold text-forest-950 dark:text-white">Recent Order Settlements</h3>
              </div>
              <span className="text-xs text-sand-500 dark:text-sand-400 font-mono">Latest records</span>
            </div>

            {sales.length ? (
              <div className="space-y-2.5">
                {[...sales]
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .slice(0, 5)
                  .map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-sand-50/70 dark:bg-forest-950/60 border border-sand-200 dark:border-forest-800 text-sm"
                    >
                      <div>
                        <p className="font-semibold text-forest-950 dark:text-white">Order #{order.id}</p>
                        <p className="text-xs text-sand-500 dark:text-sand-400 font-mono">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Date pending'}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-forest-900 dark:text-sand-100">{currency(order.totalAmount)}</span>
                        <StatusBadge status={order.orderStatus} />
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <EmptyState
                title="No sales transactions"
                description="Transaction entries will record here as customer checkouts complete."
                icon={TrendingUp}
              />
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-sand-100 dark:border-forest-800 flex justify-end">
            <Link
              to="/admin/orders"
              className="text-xs font-semibold text-forest-900 dark:text-mint-400 hover:text-forest-950 dark:hover:text-mint-300 flex items-center gap-1 transition"
            >
              View Full Orders Ledger <ArrowUpRight size={13} />
            </Link>
          </div>
        </section>
      </div>

      {/* Observational Notice */}
      <div className="bg-sand-50 dark:bg-forest-900/60 rounded-2xl p-4 border border-sand-200 dark:border-forest-800 text-xs text-sand-600 dark:text-sand-300 flex items-center justify-between">
        <span>
          Telemetry synthesized directly from live database tables: <code className="text-forest-950 dark:text-sand-100 font-semibold">orders</code>, <code className="text-forest-950 dark:text-sand-100 font-semibold">medicines</code>, and <code className="text-forest-950 dark:text-sand-100 font-semibold">prescriptions</code> in schema <code className="text-ochre-800 dark:text-ochre-400 font-bold">NEW_PHAR</code>.
        </span>
        <span className="font-mono text-sand-400 dark:text-sand-500 text-[11px]">Port 8081 connected</span>
      </div>
    </div>
  );
};
export default AdminReports;
