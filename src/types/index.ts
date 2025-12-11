import { Database } from '@/lib/supabase/database.types';

export type Product = Database['public']['Tables']['products']['Row'];

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  favoriteCategories: string[];
  preferredSizes: string[];
  notifications: boolean;
}

export type Theme = 'light' | 'dark' | 'auto';
export type SortBy =
  | 'newest'
  | 'price_asc'
  | 'price_desc'
  | 'rating';
export type FilterBy = 'category' | 'size' | 'color' | 'price' | 'availability';
