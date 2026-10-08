import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { recentViews } from '../utils/recentViews';
import { Clock, ArrowRight, Sparkles, ShoppingBag } from 'lucide-react';
import { formatINR } from '../utils/formatters';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const RecentlyViewed = ({ currentId = null }) => {
  const [items, setItems] = useState([]);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const list = recentViews.get();
    if (currentId) {
      setItems(list.filter(item => String(item.id) !== String(currentId)));
    } else {
      setItems(list);
    }
  }, [currentId]);

  if (items.length === 0) return null;

  return (
    <section className="mt-14 pt-8 border-t border-sand-200/80 dark:border-forest-900/60">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-forest-900/5 dark:bg-emerald-500/10 flex items-center justify-center text-forest-700 dark:text-emerald-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-forest-950 dark:text-sand-100 text-lg">
              Recently Viewed Formulations
            </h3>
            <p className="text-xs text-sand-500 dark:text-sand-400">
              Quick access to products you checked recently
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            recentViews.clear();
            setItems([]);
          }}
          className="text-xs font-semibold text-sand-500 hover:text-clay-600 dark:text-sand-400 dark:hover:text-sand-200 transition"
        >
          Clear History
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="group bg-white dark:bg-forest-900/40 rounded-2xl border border-sand-200/80 dark:border-forest-800/60 p-3.5 shadow-subtle hover:shadow-elevated transition flex flex-col justify-between"
          >
            <div>
              <Link
                to={`/medicines/${item.id}`}
                className="block aspect-square rounded-xl bg-sand-100/70 dark:bg-forest-950/60 p-2.5 mb-2.5 overflow-hidden"
              >
                <img
                  src={item.imageUrl || '/images/medicines/placeholder.svg'}
                  alt={item.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/medicines/placeholder.svg';
                  }}
                  className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-300"
                />
              </Link>

              <span className="text-[9px] uppercase font-bold text-forest-700 dark:text-emerald-400 tracking-wider block truncate">
                {item.categoryName || 'Formulation'}
              </span>

              <Link
                to={`/medicines/${item.id}`}
                className="font-bold text-forest-950 dark:text-sand-100 text-xs mt-1 block truncate group-hover:text-forest-700 dark:group-hover:text-emerald-400"
                title={item.name}
              >
                {item.name}
              </Link>

              <p className="text-[11px] text-sand-500 dark:text-sand-400 mt-0.5 truncate">
                {item.dosage}
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-sand-100 dark:border-forest-800/40 flex items-center justify-between">
              <span className="text-xs font-black text-forest-950 dark:text-sand-100">
                {formatINR(item.price)}
              </span>

              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    alert('Please log in to add items to your cart.');
                    return;
                  }
                  addToCart(item.id, 1);
                }}
                disabled={item.stockQuantity <= 0}
                title="Add to basket"
                className="p-1.5 rounded-lg bg-sand-100 hover:bg-forest-900 hover:text-white dark:bg-forest-800 dark:text-sand-200 dark:hover:bg-emerald-600 transition"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
