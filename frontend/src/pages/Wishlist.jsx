import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Heart, ShoppingBag, Trash2, ArrowRight, ShieldCheck, FileText, AlertCircle } from 'lucide-react';
import { formatINR } from '../utils/formatters';

export const Wishlist = () => {
  const { wishlistItems, toggleWishlist, loading } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = async (medicine) => {
    addToCart(medicine.id, 1);
    await toggleWishlist(medicine);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-3 border-forest-900 border-t-transparent dark:border-emerald-400 dark:border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sand-600 dark:text-sand-400 font-medium text-sm">Loading your saved formulations...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-sand-200/80 dark:border-forest-800/60 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase font-extrabold tracking-widest text-emerald-700 dark:text-emerald-400 mb-1.5">
            <Heart className="w-4 h-4 fill-emerald-600 dark:fill-emerald-400 text-emerald-600 dark:text-emerald-400" />
            <span>Curated Care Reserve</span>
          </div>
          <h1 className="text-3xl font-extrabold text-forest-950 dark:text-sand-100 tracking-tight">
            Saved Formulations
          </h1>
          <p className="text-sm text-sand-500 dark:text-sand-400 mt-1">
            Keep track of required medications, monitor availability, and swiftly dispatch to your dispensary basket.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-sand-500 dark:text-sand-400 bg-sand-100 dark:bg-forest-900/60 px-3.5 py-1.5 rounded-full border border-sand-200 dark:border-forest-800">
          <span>{wishlistItems.length} Saved {wishlistItems.length === 1 ? 'Item' : 'Items'}</span>
        </div>
      </div>

      {/* Empty State */}
      {wishlistItems.length === 0 ? (
        <div className="bg-white dark:bg-forest-900/40 rounded-3xl border border-sand-200/80 dark:border-forest-800/60 p-12 text-center max-w-xl mx-auto shadow-subtle my-12">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 dark:text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-100 dark:border-rose-900/50">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-forest-950 dark:text-sand-100 mb-2">
            Your Wishlist is Empty
          </h3>
          <p className="text-sm text-sand-500 dark:text-sand-400 leading-relaxed mb-6">
            Bookmark medicines while exploring the catalog by clicking the heart icon on any product card.
          </p>
          <Link
            to="/medicines"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-forest-900 hover:bg-forest-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-sand-50 dark:text-forest-950 font-bold text-xs uppercase tracking-wider transition shadow-md"
          >
            <span>Explore Dispensary Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        /* Items Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => {
            const med = item?.medicine || item;
            if (!med || !med.name) return null;
            const stock = Number(med.stockQuantity ?? 0);
            const isOutOfStock = stock <= 0;

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-forest-900/40 rounded-2.5xl border border-sand-200/90 dark:border-forest-800/70 p-5 shadow-subtle hover:shadow-elevated transition flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video rounded-xl bg-sand-100/70 dark:bg-forest-950/50 p-4 mb-4 border border-sand-200/60 dark:border-forest-800/50 flex items-center justify-center">
                    <img
                      src={med.imageUrl || '/products/daily-wellness.svg'}
                      alt={med.name}
                      className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                    />
                    <button
                      onClick={() => toggleWishlist(med)}
                      className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white dark:bg-forest-900 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 border border-sand-200 dark:border-forest-700 shadow-sm transition"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {med.requiresPrescription && (
                      <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 bg-forest-900/90 text-sand-100 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                        <FileText className="w-3 h-3 text-ochre-400" /> Rx
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-sand-500 dark:text-sand-400 mb-1">
                    <span className="text-[10px] font-black uppercase text-forest-700 dark:text-emerald-400 bg-sand-100 dark:bg-forest-950 px-2 py-0.5 rounded">
                      {med.category?.name || 'General Care'}
                    </span>
                    <span className="text-[11px] font-medium">
                      {med.dosage || 'Standard'}
                    </span>
                  </div>

                  <Link
                    to={`/medicines/${med.id}`}
                    className="font-extrabold text-forest-950 dark:text-sand-100 text-base hover:text-forest-700 dark:hover:text-emerald-400 transition line-clamp-1 mt-1 block"
                  >
                    {med.name}
                  </Link>

                  <p className="text-xs text-sand-600 dark:text-sand-400 mt-1 line-clamp-1">
                    {med.brand} • {med.composition}
                  </p>

                  <p className="text-xs text-sand-500 dark:text-sand-400 mt-2 line-clamp-2 leading-relaxed">
                    {med.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-sand-200/80 dark:border-forest-800/60 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sand-500 dark:text-sand-400 block">Unit Cost</span>
                    <span className="text-lg font-extrabold text-forest-950 dark:text-sand-100">
                      {formatINR(med.price)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleMoveToCart(med)}
                    disabled={isOutOfStock}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-xs ${
                      isOutOfStock
                        ? 'bg-sand-100 text-sand-400 dark:bg-forest-950 dark:text-sand-600 cursor-not-allowed border border-sand-200 dark:border-forest-800'
                        : 'bg-forest-900 text-sand-50 hover:bg-forest-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 dark:text-forest-950 active:scale-95'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{isOutOfStock ? 'Sold Out' : 'Move to Cart'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
