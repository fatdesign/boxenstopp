import React, { createContext, useContext, useState } from 'react';

export interface CartItem {
  name: string;
  price: string;
  qty: number;
}

interface OrderContextValue {
  items: CartItem[];
  addItem: (name: string, price: string) => void;
  updateQty: (name: string, qty: number) => void;
  removeItem: (name: string) => void;
  clearCart: () => void;
  totalCount: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const MAX_QTY = 20;

const OrderContext = createContext<OrderContextValue | null>(null);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addItem = (name: string, price: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.name === name);
      if (existing) {
        return prev.map((i) => (i.name === name ? { ...i, qty: Math.min(MAX_QTY, i.qty + 1) } : i));
      }
      return [...prev, { name, price, qty: 1 }];
    });
  };

  const updateQty = (name: string, qty: number) => {
    setItems((prev) => {
      if (qty <= 0) return prev.filter((i) => i.name !== name);
      return prev.map((i) => (i.name === name ? { ...i, qty: Math.min(MAX_QTY, qty) } : i));
    });
  };

  const removeItem = (name: string) => setItems((prev) => prev.filter((i) => i.name !== name));
  const clearCart = () => setItems([]);

  const totalCount = items.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.qty * (parseFloat(i.price) || 0), 0);

  return (
    <OrderContext.Provider
      value={{ items, addItem, updateQty, removeItem, clearCart, totalCount, totalPrice, isCartOpen, setIsCartOpen }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrder must be used within OrderProvider');
  return ctx;
}
