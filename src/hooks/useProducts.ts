import { useState, useEffect, useCallback } from 'react';
import { productService, GetProductsOptions } from '@/services/productService';
import { Product } from '@/types';

export function useProducts(options: GetProductsOptions = {}) {
  const { category, search, sortBy, limit } = options;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const queryOptions: GetProductsOptions = {};
      if (category !== undefined) queryOptions.category = category;
      if (search !== undefined) queryOptions.search = search;
      if (sortBy !== undefined) queryOptions.sortBy = sortBy;
      if (limit !== undefined) queryOptions.limit = limit;

      const data = await productService.getProducts(queryOptions);
      setProducts(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [category, search, sortBy, limit]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
}

export function useProduct(id: string | number) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const data = await productService.getProductById(id);
      setProduct(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id, fetchProduct]);

  return { product, loading, error, refetch: fetchProduct };
}
