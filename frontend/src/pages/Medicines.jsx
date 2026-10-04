import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { medicineService } from '../services/medicineService';
import { MedicineCard } from '../components/MedicineCard';
import { SearchBar } from '../components/SearchBar';
import { RecentlyViewed } from '../components/RecentlyViewed';
import { 
  SlidersHorizontal, 
  RotateCcw, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  LayoutGrid, 
  List,
  Filter,
  ArrowUpDown,
  PackageSearch
} from 'lucide-react';

export const Medicines = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('categoryId') || '');
  const [rxFilter, setRxFilter] = useState('ALL'); // ALL, RX_ONLY, OTC_ONLY
  const [stockOnly, setStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'price_asc', 'price_desc', 'name'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  const fetchMedicines = async (params = {}) => {
    setLoading(true);
    try {
      const data = await medicineService.searchMedicines(params);
      setMedicines(data || []);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const cats = await medicineService.getCategories();
        setCategories(cats || []);
        const catId = searchParams.get('categoryId');
        const query = searchParams.get('query');
        fetchMedicines({ categoryId: catId || undefined, query: query || undefined });
      } catch (err) {
        console.error(err);
      }
    };
    init();
  }, [searchParams]);

  const handleSearch = ({ query, categoryId }) => {
    setSelectedCategory(categoryId || '');
    if (categoryId) {
      setSearchParams({ categoryId, ...(query ? { query } : {}) });
    } else if (query) {
      setSearchParams({ query });
    } else {
      setSearchParams({});
    }
    fetchMedicines({ query, categoryId });
  };

  const handleCategoryClick = (catId) => {
    const newCat = selectedCategory === String(catId) ? '' : String(catId);
    setSelectedCategory(newCat);
    if (newCat) {
      setSearchParams({ categoryId: newCat });
    } else {
      setSearchParams({});
    }
    fetchMedicines({ categoryId: newCat || undefined });
  };

  const handleResetFilters = () => {
    setSelectedCategory('');
    setRxFilter('ALL');
    setStockOnly(false);
    setSortBy('featured');
    setSearchParams({});
    fetchMedicines({});
  };

  // Filter application
  let filteredMedicines = medicines.filter((m) => {
    if (rxFilter === 'RX_ONLY' && !m.requiresPrescription) return false;
    if (rxFilter === 'OTC_ONLY' && m.requiresPrescription) return false;
    if (stockOnly && (m.stockQuantity ?? 0) <= 0) return false;
    return true;
  });

  // Sorting
  if (sortBy === 'price_asc') {
    filteredMedicines.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
  } else if (sortBy === 'price_desc') {
    filteredMedicines.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
  } else if (sortBy === 'name') {
    filteredMedicines.sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <div className="space-y-10 py-6 sm:py-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-sand-200 dark:border-forest-800 pb-6">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-forest-700 dark:text-emerald-400">
            Certified Indian Formulations
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-forest-950 dark:text-sand-100 tracking-tight mt-1">
            Clinical Dispensary Catalog
          </h1>
          <p className="text-xs sm:text-sm text-sand-500 dark:text-sand-400 font-medium mt-1">
            Explore authentic medications, active compound formulas, and clinical healthcare items priced in Indian Rupees (₹).
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          {/* Sort By Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white dark:bg-forest-900 border border-sand-300 dark:border-forest-700 text-forest-900 dark:text-sand-200 text-xs font-bold py-2 pl-3 pr-8 rounded-xl appearance-none cursor-pointer outline-none"
            >
              <option value="featured">Featured Formulations</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
            <ArrowUpDown className="w-3 h-3 text-sand-400 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-white dark:bg-forest-900 rounded-xl border border-sand-300 dark:border-forest-700 shadow-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition ${
                viewMode === 'grid' 
                  ? 'bg-forest-900 text-white dark:bg-emerald-600 dark:text-forest-950' 
                  : 'text-forest-700 dark:text-sand-300 hover:text-forest-950 dark:hover:text-white'
              }`}
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs transition ${
                viewMode === 'list' 
                  ? 'bg-forest-900 text-white dark:bg-emerald-600 dark:text-forest-950' 
                  : 'text-forest-700 dark:text-sand-300 hover:text-forest-950 dark:hover:text-white'
              }`}
              title="Compact list view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Smart Search Input Bar with Autocomplete & Recent/Popular searches */}
      <SearchBar 
        onSearch={handleSearch} 
        categories={categories} 
        initialQuery={searchParams.get('query') || ''}
        initialCategoryId={searchParams.get('categoryId') || ''}
      />

      {/* Main Catalog Grid & Filter Rail */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Filter Sidebar */}
        <aside className="bg-white dark:bg-forest-900/40 p-6 rounded-3xl border border-sand-200 dark:border-forest-800 shadow-subtle space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-sand-100 dark:border-forest-800">
            <h3 className="font-extrabold text-forest-950 dark:text-sand-100 text-sm flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-forest-700 dark:text-emerald-400" />
              <span>Catalog Filters</span>
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-[11px] font-bold text-sand-500 hover:text-forest-900 dark:text-sand-400 dark:hover:text-sand-200 flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Rx Filter Radios */}
          <div className="space-y-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-sand-500 dark:text-sand-400 block">
              Authorization Status
            </span>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-sand-50 dark:bg-forest-950/80 rounded-xl border border-sand-200 dark:border-forest-800">
              {[
                { key: 'ALL', label: 'All' },
                { key: 'RX_ONLY', label: 'Rx Only' },
                { key: 'OTC_ONLY', label: 'OTC' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setRxFilter(tab.key)}
                  className={`py-1.5 text-[11px] font-bold rounded-lg transition ${
                    rxFilter === tab.key
                      ? 'bg-forest-900 text-white dark:bg-emerald-600 dark:text-forest-950 shadow-xs'
                      : 'text-forest-800 dark:text-sand-300 hover:text-forest-950 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* In-Stock Toggle */}
          <div className="pt-2">
            <label className="flex items-center justify-between p-3 rounded-2xl bg-sand-50/70 dark:bg-forest-950/60 border border-sand-200 dark:border-forest-800 cursor-pointer hover:bg-sand-100 dark:hover:bg-forest-900 transition">
              <span className="text-xs font-bold text-forest-900 dark:text-sand-200">In-Stock Only</span>
              <input
                type="checkbox"
                checked={stockOnly}
                onChange={(e) => setStockOnly(e.target.checked)}
                className="w-4 h-4 rounded text-forest-900 focus:ring-forest-800 accent-forest-900 dark:accent-emerald-500"
              />
            </label>
          </div>

          {/* Category Chips List */}
          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-sand-500 dark:text-sand-400 block">
              Therapeutic Categories ({categories.length})
            </span>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => handleCategoryClick('')}
                className={`text-left text-xs font-bold px-3 py-2 rounded-xl transition flex items-center justify-between ${
                  !selectedCategory
                    ? 'bg-forest-900 text-sand-50 dark:bg-emerald-600 dark:text-forest-950 shadow-xs'
                    : 'text-forest-800 dark:text-sand-300 hover:bg-sand-100 dark:hover:bg-forest-800'
                }`}
              >
                <span>All Categories</span>
                <span className="text-[10px] opacity-70">({medicines.length})</span>
              </button>

              {categories.map((c) => {
                const count = medicines.filter((m) => m.category?.id === c.id).length;
                const isSelected = selectedCategory === String(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => handleCategoryClick(c.id)}
                    className={`text-left text-xs font-bold px-3 py-2 rounded-xl transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-forest-900 text-sand-50 dark:bg-emerald-600 dark:text-forest-950 shadow-xs'
                        : 'text-forest-800 dark:text-sand-300 hover:bg-sand-100 dark:hover:bg-forest-800'
                    }`}
                  >
                    <span className="truncate pr-2">{c.name}</span>
                    <span className="text-[10px] opacity-70">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Right Product Grid Column */}
        <main className="lg:col-span-3 space-y-6">
          {/* Active Filter Chips Bar */}
          <div className="flex items-center justify-between text-xs text-sand-500 dark:text-sand-400 bg-white dark:bg-forest-900/40 px-5 py-3 rounded-2xl border border-sand-200 dark:border-forest-800 shadow-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-forest-950 dark:text-sand-100">
                {filteredMedicines.length} Formulation{filteredMedicines.length === 1 ? '' : 's'} Available
              </span>
              {selectedCategory && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sand-100 dark:bg-forest-800 text-forest-800 dark:text-sand-200 text-[11px] font-bold">
                  {categories.find((c) => String(c.id) === selectedCategory)?.name || 'Category'}
                </span>
              )}
              {rxFilter !== 'ALL' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sand-100 dark:bg-forest-800 text-forest-800 dark:text-sand-200 text-[11px] font-bold">
                  {rxFilter === 'RX_ONLY' ? 'Prescription Only' : 'OTC Only'}
                </span>
              )}
              {stockOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sand-100 dark:bg-forest-800 text-forest-800 dark:text-sand-200 text-[11px] font-bold">
                  In Stock Only
                </span>
              )}
            </div>
            {(selectedCategory || rxFilter !== 'ALL' || stockOnly) && (
              <button
                onClick={handleResetFilters}
                className="text-[11px] font-bold text-clay-600 dark:text-rose-400 hover:underline flex-shrink-0"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Results Area */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 rounded-2.5xl bg-sand-200/50 dark:bg-forest-900/50 shimmer"></div>
              ))}
            </div>
          ) : filteredMedicines.length === 0 ? (
            <div className="bg-white dark:bg-forest-900/40 rounded-3xl border border-sand-200 dark:border-forest-800 p-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-sand-100 dark:bg-forest-950 text-sand-400 mx-auto flex items-center justify-center">
                <PackageSearch className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-extrabold text-forest-950 dark:text-sand-100">No Formulations Found</h3>
              <p className="text-xs text-sand-500 dark:text-sand-400 max-w-sm mx-auto leading-relaxed">
                No medications matched your current filter or query parameters. Try selecting a different therapeutic category or resetting the filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-full bg-forest-900 dark:bg-emerald-600 text-sand-50 dark:text-forest-950 text-xs font-bold hover:bg-forest-800 transition"
              >
                Reset Catalog Filters
              </button>
            </div>
          ) : (
            <div className={`grid ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6' 
                : 'grid-cols-1 gap-4'
            }`}>
              {filteredMedicines.map((medicine) => (
                <MedicineCard key={medicine.id} medicine={medicine} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Recently Viewed Strip */}
      <RecentlyViewed />
    </div>
  );
};
