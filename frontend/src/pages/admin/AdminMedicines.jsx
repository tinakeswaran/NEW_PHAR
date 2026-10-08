import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Edit3, 
  FileText, 
  Plus, 
  Minus,
  Search, 
  Trash2, 
  Boxes, 
  AlertCircle, 
  RotateCcw,
  CheckCircle2,
  Tag,
  Image,
  Upload
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { medicineService } from '../../services/medicineService';
import { formatINR } from '../../utils/formatters';
import { 
  Drawer, 
  EmptyState, 
  ErrorState, 
  LoadingState, 
  PageHeader, 
  StatusBadge, 
  currency 
} from '../../components/admin/AdminUI';

const blankMedicine = { 
  name: '', 
  brand: '', 
  composition: '', 
  dosage: '', 
  unitType: 'units', 
  unitsPerPack: 1, 
  description: '', 
  price: '', 
  stockQuantity: '', 
  categoryId: '', 
  requiresPrescription: false, 
  imageUrl: '', 
  ailment: '',
  badge: ''
};

const stockStatus = (quantity) => Number(quantity) <= 0 ? 'Out of stock' : Number(quantity) <= 10 ? 'Low stock' : 'In stock';

const BADGES = ['NEW', 'BEST SELLER', 'POPULAR', 'LOW STOCK', 'RX REQUIRED', 'SPECIAL OFFER'];

export const AdminMedicines = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [rxFilter, setRxFilter] = useState('all');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(blankMedicine);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [updatingStockId, setUpdatingStockId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [medicineRows, categoryRows] = await Promise.all([
        medicineService.getAllMedicines(), 
        medicineService.getCategories()
      ]);
      setMedicines(medicineRows || []); 
      setCategories(categoryRows || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Dispensary inventory could not be loaded.');
    } finally { 
      setLoading(false); 
    }
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setSearch(searchParams.get('search') || ''); }, [searchParams]);

  const filtered = useMemo(() => medicines.filter((medicine) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || [medicine.name, medicine.brand, medicine.composition, medicine.ailment].some((value) => String(value || '').toLowerCase().includes(query));
    const matchesCategory = categoryFilter === 'all' || String(medicine.category?.id || '') === categoryFilter;
    const quantity = Number(medicine.stockQuantity);
    const matchesStock = stockFilter === 'all' || (stockFilter === 'out' ? quantity <= 0 : stockFilter === 'low' ? quantity > 0 && quantity <= 10 : quantity > 10);
    const matchesRx = rxFilter === 'all' || (rxFilter === 'required' ? medicine.requiresPrescription : !medicine.requiresPrescription);
    return matchesSearch && matchesCategory && matchesStock && matchesRx;
  }), [medicines, search, categoryFilter, stockFilter, rxFilter]);

  const openCreate = () => { 
    setEditingId(null); 
    setFormData({ ...blankMedicine, categoryId: categories[0]?.id || '' }); 
    setFormError(''); 
    setDrawerOpen(true); 
  };

  const openEdit = (medicine) => { 
    setEditingId(medicine.id); 
    setFormData({ 
      name: medicine.name || '', 
      brand: medicine.brand || '', 
      composition: medicine.composition || '', 
      dosage: medicine.dosage || '', 
      unitType: medicine.unitType || 'units', 
      unitsPerPack: medicine.unitsPerPack || 1, 
      description: medicine.description || '', 
      price: medicine.price ?? '', 
      stockQuantity: medicine.stockQuantity ?? '', 
      categoryId: medicine.category?.id || '', 
      requiresPrescription: Boolean(medicine.requiresPrescription), 
      imageUrl: medicine.imageUrl || '', 
      ailment: medicine.ailment || '',
      badge: medicine.badge || ''
    }); 
    setFormError(''); 
    setDrawerOpen(true); 
  };

  const handleQuickStock = async (medicine, delta) => {
    const newQty = Math.max(0, Number(medicine.stockQuantity || 0) + delta);
    setUpdatingStockId(medicine.id);
    try {
      await adminService.updateMedicineStock(medicine.id, newQty);
      setMedicines(prev => prev.map(m => m.id === medicine.id ? { ...m, stockQuantity: newQty } : m));
    } catch (err) {
      alert('Failed to adjust inventory stock.');
    } finally {
      setUpdatingStockId(null);
    }
  };

  const saveMedicine = async (event) => {
    event.preventDefault(); 
    setSaving(true); 
    setFormError('');
    const payload = { 
      ...formData, 
      price: Number(formData.price), 
      stockQuantity: Number(formData.stockQuantity), 
      categoryId: Number(formData.categoryId), 
      unitsPerPack: Number(formData.unitsPerPack),
      badge: formData.badge || null
    };

    try {
      if (editingId) await adminService.updateMedicine(editingId, payload);
      else await adminService.createMedicine(payload);
      setDrawerOpen(false); 
      await load();
    } catch (requestError) {
      setFormError(requestError.response?.data?.message || 'Failed to save medication changes.');
    } finally { 
      setSaving(false); 
    }
  };

  const deleteMedicine = async (medicine) => {
    if (!window.confirm(`Are you certain you wish to delete "${medicine.name}" from the active dispensary catalog?`)) return;
    try {
      await adminService.deleteMedicine(medicine.id);
      await load();
    } catch (requestError) {
      alert(requestError.response?.data?.message || 'Failed to delete medication.');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        eyebrow="INVENTORY REPOSITORY"
        title="Dispensary Formulations"
        subtitle="Manage clinical catalog items, stock replenishments in real-time, INR pricing tiers, and prescription mandates."
        actions={
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-forest-900 hover:bg-forest-800 text-sand-50 text-xs font-bold transition shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Formulation
          </button>
        }
      />

      {error && <ErrorState message={error} onRetry={load} />}

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-forest-900/60 p-4 rounded-2xl border border-sand-200 dark:border-forest-800 shadow-subtle flex flex-col md:flex-row items-center gap-3 transition-colors">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-sand-400 dark:text-sand-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search formulation, brand, active compound, or indication..."
            className="w-full bg-sand-50 dark:bg-forest-950/60 pl-10 pr-4 py-2 rounded-xl border border-sand-200 dark:border-forest-800 text-xs text-forest-950 dark:text-sand-100 placeholder-sand-400 dark:placeholder-forest-500 outline-none focus:border-forest-700 dark:focus:border-mint-500/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-sand-50 dark:bg-forest-950/60 border border-sand-200 dark:border-forest-800 text-forest-900 dark:text-sand-200 text-xs font-bold py-2 px-3 rounded-xl outline-none"
          >
            <option value="all" className="bg-sand-50 dark:bg-forest-900 text-forest-950 dark:text-sand-100">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={String(c.id)} className="bg-sand-50 dark:bg-forest-900 text-forest-950 dark:text-sand-100">{c.name}</option>
            ))}
          </select>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="bg-sand-50 dark:bg-forest-950/60 border border-sand-200 dark:border-forest-800 text-forest-900 dark:text-sand-200 text-xs font-bold py-2 px-3 rounded-xl outline-none"
          >
            <option value="all" className="bg-sand-50 dark:bg-forest-900 text-forest-950 dark:text-sand-100">All Stock</option>
            <option value="in" className="bg-sand-50 dark:bg-forest-900 text-forest-950 dark:text-sand-100">In Stock (&gt;10)</option>
            <option value="low" className="bg-sand-50 dark:bg-forest-900 text-forest-950 dark:text-sand-100">Low Stock (1-10)</option>
            <option value="out" className="bg-sand-50 dark:bg-forest-900 text-forest-950 dark:text-sand-100">Out of Stock (0)</option>
          </select>

          <select
            value={rxFilter}
            onChange={(e) => setRxFilter(e.target.value)}
            className="bg-sand-50 dark:bg-forest-950/60 border border-sand-200 dark:border-forest-800 text-forest-900 dark:text-sand-200 text-xs font-bold py-2 px-3 rounded-xl outline-none"
          >
            <option value="all" className="bg-sand-50 dark:bg-forest-900 text-forest-950 dark:text-sand-100">All Authorization</option>
            <option value="required" className="bg-sand-50 dark:bg-forest-900 text-forest-950 dark:text-sand-100">Rx Required</option>
            <option value="otc" className="bg-sand-50 dark:bg-forest-900 text-forest-950 dark:text-sand-100">OTC Free</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingState label="Loading formulation inventory..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No Formulations Found"
          description="Try adjusting your search criteria or register a new formulation."
          actionLabel="Add Formulation"
          onAction={openCreate}
        />
      ) : (
        <div className="bg-white dark:bg-forest-900/60 rounded-3xl border border-sand-200 dark:border-forest-800 shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sand-50 dark:bg-forest-950/50 border-b border-sand-200 dark:border-forest-800 text-sand-500 dark:text-sand-400 font-extrabold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Medication & Formulation</th>
                  <th className="py-3 px-4">Therapeutic Area</th>
                  <th className="py-3 px-4">Rate (₹)</th>
                  <th className="py-3 px-4">Active Badge</th>
                  <th className="py-3 px-4">Live Inventory (Stock)</th>
                  <th className="py-3 px-4">Rx Mandate</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100 dark:divide-forest-800">
                {filtered.map((medicine) => (
                  <tr key={medicine.id} className="hover:bg-sand-50/50 dark:hover:bg-forest-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-sand-100 dark:bg-forest-800 p-1 border border-sand-200 dark:border-forest-700 flex-shrink-0 flex items-center justify-center">
                          <img
                            src={medicine.imageUrl || '/images/medicines/placeholder.svg'}
                            alt={medicine.name}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/images/medicines/placeholder.svg';
                            }}
                            className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                          />
                        </div>
                        <div>
                          <strong className="font-bold text-forest-950 dark:text-white block text-xs">{medicine.name}</strong>
                          <span className="text-[11px] text-sand-500 dark:text-sand-400 font-medium">
                            {medicine.brand || 'PHARMED'} • {medicine.dosage || 'Standard'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-forest-900 dark:text-sand-200">
                      {medicine.category?.name || '—'}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-forest-950 dark:text-white">
                      {formatINR(medicine.price)}
                    </td>
                    <td className="py-3.5 px-4">
                      {medicine.badge ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 uppercase">
                          <Tag className="w-2.5 h-2.5" /> {medicine.badge}
                        </span>
                      ) : (
                        <span className="text-sand-400 dark:text-sand-500 text-[11px]">Standard</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={stockStatus(medicine.stockQuantity)}>
                          {medicine.stockQuantity} in stock
                        </StatusBadge>
                        {/* Quick stock +/- buttons */}
                        <div className="flex items-center border border-sand-200 dark:border-forest-800 rounded-lg bg-sand-50 dark:bg-forest-950/60 p-0.5">
                          <button
                            onClick={() => handleQuickStock(medicine, -5)}
                            disabled={updatingStockId === medicine.id || Number(medicine.stockQuantity) <= 0}
                            className="p-1 rounded text-sand-500 dark:text-sand-400 hover:text-forest-950 dark:hover:text-white hover:bg-white dark:hover:bg-forest-800 disabled:opacity-30 transition"
                            title="Decrease by 5"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleQuickStock(medicine, 10)}
                            disabled={updatingStockId === medicine.id}
                            className="p-1 rounded text-sand-500 dark:text-sand-400 hover:text-forest-950 dark:hover:text-white hover:bg-white dark:hover:bg-forest-800 disabled:opacity-30 transition"
                            title="Replenish by 10"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {medicine.requiresPrescription ? (
                        <span className="px-2 py-0.5 rounded-md bg-ochre-50 dark:bg-ochre-950/40 border border-ochre-200 dark:border-ochre-800/60 text-ochre-800 dark:text-ochre-300 text-[10px] font-extrabold">
                          Rx Mandated
                        </span>
                      ) : (
                        <span className="text-sand-400 dark:text-sand-500 font-medium text-[11px]">OTC Free</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => openEdit(medicine)}
                        className="p-1.5 rounded-lg text-sand-500 dark:text-sand-400 hover:text-forest-950 dark:hover:text-white hover:bg-sand-100 dark:hover:bg-forest-800 transition"
                        title="Edit formulation"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteMedicine(medicine)}
                        className="p-1.5 rounded-lg text-sand-500 dark:text-sand-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                        title="Delete formulation"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Drawer Modal for Create/Edit */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editingId ? 'Edit Formulation Details' : 'Register New Formulation'}
        subtitle="Ensure pharmaceutical properties and unit counts align with approved specifications."
        footer={
          <>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-sand-600 dark:text-sand-400 hover:bg-sand-100 dark:hover:bg-forest-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="medicine-form"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-sand-50 dark:text-forest-950 text-xs font-bold transition shadow-sm disabled:opacity-50"
            >
              {saving ? 'Committing…' : editingId ? 'Update Formulation' : 'Create Formulation'}
            </button>
          </>
        }
      >
        {formError && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs font-medium text-rose-800 dark:text-rose-200">
            {formError}
          </div>
        )}

        <form id="medicine-form" onSubmit={saveMedicine} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-forest-900 dark:text-sand-200 block">Medication Name</label>
            <input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-sand-50 dark:bg-forest-900/60 p-2.5 rounded-xl border border-sand-200 dark:border-forest-800 text-forest-950 dark:text-sand-100 placeholder-sand-400 dark:placeholder-forest-500 outline-none focus:border-forest-700 dark:focus:border-mint-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-forest-900 dark:text-sand-200 block">Manufacturer / Brand</label>
              <input
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full bg-sand-50 dark:bg-forest-900/60 p-2.5 rounded-xl border border-sand-200 dark:border-forest-800 text-forest-950 dark:text-sand-100 placeholder-sand-400 dark:placeholder-forest-500 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-forest-900 dark:text-sand-200 block">Category</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full bg-sand-50 dark:bg-forest-900/60 p-2.5 rounded-xl border border-sand-200 dark:border-forest-800 text-forest-950 dark:text-sand-100 outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id} className="bg-sand-50 dark:bg-forest-900 text-forest-950 dark:text-sand-100">{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-forest-900 dark:text-sand-200 block">Price (₹ INR)</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-sand-50 dark:bg-forest-900/60 p-2.5 rounded-xl border border-sand-200 dark:border-forest-800 text-forest-950 dark:text-sand-100 placeholder-sand-400 dark:placeholder-forest-500 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-forest-900 dark:text-sand-200 block">Inventory Stock Count</label>
              <input
                type="number"
                required
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                className="w-full bg-sand-50 dark:bg-forest-900/60 p-2.5 rounded-xl border border-sand-200 dark:border-forest-800 text-forest-950 dark:text-sand-100 placeholder-sand-400 dark:placeholder-forest-500 outline-none"
              />
            </div>
          </div>

          {/* Badge Selection */}
          <div className="space-y-1">
            <label className="font-bold text-forest-900 dark:text-sand-200 block">Product Highlight Badge</label>
            <select
              value={formData.badge}
              onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
              className="w-full bg-sand-50 dark:bg-forest-900/60 p-2.5 rounded-xl border border-sand-200 dark:border-forest-800 text-forest-950 dark:text-sand-100 outline-none cursor-pointer"
            >
              <option value="" className="bg-sand-50 dark:bg-forest-900 text-forest-950 dark:text-sand-100">No Badge (Standard)</option>
              {BADGES.map(b => (
                <option key={b} value={b} className="bg-sand-50 dark:bg-forest-900 text-forest-950 dark:text-sand-100">{b}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-forest-900 dark:text-sand-200 block">Dosage Specification</label>
              <input
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                placeholder="e.g. 15 tablets, 500mg"
                className="w-full bg-sand-50 dark:bg-forest-900/60 p-2.5 rounded-xl border border-sand-200 dark:border-forest-800 text-forest-950 dark:text-sand-100 placeholder-sand-400 dark:placeholder-forest-500 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-forest-900 dark:text-sand-200 block">Ailment / Indication</label>
              <input
                value={formData.ailment}
                onChange={(e) => setFormData({ ...formData, ailment: e.target.value })}
                placeholder="e.g. Type 2 diabetes care"
                className="w-full bg-sand-50 dark:bg-forest-900/60 p-2.5 rounded-xl border border-sand-200 dark:border-forest-800 text-forest-950 dark:text-sand-100 placeholder-sand-400 dark:placeholder-forest-500 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-forest-900 dark:text-sand-200 block">Composition</label>
            <input
              value={formData.composition}
              onChange={(e) => setFormData({ ...formData, composition: e.target.value })}
              placeholder="Active chemical or botanical ingredients"
              className="w-full bg-sand-50 dark:bg-forest-900/60 p-2.5 rounded-xl border border-sand-200 dark:border-forest-800 text-forest-950 dark:text-sand-100 placeholder-sand-400 dark:placeholder-forest-500 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-forest-900 dark:text-sand-200 block">Therapeutic Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-sand-50 dark:bg-forest-900/60 p-2.5 rounded-xl border border-sand-200 dark:border-forest-800 text-forest-950 dark:text-sand-100 placeholder-sand-400 dark:placeholder-forest-500 outline-none"
            />
          </div>

          {/* Image Management & Preview Section */}
          <div className="p-3.5 bg-sand-50 dark:bg-forest-900/60 rounded-2xl border border-sand-200 dark:border-forest-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-forest-900 dark:text-sand-200 text-xs flex items-center gap-1.5">
                <Image size={14} className="text-emerald-500" />
                <span>Formulation Image & Asset</span>
              </label>
              <span className="text-[10px] text-sand-500 dark:text-sand-400">Live Preview & Asset Path</span>
            </div>

            <div className="flex items-start gap-4">
              {/* Image Thumbnail Preview */}
              <div className="w-20 h-20 rounded-2xl bg-white dark:bg-forest-950 p-2 border border-sand-300 dark:border-forest-700 flex-shrink-0 flex items-center justify-center overflow-hidden shadow-xs relative">
                <img
                  src={formData.imageUrl || '/images/medicines/placeholder.svg'}
                  alt="Preview"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/medicines/placeholder.svg';
                  }}
                  className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                />
              </div>

              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="e.g. /images/medicines/vitacore-daily.svg or image URL"
                  className="w-full bg-white dark:bg-forest-950 p-2 rounded-xl border border-sand-300 dark:border-forest-700 text-xs text-forest-950 dark:text-sand-100 placeholder-sand-400 dark:placeholder-forest-500 outline-none"
                />

                <div className="flex items-center gap-2 flex-wrap">
                  <label className="px-3 py-1.5 rounded-xl bg-forest-900 dark:bg-emerald-600 text-sand-50 dark:text-forest-950 text-[11px] font-bold cursor-pointer hover:opacity-90 transition flex items-center gap-1 shadow-xs">
                    <Upload size={12} />
                    <span>Upload / Choose Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (evt) => {
                            setFormData({ ...formData, imageUrl: evt.target.result });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>

                  {formData.imageUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: '' })}
                      className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-100 transition"
                    >
                      Reset Image
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 p-3 bg-sand-50 dark:bg-forest-900/60 rounded-xl border border-sand-200 dark:border-forest-800 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.requiresPrescription}
                onChange={(e) => setFormData({ ...formData, requiresPrescription: e.target.checked })}
                className="w-4 h-4 accent-forest-900 text-forest-900"
              />
              <span className="font-bold text-forest-950 dark:text-sand-100">Require Doctor Prescription (Rx)</span>
            </label>
          </div>
        </form>
      </Drawer>
    </div>
  );
};
