import React from 'react';
import { Minus, Plus, Trash2, FileText } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/formatters';

export const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const medicine = item.medicine;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 bg-white dark:bg-forest-900/40 rounded-2xl border border-sand-200/90 dark:border-forest-800/70 shadow-subtle hover:border-forest-300/60 dark:hover:border-emerald-500/40 transition gap-4">
      {/* Product Details */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-sand-100/80 dark:bg-forest-950/60 p-2 border border-sand-200/70 dark:border-forest-800 flex-shrink-0 flex items-center justify-center">
          <img
            src={medicine.imageUrl || '/products/daily-wellness.svg'}
            alt={medicine.name}
            className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
          />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-forest-700 dark:text-emerald-400 bg-sand-100 dark:bg-forest-950/80 px-2 py-0.5 rounded-md">
              {medicine.category?.name || 'Formulation'}
            </span>
            {medicine.requiresPrescription && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-ochre-700 dark:text-ochre-400 bg-ochre-50 dark:bg-ochre-950/50 border border-ochre-200 dark:border-ochre-800 px-2 py-0.5 rounded-md">
                <FileText className="w-3 h-3" /> Rx Required
              </span>
            )}
          </div>

          <h4 className="font-extrabold text-forest-950 dark:text-sand-100 text-sm sm:text-base mt-1 truncate">
            {medicine.name}
          </h4>

          <p className="text-xs text-sand-500 dark:text-sand-400 font-medium">
            {medicine.brand || 'VALENCE'} • {formatINR(medicine.price)} per pack ({medicine.dosage || 'Standard'})
          </p>
        </div>
      </div>

      {/* Stepper & Price Column */}
      <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-sand-100 dark:border-forest-800/50">
        {/* Quantity Stepper */}
        <div className="flex items-center border border-sand-300 dark:border-forest-700 rounded-full bg-sand-50/80 dark:bg-forest-950 p-1">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            aria-label={`Decrease ${medicine.name} quantity`}
            className="w-7 h-7 rounded-full flex items-center justify-center text-forest-800 dark:text-sand-300 hover:bg-white dark:hover:bg-forest-800 hover:shadow-xs transition"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-8 text-center text-xs font-black text-forest-950 dark:text-sand-100">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            aria-label={`Increase ${medicine.name} quantity`}
            className="w-7 h-7 rounded-full flex items-center justify-center text-forest-800 dark:text-sand-300 hover:bg-white dark:hover:bg-forest-800 hover:shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Total Price */}
        <div className="text-right min-w-[75px]">
          <span className="text-xs text-sand-400 dark:text-sand-500 block font-medium">Subtotal</span>
          <span className="text-base font-black text-forest-950 dark:text-sand-100">
            {formatINR(item.price * item.quantity)}
          </span>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => removeFromCart(item.id)}
          aria-label={`Remove ${medicine.name} from cart`}
          className="p-2 rounded-xl text-sand-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition"
          title="Remove from basket"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
