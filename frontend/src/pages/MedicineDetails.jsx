import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { medicineService } from '../services/medicineService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { formatINR } from '../utils/formatters';
import { recentViews } from '../utils/recentViews';
import { RecentlyViewed } from '../components/RecentlyViewed';
import { 
  ShoppingBag, 
  FileText, 
  Star, 
  Plus, 
  Minus, 
  ShieldCheck, 
  ArrowLeft, 
  AlertCircle, 
  Heart,
  Truck, 
  Clock, 
  Send
} from 'lucide-react';

export const MedicineDetails = () => {
  const { id } = useParams();
  const [medicine, setMedicine] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const { addToCart, cartError, cartErrorMedicineId } = useCart();
  const { isAuthenticated, isAdmin } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const fetchDetails = async () => {
    try {
      const [med, revs] = await Promise.all([
        medicineService.getMedicineById(id),
        medicineService.getReviews(id),
      ]);
      setMedicine(med);
      setReviews(revs || []);
      if (med) {
        recentViews.add(med);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      alert('Please sign in to add medications to your cart.');
      return;
    }
    addToCart(medicine.id, quantity);
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please sign in to submit a review.');
      return;
    }
    setReviewSubmitting(true);
    try {
      await medicineService.addReview({ medicineId: Number(id), rating, comment });
      setComment('');
      fetchDetails();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-sand-300 dark:border-forest-700 border-t-forest-900 dark:border-t-emerald-400 animate-spin mx-auto"></div>
        <p className="text-xs font-bold text-sand-500 dark:text-sand-400 uppercase tracking-widest">
          Loading Clinical Data Sheet…
        </p>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="py-20 text-center space-y-4 bg-white dark:bg-forest-900/40 rounded-3xl border border-sand-200 dark:border-forest-800 p-12 max-w-lg mx-auto">
        <AlertCircle className="w-10 h-10 text-clay-500 mx-auto" />
        <h2 className="text-xl font-black text-forest-950 dark:text-sand-100">Medication Record Not Found</h2>
        <p className="text-xs text-sand-500 dark:text-sand-400">The requested formulation could not be located in the active dispensary catalog.</p>
        <Link to="/medicines" className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-forest-900 dark:bg-emerald-600 text-white dark:text-forest-950 text-xs font-bold">
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Catalog
        </Link>
      </div>
    );
  }

  const stock = Number(medicine.stockQuantity ?? 0);
  const isOutOfStock = stock <= 0;
  const isLimitedStock = stock > 0 && stock <= 10;
  const wishlisted = isWishlisted(medicine.id);

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
    <div className="space-y-12 py-6 sm:py-8 max-w-6xl mx-auto animate-fade-in">
      {/* Breadcrumb Back */}
      <Link
        to="/medicines"
        className="inline-flex items-center text-xs font-bold text-forest-700 dark:text-emerald-400 hover:text-forest-950 dark:hover:text-sand-100 gap-2 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dispensary Catalog
      </Link>

      {/* Main Product Canvas */}
      <div className="bg-white dark:bg-forest-900/40 rounded-4xl p-6 sm:p-10 lg:p-12 border border-sand-200 dark:border-forest-800 shadow-elevated grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Visual Area */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="relative w-full h-80 sm:h-96 rounded-3xl bg-sand-100/70 dark:bg-forest-950/60 border border-sand-200 dark:border-forest-800 p-8 flex items-center justify-center overflow-hidden">
            <img
              src={medicine.imageUrl || '/products/daily-wellness.svg'}
              alt={medicine.name}
              className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal hover:scale-105 transition-transform duration-500"
            />

            {/* Badges on product image */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              {badge && (
                <span className={`inline-flex items-center text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border shadow-sm backdrop-blur-md ${badgeStyles[badge] || 'bg-sand-100 text-sand-800 border-sand-300'}`}>
                  {badge}
                </span>
              )}
              {medicine.requiresPrescription && (
                <span className="bg-forest-900/95 dark:bg-emerald-950 text-sand-100 dark:text-emerald-200 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md border border-forest-800 dark:border-emerald-800">
                  <FileText className="w-3.5 h-3.5 text-ochre-400" /> Rx Prescription Required
                </span>
              )}
            </div>

            {/* Wishlist Button on image */}
            {!isAdmin && (
              <button
                type="button"
                onClick={() => toggleWishlist(medicine)}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition shadow-md backdrop-blur-md border ${
                  wishlisted
                    ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950 dark:text-rose-400 dark:border-rose-800'
                    : 'bg-white/90 text-sand-500 border-sand-200 hover:text-rose-600 dark:bg-forest-900/90 dark:text-sand-400 dark:border-forest-700'
                }`}
                title={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
              </button>
            )}
          </div>

          {/* Clinical Assurance Strip */}
          <div className="grid grid-cols-3 gap-3 text-center p-4 bg-sand-50 dark:bg-forest-950/60 rounded-2xl border border-sand-200 dark:border-forest-800">
            <div>
              <span className="text-[10px] uppercase font-bold text-sand-500 dark:text-sand-400 block">Integrity</span>
              <span className="text-xs font-black text-forest-900 dark:text-sand-200">GMP Certified</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-sand-500 dark:text-sand-400 block">Storage</span>
              <span className="text-xs font-black text-forest-900 dark:text-sand-200">Climate Sealed</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-sand-500 dark:text-sand-400 block">Dispensing</span>
              <span className="text-xs font-black text-forest-900 dark:text-sand-200">Registered RPh</span>
            </div>
          </div>
        </div>

        {/* Right Info Column */}
        <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-black tracking-widest text-forest-800 dark:text-emerald-300 bg-sand-100 dark:bg-forest-950 px-3 py-1 rounded-md">
                {medicine.category?.name || 'General Formula'}
              </span>
              <span
                className={`text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-md border ${
                  isOutOfStock
                    ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-800'
                    : isLimitedStock
                    ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800'
                }`}
              >
                {isOutOfStock ? 'Out of Stock' : isLimitedStock ? `Limited • Only ${stock} left` : 'In Stock'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-forest-950 dark:text-sand-100 tracking-tight leading-tight">
              {medicine.name}
            </h1>

            <p className="text-xs sm:text-sm font-medium text-sand-600 dark:text-sand-400">
              Manufacturer: <span className="font-bold text-forest-900 dark:text-sand-200">{medicine.brand || 'VALENCE Clinical'}</span> • Active Composition: <span className="font-bold text-forest-900 dark:text-sand-200">{medicine.composition || 'Active Therapeutic'}</span>
            </p>

            <div className="pt-2 pb-4 border-b border-sand-200 dark:border-forest-800">
              <span className="text-xs font-bold uppercase tracking-wider text-sand-400 dark:text-sand-500 block mb-1">
                Dispensary Price (MRP Incl. all taxes)
              </span>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-forest-950 dark:text-sand-100">
                  {formatINR(medicine.price)}
                </span>
                <span className="text-xs text-sand-500 dark:text-sand-400 font-medium">
                  Per pack ({medicine.dosage || 'Standard Unit'})
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2 text-xs sm:text-sm text-sand-600 dark:text-sand-400 leading-relaxed font-normal">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-forest-900 dark:text-sand-200">
                Therapeutic Profile & Indications
              </h3>
              <p>{medicine.description}</p>
              {medicine.ailment && (
                <p className="text-xs font-semibold text-forest-800 dark:text-emerald-400">
                  Target Indication: {medicine.ailment}
                </p>
              )}
            </div>
          </div>

          {/* Actions & Quantity Controls */}
          <div className="pt-6 border-t border-sand-200 dark:border-forest-800 space-y-4">
            {!isAdmin && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                {/* Quantity Stepper */}
                <div className="flex items-center justify-between border border-sand-300 dark:border-forest-700 rounded-2xl bg-sand-50 dark:bg-forest-950 p-1.5 sm:w-36">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-forest-800 dark:text-sand-300 hover:bg-white dark:hover:bg-forest-800 transition disabled:opacity-40"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-black text-sm text-forest-950 dark:text-sand-100 px-2">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={isOutOfStock}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-forest-800 dark:text-sand-300 hover:bg-white dark:hover:bg-forest-800 transition disabled:opacity-40"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add To Cart CTA */}
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition duration-200 shadow-sm ${
                    isOutOfStock
                      ? 'bg-sand-200 text-sand-400 dark:bg-forest-950 dark:text-sand-600 cursor-not-allowed'
                      : 'bg-forest-900 text-sand-50 hover:bg-forest-800 dark:bg-emerald-600 dark:text-forest-950 dark:hover:bg-emerald-500 hover:shadow-md active:scale-95'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isOutOfStock ? 'Formula Unavailable' : `Add ${quantity} to Basket • ${formatINR(Number(medicine.price || 0) * quantity)}`}</span>
                </button>
              </div>
            )}

            {/* Error Message Display */}
            {cartError && String(cartErrorMedicineId) === String(medicine.id) && (
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs font-medium text-rose-800 dark:text-rose-300 flex items-start gap-2" role="alert">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <span>{cartError}</span>
              </div>
            )}

            {medicine.requiresPrescription && (
              <div className="p-3 rounded-2xl bg-ochre-50/70 dark:bg-ochre-950/40 border border-ochre-200/80 dark:border-ochre-800 text-xs text-ochre-900 dark:text-ochre-200 flex items-center gap-2">
                <FileText className="w-4 h-4 text-ochre-600 dark:text-ochre-400 flex-shrink-0" />
                <span>
                  Requires a verified doctor prescription before final fulfillment during checkout.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Patient Reviews Section */}
      <section className="bg-white dark:bg-forest-900/40 rounded-4xl p-6 sm:p-10 border border-sand-200 dark:border-forest-800 shadow-subtle space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand-200 dark:border-forest-800 pb-6">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-forest-700 dark:text-emerald-400">
              Patient Feedback
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-forest-950 dark:text-sand-100 tracking-tight mt-1">
              Clinical Experience Reviews
            </h2>
          </div>
          <span className="text-xs font-bold text-sand-500 dark:text-sand-400">
            {reviews.length} Verified Response{reviews.length === 1 ? '' : 's'}
          </span>
        </div>

        {/* Submit Review Form */}
        {isAuthenticated && !isAdmin && (
          <form onSubmit={handleAddReview} className="p-5 rounded-2.5xl bg-sand-50/80 dark:bg-forest-950/60 border border-sand-200 dark:border-forest-800 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-forest-900 dark:text-sand-200">
              Submit Patient Experience
            </h4>

            {/* Star selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-sand-600 dark:text-sand-400">Rating:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-ochre-400 hover:scale-110 transition"
                  >
                    <Star className={`w-5 h-5 ${star <= rating ? 'fill-ochre-400 text-ochre-400' : 'text-sand-300 dark:text-forest-700'}`} />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share details regarding therapeutic efficacy, dosage tolerability, or presentation…"
              className="w-full bg-white dark:bg-forest-900 p-3.5 rounded-2xl border border-sand-200 dark:border-forest-700 text-xs text-forest-950 dark:text-sand-100 outline-none focus:border-forest-700 dark:focus:border-emerald-500"
            />

            <button
              type="submit"
              disabled={reviewSubmitting}
              className="px-5 py-2.5 rounded-xl bg-forest-900 dark:bg-emerald-600 text-sand-50 dark:text-forest-950 text-xs font-bold hover:bg-forest-800 transition flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{reviewSubmitting ? 'Posting…' : 'Publish Review'}</span>
            </button>
          </form>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-xs text-sand-500 dark:text-sand-400 italic py-4">
              No patient experiences logged yet for this formulation.
            </p>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-2xl bg-sand-50/50 dark:bg-forest-950/40 border border-sand-200 dark:border-forest-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-forest-800 dark:bg-emerald-800 text-mint-300 dark:text-emerald-200 font-bold text-[10px] flex items-center justify-center">
                      {rev.user?.name?.charAt(0) || 'P'}
                    </span>
                    <span className="text-xs font-bold text-forest-950 dark:text-sand-100">{rev.user?.name || 'Verified Patient'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-ochre-400 text-ochre-400' : 'text-sand-300 dark:text-forest-700'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-sand-600 dark:text-sand-400 leading-relaxed font-normal">{rev.comment}</p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Recently Viewed Carousel Strip */}
      <RecentlyViewed currentId={medicine.id} />
    </div>
  );
};
