'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { CartItem } from '@/types';
// Removed: import { useAuth } from '@/contexts/AuthContext';
// Removed: import { supabase } from '@/lib/supabase/client';
// Actually supabase might not be needed if we remove sync logic.
// Keeping supabase if logic needs it? No, sync is gone.
// Let's check replacement lines. I am replacing lines 5-6.

// Helper to generate consistent IDs
const generateCartItemId = (productId: string | number, size: string, color: string) => {
  return `${productId}-${size}-${color}`;
};

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  isOpen: boolean;
  isSyncing: boolean; // UI indicator for background sync
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string } // Using generated ID
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }
  | { type: 'SET_SYNCING'; payload: boolean };

const CartContext = createContext<{
  state: CartState;
  addItem: (item: Omit<CartItem, 'id'>) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleCart: () => void;
  getTotalPrice: () => number;
} | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  // Helper to recalculate totals
  const calculateTotals = (items: CartItem[]) => {
    return {
      total: items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    };
  };

  switch (action.type) {
    case 'ADD_ITEM': {
      // Logic: If item exists, merge quantities. If not, add new.
      // NOTE: payload should already be a complete CartItem including ID
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);

      let newItems: CartItem[];
      if (existingItemIndex > -1) {
        newItems = [...state.items];
        const existingItem = newItems[existingItemIndex];
        // Ensure item exists before updating to satisfy strict type checks
        if (existingItem) {
          newItems[existingItemIndex] = {
            ...existingItem,
            quantity: existingItem.quantity + action.payload.quantity,
          };
        }
      } else {
        newItems = [...state.items, action.payload];
      }

      const { total, itemCount } = calculateTotals(newItems);
      return { ...state, items: newItems, total, itemCount };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      const { total, itemCount } = calculateTotals(newItems);
      return { ...state, items: newItems, total, itemCount };
    }

    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      const { total, itemCount } = calculateTotals(newItems);
      return { ...state, items: newItems, total, itemCount };
    }

    case 'CLEAR_CART':
      return { ...state, items: [], total: 0, itemCount: 0 };

    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };

    case 'LOAD_CART': {
      const { total, itemCount } = calculateTotals(action.payload);
      return { ...state, items: action.payload, total, itemCount };
    }

    case 'SET_SYNCING':
      return { ...state, isSyncing: action.payload };

    default:
      return state;
  }
};

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
  isOpen: false,
  isSyncing: false,
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  // Removed user/auth context

  // 1. Initial Load (LocalStorage Only)
  useEffect(() => {
    const loadCart = async () => {
      dispatch({ type: 'SET_SYNCING', payload: true });

      // Always load from LocalStorage since we have no user accounts
      const savedCart = localStorage.getItem('kuyen_cart');
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart);
          // MIGRATION: Fix old format (size -> selectedSize, etc)
          const migrated = parsed.map((item: any) => ({
            ...item,
            selectedSize: item.selectedSize || item.size,
            selectedColor: item.selectedColor || item.color,
            // Ensure ID exists
            id: item.id || generateCartItemId(item.product.id, item.selectedSize || item.size, item.selectedColor || item.color)
          }));
          dispatch({ type: 'LOAD_CART', payload: migrated });
        } catch (e) {
          console.error('Error parsing cart', e);
          localStorage.removeItem('kuyen_cart');
        }
      }

      dispatch({ type: 'SET_SYNCING', payload: false });
    };

    loadCart();
  }, []);

  // 2. Persist to LocalStorage
  useEffect(() => {
    localStorage.setItem('kuyen_cart', JSON.stringify(state.items));
  }, [state.items]);


  // Actions
  const addItem = async (itemPayload: Omit<CartItem, 'id'>) => {
    const id = generateCartItemId(itemPayload.product.id, itemPayload.selectedSize, itemPayload.selectedColor);
    const newItem: CartItem = { ...itemPayload, id };
    dispatch({ type: 'ADD_ITEM', payload: newItem });
  };

  const removeItem = async (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) return removeItem(id);
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = async () => {
    dispatch({ type: 'CLEAR_CART' });
    localStorage.removeItem('kuyen_cart');
  };

  const toggleCart = () => dispatch({ type: 'TOGGLE_CART' });
  const getTotalPrice = () => state.total;

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};