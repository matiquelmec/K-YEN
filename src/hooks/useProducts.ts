import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  original_price: number | null;
  category: string;
  sizes: string[];
  colors: string[];
  images: string[];
  stock: number;
  rating: number | null;
  reviews_count: number;
  is_new: boolean;
  is_sale: boolean;
  tags: string[];
}

interface UseProductsOptions {
  category?: string;
  limit?: number;
  search?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'rating';
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [options.category, options.search, options.sortBy, options.limit]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let query = supabase.from('products').select('*');

      // Apply filters
      if (options.category && options.category !== 'all') {
        query = query.eq('category', options.category);
      }

      if (options.search) {
        query = query.or(`name.ilike.%${options.search}%,description.ilike.%${options.search}%`);
      }

      // Apply sorting
      switch (options.sortBy) {
        case 'price_asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price_desc':
          query = query.order('price', { ascending: false });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'rating':
          query = query.order('rating', { ascending: false, nullsFirst: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      // Apply limit
      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error, refetch: fetchProducts };
}

export function useProduct(id: number) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  return { product, loading, error, refetch: fetchProduct };
}