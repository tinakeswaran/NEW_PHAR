import React, { useCallback, useEffect, useState } from 'react';
import { 
  Package, 
  Plus, 
  Edit3, 
  Trash2, 
  AlertCircle,
  Search
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { medicineService } from '../../services/medicineService';
import { 
  Drawer, 
  EmptyState, 
  ErrorState, 
  LoadingState, 
  PageHeader 
} from '../../components/admin/AdminUI';

export const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [catRows, medRows] = await Promise.all([
        medicineService.getCategories(),
        medicineService.getAllMedicines()
      ]);
      setCategories(catRows);
      setMedicines(medRows);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load categories.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditingId(null);
    setFormData({ name: '', description: '' });
    setFormError('');
    setDrawerOpen(true);
  };

  const openEdit = (cat) => {
    setEditingId(cat.id);
    setFormData({ name: cat.name || '', description: cat.description || '' });
    setFormError('');
    setDrawerOpen(true);
  };

  const saveCategory = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      if (editingId) {
        await adminService.updateCategory(editingId, formData);
      } else {
        await adminService.createCategory(formData);
      }
      setDrawerOpen(false);
      await load();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save category.');
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (cat) => {
    if (!window.confirm(`Are you certain you want to delete category "${cat.name}"? Formulations in this category will be unassigned.`)) return;
    try {
      await adminService.deleteCategory(cat.id);
      await load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete category.');
    }
  };

  const filteredCategories = categories.filter((c) => 
    !search.trim() || c.name.toLowerCase().includes(search.toLowerCase()) || (c.description || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        eyebrow="CLASSIFICATION LEDGER"
        title="Therapeutic Categories"
        subtitle="Manage clinical category boundaries, pharmaceutical grouping tags, and catalog taxonomies."
        actions={
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-forest-900 text-sand-50 hover:bg-forest-800 text-xs font-bold transition shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4 text-mint-400" />
            <span>Add Therapeutic Category</span>
          </button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-forest-900/60 p-4 sm:p-5 rounded-3xl border border-sand-200 dark:border-forest-800 shadow-subtle flex items-center justify-between gap-4 transition-colors">
        <div className="flex-1 flex items-center px-3.5 bg-sand-50/70 dark:bg-forest-950/60 rounded-2xl border border-sand-200 dark:border-forest-800 max-w-md">
          <Search className="w-4 h-4 text-sand-400 dark:text-sand-400 mr-2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search therapeutic categories…"
            className="w-full bg-transparent py-2.5 text-xs text-forest-950 dark:text-sand-100 placeholder-sand-400 dark:placeholder-forest-500 outline-none"
          />
        </div>
        <span className="text-xs font-bold text-sand-500 dark:text-sand-400">
          {filteredCategories.length} Categories Active
        </span>
      </div>

      {loading ? (
        <LoadingState label="Indexing therapeutic categories…" />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCategories.map((cat) => {
            const count = medicines.filter((m) => m.category?.id === cat.id).length;

            return (
              <div
                key={cat.id}
                className="bg-white dark:bg-forest-900/60 p-6 rounded-3xl border border-sand-200 dark:border-forest-800 shadow-subtle hover:shadow-elevated transition flex flex-col justify-between h-52 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-sand-400 dark:text-sand-500">
                      ID #{cat.id}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-sand-100 dark:bg-forest-800 text-forest-900 dark:text-sand-200 text-[10px] font-black">
                      {count} Formulation{count === 1 ? '' : 's'}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-forest-950 dark:text-white group-hover:text-forest-700 dark:group-hover:text-mint-400 transition">
                    {cat.name}
                  </h3>

                  <p className="text-xs text-sand-500 dark:text-sand-400 line-clamp-2 leading-relaxed font-normal">
                    {cat.description || 'Clinical therapeutic branch'}
                  </p>
                </div>

                <div className="pt-4 border-t border-sand-100 dark:border-forest-800 flex items-center justify-end gap-2">
                  <button
                    onClick={() => openEdit(cat)}
                    className="p-2 rounded-xl text-sand-500 dark:text-sand-400 hover:text-forest-950 dark:hover:text-white hover:bg-sand-100 dark:hover:bg-forest-800 transition"
                    title="Edit category"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteCategory(cat)}
                    className="p-2 rounded-xl text-sand-500 dark:text-sand-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                    title="Delete category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Drawer Modal */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editingId ? 'Edit Therapeutic Category' : 'Register New Category'}
        subtitle="Define clinical therapeutic branch specifications."
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
              onClick={saveCategory}
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-forest-900 dark:bg-forest-800 text-sand-50 text-xs font-bold hover:bg-forest-800 dark:hover:bg-forest-700 transition"
            >
              {saving ? 'Saving…' : editingId ? 'Update Category' : 'Create Category'}
            </button>
          </>
        }
      >
        {formError && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs font-medium text-rose-800 dark:text-rose-200">
            {formError}
          </div>
        )}

        <form onSubmit={saveCategory} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-forest-900 dark:text-sand-200 block">Category Label</label>
            <input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Cardiovascular & Lipid Support"
              className="w-full bg-sand-50 dark:bg-forest-900/60 p-2.5 rounded-xl border border-sand-200 dark:border-forest-800 text-forest-950 dark:text-sand-100 placeholder-sand-400 dark:placeholder-forest-500 outline-none focus:border-forest-700 dark:focus:border-mint-500/50"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-forest-900 dark:text-sand-200 block">Clinical Scope / Description</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Scope of therapeutic formulations, clinical indications, and usage context…"
              className="w-full bg-sand-50 dark:bg-forest-900/60 p-2.5 rounded-xl border border-sand-200 dark:border-forest-800 text-forest-950 dark:text-sand-100 placeholder-sand-400 dark:placeholder-forest-500 outline-none focus:border-forest-700 dark:focus:border-mint-500/50"
            />
          </div>
        </form>
      </Drawer>
    </div>
  );
};
