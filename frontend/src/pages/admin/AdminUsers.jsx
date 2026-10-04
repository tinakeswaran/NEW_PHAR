import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Mail, MapPin, Phone, Search, ShieldCheck, UserRound, Users, 
  FileText, ShoppingBag, CheckCircle2, XCircle, ArrowUpRight, Filter
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Drawer, EmptyState, ErrorState, LoadingState, PageHeader, StatusBadge, currency, formatDate } from '../../components/admin/AdminUI';

export const AdminUsers = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    const results = await Promise.allSettled([
      adminService.getAllUsers(),
      adminService.getAllOrders(),
      adminService.getPrescriptions()
    ]);
    if (results[0].status === 'rejected') {
      setError(results[0].reason?.response?.data?.message || 'Customer registry could not be loaded.');
    } else {
      setUsers(results[0].value || []);
    }
    setOrders(results[1].status === 'fulfilled' ? results[1].value || [] : []);
    setPrescriptions(results[2].status === 'fulfilled' ? results[2].value || [] : []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setQuery(searchParams.get('search') || ''); }, [searchParams]);

  const filtered = useMemo(() => users.filter((user) => {
    const queryMatches = !query.trim() || [user.name, user.email, user.phone, user.role].some((value) => 
      String(value || '').toLowerCase().includes(query.trim().toLowerCase())
    );
    return queryMatches && (statusFilter === 'all' || user.status === statusFilter);
  }), [users, query, statusFilter]);

  const administratorAccounts = users.filter((user) => user.role === 'ROLE_ADMIN');
  const customerAccounts = filtered.filter((user) => user.role !== 'ROLE_ADMIN');

  const searchCustomers = (value) => {
    setQuery(value);
    setSearchParams(value.trim() ? { search: value.trim() } : {});
  };

  const toggleStatus = async (user) => {
    const nextStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      const updated = await adminService.updateUserStatus(user.id, nextStatus);
      setUsers((previous) => previous.map((row) => row.id === user.id ? { ...row, ...updated } : row));
      setSelectedCustomer((previous) => previous?.id === user.id ? { ...previous, ...updated } : previous);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Patient account status could not be updated.');
    }
  };

  const customerOrders = selectedCustomer ? orders.filter((order) => order.user?.id === selectedCustomer.id) : [];
  const customerPrescriptions = selectedCustomer ? prescriptions.filter((prescription) => prescription.user?.id === selectedCustomer.id) : [];

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        eyebrow="PATIENT & IDENTITY REGISTRY"
        title="Patient Accounts"
        subtitle="Manage registered patient profiles, prescription histories, and clinical account privileges."
        actions={
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sand-100 dark:bg-forest-900 text-forest-800 dark:text-sand-300 text-xs font-semibold tracking-wide border border-sand-200 dark:border-forest-800">
              <Users size={14} className="text-ochre-600 dark:text-ochre-400" />
              {customerAccounts.length} Active Patients · {users.length} Total Accounts
            </span>
          </div>
        }
      />

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-forest-900/60 rounded-3xl border border-sand-200 dark:border-forest-800 p-4 sm:p-5 shadow-subtle flex flex-col md:flex-row gap-4 items-center justify-between transition-colors">
        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-sand-400 dark:text-sand-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => searchCustomers(e.target.value)}
            placeholder="Search by name, email, or telephone..."
            className="w-full pl-11 pr-4 py-2.5 bg-sand-50 dark:bg-forest-950/60 border border-sand-200 dark:border-forest-800 rounded-xl text-sm focus:outline-none focus:border-forest-700 dark:focus:border-mint-500/50 text-forest-950 dark:text-sand-100 placeholder-sand-400 dark:placeholder-forest-500 transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={15} className="text-sand-500 dark:text-sand-400" />
          <span className="text-xs font-semibold text-sand-600 dark:text-sand-400 uppercase tracking-wider">Status:</span>
          <div className="flex items-center bg-sand-100 dark:bg-forest-950/60 p-1 rounded-xl text-xs font-medium border border-sand-200 dark:border-forest-800">
            {['all', 'ACTIVE', 'INACTIVE'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg transition capitalize ${
                  statusFilter === status
                    ? 'bg-white dark:bg-forest-800 text-forest-950 dark:text-white font-semibold shadow-xs'
                    : 'text-forest-700 dark:text-sand-400 hover:text-forest-950 dark:hover:text-white'
                }`}
              >
                {status === 'all' ? 'All Records' : status.toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingState label="Verifying patient accounts database..." />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <>
          {/* Administrator Tier Notice */}
          {administratorAccounts.length > 0 && (
            <div className="bg-forest-900 dark:bg-forest-900/90 text-white rounded-3xl p-5 shadow-subtle border border-forest-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck size={18} className="text-ochre-300" />
                  <h3 className="text-base tracking-wide font-bold">Clinical Administrators & Governance</h3>
                </div>
                <span className="text-xs text-sand-300 uppercase tracking-wider font-mono">
                  {administratorAccounts.length} Protected Role{administratorAccounts.length > 1 ? 's' : ''}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {administratorAccounts.map((admin) => (
                  <button
                    key={admin.id}
                    onClick={() => setSelectedCustomer(admin)}
                    className="flex items-center gap-3.5 p-3 rounded-xl bg-white/10 dark:bg-forest-950/60 hover:bg-white/15 dark:hover:bg-forest-950 transition text-left border border-white/10 dark:border-forest-800 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-ochre-500/20 text-ochre-300 flex items-center justify-center font-bold text-sm shrink-0 border border-ochre-400/30">
                      {admin.name?.charAt(0) || 'A'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm text-white truncate group-hover:text-ochre-200 transition">
                        {admin.name || 'Clinical Administrator'}
                      </p>
                      <p className="text-xs text-sand-300 truncate font-mono">{admin.email}</p>
                    </div>
                    <ArrowUpRight size={15} className="text-white/40 group-hover:text-white transition shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Patients Registry Table */}
          {customerAccounts.length === 0 ? (
            <EmptyState
              title={users.length ? (query || statusFilter !== 'all' ? 'No matching patient records' : 'No patients registered') : 'No accounts detected'}
              description={users.length ? 'Adjust your search terms or status filter to locate patient profiles.' : 'Patients will populate here once account registration occurs.'}
              icon={Users}
            />
          ) : (
            <div className="bg-white dark:bg-forest-900/60 rounded-3xl border border-sand-200 dark:border-forest-800 shadow-subtle overflow-hidden">
              <div className="px-6 py-4 border-b border-sand-200 dark:border-forest-800 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-forest-700 dark:text-sand-300">
                  Registered Patients ({customerAccounts.length})
                </span>
                <span className="text-xs text-sand-500 dark:text-sand-400">Click patient row to view comprehensive medical file</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-sand-200 dark:border-forest-800 bg-sand-100/70 dark:bg-forest-950 text-forest-800 dark:text-sand-200 text-xs uppercase tracking-wider font-bold">
                      <th className="py-3.5 px-6">Patient</th>
                      <th className="py-3.5 px-6">Contact / Phone</th>
                      <th className="py-3.5 px-6 text-center">Prescriptions</th>
                      <th className="py-3.5 px-6 text-center">Orders</th>
                      <th className="py-3.5 px-6">Account Status</th>
                      <th className="py-3.5 px-6 text-right">Privilege Controls</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand-100 dark:divide-forest-800">
                    {customerAccounts.map((user) => {
                      const userOrdersCount = orders.filter((o) => o.user?.id === user.id).length;
                      const userRxCount = prescriptions.filter((p) => p.user?.id === user.id).length;
                      return (
                        <tr
                          key={user.id}
                          onClick={() => setSelectedCustomer(user)}
                          className="hover:bg-sand-50/60 dark:hover:bg-forest-800/40 cursor-pointer transition group"
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-sand-100 dark:bg-forest-800 text-forest-900 dark:text-white font-bold flex items-center justify-center border border-sand-200 dark:border-forest-700 group-hover:bg-forest-900 group-hover:text-white transition">
                                {user.name?.charAt(0) || 'U'}
                              </div>
                              <div>
                                <p className="font-bold text-forest-950 dark:text-white group-hover:text-forest-700 dark:group-hover:text-mint-400 transition">
                                  {user.name}
                                </p>
                                <p className="text-xs text-sand-500 dark:text-sand-400 font-mono">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-forest-700 dark:text-sand-300">
                            {user.phone ? (
                              <span className="font-mono text-xs">{user.phone}</span>
                            ) : (
                              <span className="text-xs text-sand-400 dark:text-sand-500 italic">Not on file</span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span className={`inline-flex items-center justify-center min-w-6 px-2 py-0.5 rounded-full text-xs font-semibold ${
                              userRxCount > 0 ? 'bg-ochre-100 dark:bg-ochre-950/40 text-ochre-800 dark:text-ochre-300' : 'bg-sand-100 dark:bg-forest-800 text-sand-500 dark:text-sand-400'
                            }`}>
                              {userRxCount}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span className={`inline-flex items-center justify-center min-w-6 px-2 py-0.5 rounded-full text-xs font-semibold ${
                              userOrdersCount > 0 ? 'bg-forest-100 dark:bg-forest-800 text-forest-900 dark:text-sand-200' : 'bg-sand-100 dark:bg-forest-800 text-sand-500 dark:text-sand-400'
                            }`}>
                              {userOrdersCount}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <StatusBadge status={user.status} />
                          </td>
                          <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => toggleStatus(user)}
                              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${
                                user.status === 'ACTIVE'
                                  ? 'border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                                  : 'border-sand-200 dark:border-forest-700 text-forest-800 dark:text-sand-200 hover:bg-sand-100 dark:hover:bg-forest-800'
                              }`}
                            >
                              {user.status === 'ACTIVE' ? 'Suspend Access' : 'Restore Access'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Patient Profile Drawer */}
      <Drawer
        open={Boolean(selectedCustomer)}
        onClose={() => setSelectedCustomer(null)}
        title={selectedCustomer?.role === 'ROLE_ADMIN' ? 'Clinical Administrator' : selectedCustomer?.name || 'Patient Profile'}
        subtitle={selectedCustomer?.email || ''}
        width="large"
        footer={
          selectedCustomer?.role !== 'ROLE_ADMIN' && selectedCustomer && (
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-sand-500 dark:text-sand-400">
                User status is currently <span className="font-semibold text-forest-900 dark:text-sand-100">{selectedCustomer.status}</span>
              </span>
              <button
                onClick={() => toggleStatus(selectedCustomer)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-2 ${
                  selectedCustomer.status === 'ACTIVE'
                    ? 'bg-rose-600 text-white hover:bg-rose-700'
                    : 'bg-forest-900 dark:bg-forest-800 text-white hover:bg-forest-800 dark:hover:bg-forest-700'
                }`}
              >
                <ShieldCheck size={16} />
                {selectedCustomer.status === 'ACTIVE' ? 'Suspend Account' : 'Reactivate Account'}
              </button>
            </div>
          )
        }
      >
        {selectedCustomer && (
          <div className="space-y-6">
            {/* Header Badge Card */}
            <div className="bg-sand-50 dark:bg-forest-900/60 rounded-2xl p-5 border border-sand-200 dark:border-forest-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-forest-900 dark:bg-forest-800 text-white text-2xl font-bold flex items-center justify-center shadow-sm">
                  {selectedCustomer.role === 'ROLE_ADMIN' ? 'A' : selectedCustomer.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h4 className="text-lg text-forest-950 dark:text-white font-bold">
                    {selectedCustomer.role === 'ROLE_ADMIN' ? 'Administrator' : selectedCustomer.name}
                  </h4>
                  <p className="text-xs text-sand-500 dark:text-sand-400 font-mono">{selectedCustomer.email}</p>
                </div>
              </div>
              <StatusBadge status={selectedCustomer.status} />
            </div>

            {/* Coordinates / Contact Info */}
            <div className="bg-white dark:bg-forest-900/40 rounded-2xl p-5 border border-sand-200 dark:border-forest-800 space-y-3">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-forest-700 dark:text-sand-300 border-b border-sand-200 dark:border-forest-800 pb-2">
                Patient Coordinates
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2.5 text-forest-800 dark:text-sand-200">
                  <Mail size={16} className="text-ochre-600 dark:text-ochre-400 shrink-0" />
                  <span className="truncate">{selectedCustomer.email}</span>
                </div>
                <div className="flex items-center gap-2.5 text-forest-800 dark:text-sand-200">
                  <Phone size={16} className="text-ochre-600 dark:text-ochre-400 shrink-0" />
                  <span>{selectedCustomer.phone || 'No phone recorded'}</span>
                </div>
                <div className="flex items-center gap-2.5 text-forest-800 dark:text-sand-200 col-span-full">
                  <MapPin size={16} className="text-ochre-600 dark:text-ochre-400 shrink-0" />
                  <span>{selectedCustomer.address || 'No residential address on file'}</span>
                </div>
                <div className="flex items-center gap-2.5 text-forest-800 dark:text-sand-200 col-span-full">
                  <UserRound size={16} className="text-ochre-600 dark:text-ochre-400 shrink-0" />
                  <span className="capitalize">Role: {selectedCustomer.role?.replace('ROLE_', '').toLowerCase()}</span>
                </div>
              </div>
            </div>

            {/* Prescription Submissions */}
            <div className="bg-white dark:bg-forest-900/40 rounded-2xl p-5 border border-sand-200 dark:border-forest-800 space-y-3">
              <div className="flex items-center justify-between border-b border-sand-200 dark:border-forest-800 pb-2">
                <h5 className="text-xs font-semibold uppercase tracking-wider text-forest-700 dark:text-sand-300 flex items-center gap-2">
                  <FileText size={14} className="text-ochre-600 dark:text-ochre-400" />
                  Prescription History ({customerPrescriptions.length})
                </h5>
              </div>
              {customerPrescriptions.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {customerPrescriptions.map((rx) => (
                    <div key={rx.id} className="flex items-center justify-between p-3 rounded-xl bg-sand-50 dark:bg-forest-950/60 border border-sand-200 dark:border-forest-800 text-sm">
                      <div>
                        <p className="font-semibold text-forest-900 dark:text-sand-100">Prescription #{rx.id}</p>
                        <p className="text-xs text-sand-500 dark:text-sand-400">Submitted {formatDate(rx.uploadedAt)}</p>
                      </div>
                      <StatusBadge status={rx.status} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-sand-500 dark:text-sand-400 italic py-2">No prescription documents submitted by this patient.</p>
              )}
            </div>

            {/* Order Fulfillment History */}
            <div className="bg-white dark:bg-forest-900/40 rounded-2xl p-5 border border-sand-200 dark:border-forest-800 space-y-3">
              <div className="flex items-center justify-between border-b border-sand-200 dark:border-forest-800 pb-2">
                <h5 className="text-xs font-semibold uppercase tracking-wider text-forest-700 dark:text-sand-300 flex items-center gap-2">
                  <ShoppingBag size={14} className="text-ochre-600 dark:text-ochre-400" />
                  Order Ledger ({customerOrders.length})
                </h5>
              </div>
              {customerOrders.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {customerOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-sand-50 dark:bg-forest-950/60 border border-sand-200 dark:border-forest-800 text-sm">
                      <div>
                        <p className="font-semibold text-forest-900 dark:text-sand-100">Order #{order.id}</p>
                        <p className="text-xs text-sand-500 dark:text-sand-400">{formatDate(order.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-forest-900 dark:text-sand-100">{currency(order.totalAmount)}</span>
                        <StatusBadge status={order.orderStatus} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-sand-500 dark:text-sand-400 italic py-2">No retail orders associated with this account.</p>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
export default AdminUsers;
