import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { ShoppingBag, FileText, Heart, AlertCircle } from 'lucide-react';
import { formatINR } from '../utils/formatters';

export const MedicineCard = ({ medicine }) => {
  const { addToCart, cartError, cartErrorMedicineId } = useCart();
  const { isAuthenticated, isAdmin } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const handleAdd = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please sign in to add medications to your cart.');
      return;
    }
    addToCart(medicine.id, 1);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(medicine);
  };

  const stock = Number(medicine.stockQuantity ?? 0);
  const isOutOfStock = stock <= 0;
  const isLimitedStock = stock > 0 && stock <= 10;
  const wishlisted = isWishlisted(medicine.id);

  // Badge mapping
  const badge = medicine.badge;
  const badgeStyles = {
    'BEST SELLER': 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-700',
    'POPULAR': 'bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-950/80 dark:text-sky-300 dark:border-sky-700',
    'NEW': 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-700',
    'SPECIAL OFFER': 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-700',
    'LOW STOCK': 'bg-orange-100 text-orange-900 border-orange-300 dark:bg-orange-950/80 dark:text-orange-300 dark:border-orange-700',
    'RX REQUIRED': 'bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950/80 dark:text-purple-300 dark:border-purple-700',
  };

  return (
    <div className="group relative flex flex-col justify-between bg-white dark:bg-forest-900/40 rounded-2.5xl border border-sand-200/90 dark:border-forest-800/70 p-5 shadow-subtle hover:shadow-elevated hover:border-forest-300/60 dark:hover:border-emerald-500/40 transition-all duration-300 h-full">
      <div>
        {/* Visual Frame */}
        <Link 
          to={`/medicines/${medicine.id}`} 
          className="relative block w-full h-52 bg-sand-100/70 dark:bg-forest-950/50 rounded-2xl overflow-hidden p-4 mb-4 border border-sand-200/60 dark:border-forest-800/50 group-hover:bg-sand-100 dark:group-hover:bg-forest-950/80 transition duration-300"
        >
          <img
            src={medicine.imageUrl || '/images/medicines/placeholder.svg'}
            alt={medicine.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/medicines/placeholder.svg';
            }}
            className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />

          {/* Top Overlays */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between pointer-events-none gap-2">
            {/* Badges Stack */}
            <div className="flex flex-col gap-1.5 pointer-events-auto">
              {badge && (
                <span className={`inline-flex items-center text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border shadow-xs backdrop-blur-md ${badgeStyles[badge] || 'bg-sand-100 text-sand-800 border-sand-300'}`}>
                  {badge}
                </span>
              )}
              {medicine.requiresPrescription && !badge?.includes('RX') && (
                <span className="inline-flex items-center gap-1 bg-forest-900/95 dark:bg-emerald-950/90 text-sand-100 dark:text-emerald-200 text-[9px] font-extrabold px-2 py-0.5 rounded-md shadow-xs border border-forest-800 dark:border-emerald-800">
                  <FileText className="h-2.5 w-2.5 text-ochre-400" /> Rx Required
                </span>
              )}
            </div>

            {/* Wishlist Button */}
            {!isAdmin && (
              <button
                type="button"
                onClick={handleWishlistToggle}
                className={`pointer-events-auto w-8 h-8 rounded-full flex items-center justify-center transition shadow-sm backdrop-blur-md border ${
                  wishlisted
                    ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950 dark:text-rose-400 dark:border-rose-800'
                    : 'bg-white/85 text-sand-500 border-sand-200/80 hover:text-rose-600 hover:bg-white dark:bg-forest-900/80 dark:text-sand-400 dark:border-forest-700 dark:hover:text-rose-400'
                }`}
                title={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
              </button>
            )}
          </div>

          {/* Stock inventory banner inside frame bottom */}
          <div className="absolute bottom-2.5 left-3">
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border shadow-xs backdrop-blur-md ${
                isOutOfStock
                  ? 'bg-rose-50/95 text-rose-700 border-rose-200 dark:bg-rose-950/90 dark:text-rose-300 dark:border-rose-800'
                  : isLimitedStock
                  ? 'bg-amber-50/95 text-amber-800 border-amber-200 dark:bg-amber-950/90 dark:text-amber-300 dark:border-amber-800'
                  : 'bg-emerald-50/95 text-emerald-800 border-emerald-200 dark:bg-emerald-950/90 dark:text-emerald-300 dark:border-emerald-800'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${
                isOutOfStock ? 'bg-rose-500' : isLimitedStock ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
              }`}></span>
              {isOutOfStock ? 'Out of Stock' : isLimitedStock ? `Limited • Only ${stock} left` : 'In Stock'}
            </span>
          </div>
        </Link>

        {/* Category & Dosage Metadata */}
        <div className="flex items-center justify-between text-xs text-forest-700/80 dark:text-emerald-400 mb-2">
          <span className="text-[10px] uppercase font-black tracking-widest text-forest-800 dark:text-emerald-300 bg-sand-100 dark:bg-forest-950/80 px-2 py-0.5 rounded-md">
            {medicine.category?.name || 'General Formula'}
          </span>
          <span className="text-[11px] font-medium text-sand-500 dark:text-sand-400">
            {medicine.dosage || 'Standard'}
          </span>
        </div>

        {/* Title */}
        <Link 
          to={`/medicines/${medicine.id}`} 
          className="block font-bold text-forest-950 dark:text-sand-100 text-base leading-snug group-hover:text-forest-700 dark:group-hover:text-emerald-400 transition line-clamp-1"
        >
          {medicine.name}
        </Link>

        {/* Composition / Brand Subtitle */}
        <p className="text-xs text-sand-600 dark:text-sand-400 mt-1 line-clamp-1 font-medium">
          {medicine.brand || 'PHARMED Healthcare'} • {medicine.composition || 'Active Compound'}
        </p>

        {/* Description snippet */}
        <p className="text-xs text-sand-500 dark:text-sand-400 mt-2 line-clamp-2 leading-relaxed">
          {medicine.description}
        </p>
      </div>

      {/* Pricing & Cart Action Area */}
      <div className="mt-5 pt-4 border-t border-sand-200/80 dark:border-forest-800/60 flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-sand-500 dark:text-sand-400 block">Unit Cost</span>
          <span className="text-lg font-extrabold text-forest-950 dark:text-sand-100 tracking-tight">
            {formatINR(medicine.price)}
          </span>
        </div>

        {!isAdmin ? (
          <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition duration-200 ${
              isOutOfStock
                ? 'bg-sand-100 text-sand-400 dark:bg-forest-950 dark:text-sand-600 cursor-not-allowed border border-sand-200 dark:border-forest-800'
                : 'bg-forest-900 text-sand-50 hover:bg-forest-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 dark:text-forest-950 hover:shadow-md active:scale-95'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
          </button>
        ) : (
          <Link
            to="/admin/medicines"
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-forest-700 bg-sand-100 hover:bg-sand-200 dark:bg-forest-800 dark:text-sand-200 dark:hover:bg-forest-700 transition"
          >
            Manage
          </Link>
        )}
      </div>

      {/* Cart Validation Alert */}
      {cartError && String(cartErrorMedicineId) === String(medicine.id) && (
        <div className="mt-3 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-[11px] font-medium text-rose-800 dark:text-rose-300 flex items-start gap-1.5" role="alert">
          <AlertCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0 mt-0.5" />
          <span>{cartError}</span>
        </div>
      )}
    </div>
  );
};
