import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useOrder } from '../context/OrderContext';

export const CartButton: React.FC = () => {
  const { totalCount, setIsCartOpen } = useOrder();

  if (totalCount === 0) return null;

  return (
    <button
      onClick={() => setIsCartOpen(true)}
      className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40 flex items-center gap-2 bg-lotteria-red text-white pl-4 pr-5 py-3.5 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-transform font-display font-bold uppercase tracking-wide text-sm"
    >
      <span className="relative flex-shrink-0">
        <ShoppingBag size={20} />
        <span className="absolute -top-2.5 -right-2.5 bg-lotteria-yellow text-lotteria-red text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-lotteria-red">
          {totalCount}
        </span>
      </span>
      Vorbestellen
    </button>
  );
};
