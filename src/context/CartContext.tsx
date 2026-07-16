import React, { createContext, useContext, useState, useCallback } from 'react';
import { CartItem, Product } from '../lib/types';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, type?: CartItem['type'], subscriptionMonths?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((product: Product, type: CartItem['type'] = 'one_time', subscriptionMonths?: number) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id && i.type === type);
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id && i.type === type
            ? { ...i, quantity: i.quantity + 1, subscription_months: subscriptionMonths || i.subscription_months }
            : i
        );
      }
      return [...prev, { product, quantity: 1, type, subscription_months: subscriptionMonths }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems(prev => prev.filter(i => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems(prev =>
      prev.map(i => i.product.id === productId ? { ...i, quantity } : i)
    );
  }, [removeItem]);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => {
    const price = i.type === 'subscription'
      ? i.product.price_subscription * (i.subscription_months || 3)
      : i.product.price_one_time;
    return sum + (price * i.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQuantity, clearCart,
      totalItems, subtotal, isOpen, setIsOpen
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
