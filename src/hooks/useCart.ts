import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from './useAuth';

interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  size: string;
  color: string;
  product?: {
    name: string;
    price: number;
    images: string[];
  };
}

export function useCart() {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  // Load cart items from database
  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      // Load from localStorage for anonymous users
      const localCart = localStorage.getItem('cart');
      if (localCart) {
        setItems(JSON.parse(localCart));
      }
    }
  }, [user]);

  // Calculate total
  useEffect(() => {
    const newTotal = items.reduce((sum, item) => {
      return sum + (item.product?.price || 0) * item.quantity;
    }, 0);
    setTotal(newTotal);
  }, [items]);

  const loadCart = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:products(name, price, images)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (productId: number, quantity: number = 1, size: string, color: string) => {
    if (!user) {
      // Handle anonymous cart
      const newItem = { product_id: productId, quantity, size, color, id: Date.now() };
      const updatedItems = [...items, newItem];
      setItems(updatedItems);
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      return { error: null };
    }

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .upsert({
          user_id: user.id,
          product_id: productId,
          quantity,
          size,
          color
        }, {
          onConflict: 'user_id,product_id,size,color'
        })
        .select();

      if (error) throw error;
      await loadCart();
      return { data, error: null };
    } catch (error) {
      console.error('Error adding item:', error);
      return { data: null, error };
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    if (!user) {
      // Handle anonymous cart
      const updatedItems = items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
      setItems(updatedItems);
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      return { error: null };
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId)
        .eq('user_id', user.id);

      if (error) throw error;
      await loadCart();
      return { error: null };
    } catch (error) {
      console.error('Error updating quantity:', error);
      return { error };
    }
  };

  const removeItem = async (itemId: number) => {
    if (!user) {
      // Handle anonymous cart
      const updatedItems = items.filter(item => item.id !== itemId);
      setItems(updatedItems);
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      return { error: null };
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId)
        .eq('user_id', user.id);

      if (error) throw error;
      await loadCart();
      return { error: null };
    } catch (error) {
      console.error('Error removing item:', error);
      return { error };
    }
  };

  const clearCart = async () => {
    if (!user) {
      setItems([]);
      localStorage.removeItem('cart');
      return { error: null };
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      setItems([]);
      return { error: null };
    } catch (error) {
      console.error('Error clearing cart:', error);
      return { error };
    }
  };

  const syncLocalCart = async () => {
    // Sync local cart to database when user logs in
    if (!user) return;

    const localCart = localStorage.getItem('cart');
    if (!localCart) return;

    const localItems = JSON.parse(localCart);

    for (const item of localItems) {
      await addItem(item.product_id, item.quantity, item.size, item.color);
    }

    localStorage.removeItem('cart');
  };

  return {
    items,
    loading,
    total,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    syncLocalCart,
  };
}