import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, Filter, X, Clock, ArrowRight, Pill, History } from 'lucide-react';
import { medicineService } from '../services/medicineService';
import { formatINR } from '../utils/formatters';

const POPULAR_SEARCHES = [
  'Paracip 650',
  'Cetrizet Allergy',
  'DiaVeda Karela',
  'Clindacort Acne',
  'VitaImmuno C',
  'GastroGuard Gel',
  'TelmiPress 40',
];

const RECENT_KEY = 'valence_recent_searches';

export const SearchBar = ({ onSearch, categories = [], initialQuery = '', initialCategoryId = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  const [categoryId, setCategoryId] = useState(initialCategoryId);
  const [allMedicines, setAllMedicines] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // Load recent searches
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_KEY);
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch (e) {}
  }, []);

  // Pre-load medicines once for fast autocomplete
  useEffect(() => {
    medicineService.getAllMedicines().then(data => {
      setAllMedicines(data || []);
    }).catch(err => {
      console.warn('Autocomplete fetch fallback:', err);
    });
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter autocomplete suggestions
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      setSuggestions([]);
      return;
    }
    const filtered = allMedicines.filter(m => {
      const nameMatch = m.name?.toLowerCase().includes(q);
      const brandMatch = m.brand?.toLowerCase().includes(q);
      const compMatch = m.composition?.toLowerCase().includes(q);
      const catMatch = m.category?.name?.toLowerCase().includes(q);
      const ailmentMatch = m.ailment?.toLowerCase().includes(q);
      return nameMatch || brandMatch || compMatch || catMatch || ailmentMatch;
    }).slice(0, 6);
    setSuggestions(filtered);
  }, [query, allMedicines]);

  const saveRecentSearch = (text) => {
    if (!text || !text.trim()) return;
    const clean = text.trim();
    const updated = [clean, ...recentSearches.filter(s => s.toLowerCase() !== clean.toLowerCase())].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    } catch (e) {}
  };

  const removeRecentSearch = (e, item) => {
    e.stopPropagation();
    const updated = recentSearches.filter(s => s !== item);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    } catch (e) {}
  };

  const clearAllRecent = (e) => {
    e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_KEY);
    } catch (e) {}
  };

  const executeSearch = (searchText, catId = categoryId) => {
    setIsOpen(false);
    saveRecentSearch(searchText);
    if (onSearch) {
      onSearch({ query: searchText.trim(), categoryId: catId || undefined });
    } else {
      const params = new URLSearchParams();
      if (searchText.trim()) params.set('query', searchText.trim());
      if (catId) params.set('categoryId', catId);
      navigate(`/medicines?${params.toString()}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    executeSearch(query);
  };

  const handleSelectMedicine = (med) => {
    setIsOpen(false);
    navigate(`/medicines/${med.id}`);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white dark:bg-forest-900/90 p-2 sm:p-2.5 rounded-2xl sm:rounded-full border border-sand-300 dark:border-forest-800 shadow-elevated transition-all duration-200 focus-within:border-forest-700/80 dark:focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-forest-900/5 dark:focus-within:ring-emerald-500/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
      >
        {/* Search Input Box */}
        <div className="flex-1 flex items-center px-4 gap-2.5">
          <Search className="w-5 h-5 text-forest-700 dark:text-emerald-400 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            placeholder="Search by drug formulation, brand, active compound, or indication…"
            className="w-full bg-transparent py-2 text-xs sm:text-sm font-medium text-forest-950 dark:text-sand-100 placeholder-sand-400 dark:placeholder-sand-500 outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                if (onSearch) onSearch({ query: '', categoryId: categoryId || undefined });
              }}
              className="p-1 rounded-full text-sand-400 hover:text-forest-800 dark:hover:text-sand-200"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Dropdown Filter */}
        <div className="flex items-center gap-2 px-2 border-t sm:border-t-0 sm:border-l border-sand-200 dark:border-forest-800 pt-2 sm:pt-0">
          <div className="relative w-full sm:w-auto">
            <select
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                if (onSearch) onSearch({ query: query.trim(), categoryId: e.target.value || undefined });
              }}
              className="w-full sm:w-auto pl-3 pr-8 py-2 bg-sand-100/70 dark:bg-forest-950/80 border border-sand-200 dark:border-forest-800 text-xs font-bold text-forest-900 dark:text-sand-200 rounded-xl sm:rounded-full outline-none focus:border-forest-600 appearance-none cursor-pointer"
            >
              <option value="">All Formulations</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-sand-500 dark:text-sand-400">
              <Filter className="w-3 h-3" />
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            className="flex-shrink-0 px-6 py-2.5 rounded-xl sm:rounded-full bg-forest-900 hover:bg-forest-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-sand-50 dark:text-forest-950 font-bold text-xs tracking-wider transition shadow-sm hover:shadow active:scale-95"
          >
            Find Care
          </button>
        </div>
      </form>

      {/* Autocomplete / Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-forest-900 rounded-2.5xl border border-sand-200 dark:border-forest-800 shadow-premium z-50 overflow-hidden divide-y divide-sand-100 dark:divide-forest-800/80 animate-fade-in">
          {/* Live Autocomplete Results */}
          {query.trim().length > 0 && suggestions.length > 0 && (
            <div className="p-3">
              <div className="text-[10px] font-black uppercase tracking-wider text-sand-500 dark:text-sand-400 px-3 py-1">
                Matching Formulations ({suggestions.length})
              </div>
              <div className="mt-1 space-y-1">
                {suggestions.map((med) => (
                  <button
                    key={med.id}
                    type="button"
                    onClick={() => handleSelectMedicine(med)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-sand-100/80 dark:hover:bg-forest-800/60 transition text-left group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-sand-100 dark:bg-forest-950 p-1 flex-shrink-0 border border-sand-200 dark:border-forest-800 flex items-center justify-center">
                        <img
                          src={med.imageUrl || '/images/medicines/placeholder.svg'}
                          alt={med.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/images/medicines/placeholder.svg';
                          }}
                          className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-forest-950 dark:text-sand-100 text-xs truncate group-hover:text-forest-700 dark:group-hover:text-emerald-400">
                            {med.name}
                          </span>
                          {med.requiresPrescription && (
                            <span className="text-[9px] font-black text-ochre-700 dark:text-ochre-400 bg-ochre-50 dark:bg-ochre-950/60 px-1.5 py-0.5 rounded border border-ochre-200 dark:border-ochre-800">
                              Rx
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-sand-500 dark:text-sand-400 truncate">
                          {med.brand || 'PHARMED'} • {med.composition || med.dosage}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 pl-2">
                      <span className="font-extrabold text-xs text-forest-950 dark:text-sand-100">
                        {formatINR(med.price)}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-sand-400 group-hover:text-forest-700 dark:group-hover:text-emerald-400 transition" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Empty search match */}
          {query.trim().length > 0 && suggestions.length === 0 && (
            <div className="p-5 text-center text-xs text-sand-500 dark:text-sand-400">
              No direct formulation match for <span className="font-bold text-forest-950 dark:text-sand-100">"{query}"</span>. Press Enter or click Find Care to perform full catalog search.
            </div>
          )}

          {/* Recent Searches Section */}
          {recentSearches.length > 0 && (
            <div className="p-3">
              <div className="flex items-center justify-between px-3 py-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-sand-500 dark:text-sand-400 flex items-center gap-1.5">
                  <History className="w-3 h-3" /> Recent Searches
                </span>
                <button
                  type="button"
                  onClick={clearAllRecent}
                  className="text-[10px] font-bold text-sand-400 hover:text-clay-600 dark:hover:text-sand-200"
                >
                  Clear All
                </button>
              </div>
              <div className="mt-1 flex flex-wrap gap-1.5 px-3 py-1">
                {recentSearches.map((term, i) => (
                  <span
                    key={i}
                    onClick={() => {
                      setQuery(term);
                      executeSearch(term);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sand-100 dark:bg-forest-800 text-forest-900 dark:text-sand-200 hover:bg-forest-900 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-forest-950 cursor-pointer transition"
                  >
                    <span>{term}</span>
                    <button
                      type="button"
                      onClick={(e) => removeRecentSearch(e, term)}
                      className="p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10"
                      title="Remove"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Popular Searches Chips */}
          <div className="p-3 bg-sand-50/60 dark:bg-forest-950/60">
            <div className="text-[10px] font-black uppercase tracking-wider text-sand-500 dark:text-sand-400 px-3 py-1 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-ochre-500" /> Popular Healthcare Searches
            </div>
            <div className="mt-1 flex flex-wrap gap-1.5 px-3 py-1">
              {POPULAR_SEARCHES.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setQuery(chip);
                    executeSearch(chip);
                  }}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-forest-900 border border-sand-200 dark:border-forest-700 text-forest-800 dark:text-sand-200 hover:border-forest-600 dark:hover:border-emerald-400 transition"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
