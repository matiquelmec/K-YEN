import { Database } from '@/lib/supabase/database.types';

export type Product = Database['public']['Tables']['products']['Row'];

export interface CartItem {
  id: string;
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
// ... existing types

export interface Order {
  id: number; // Integer in DB
  user_id: string | null; // UUID or null
  order_number: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  shipping_address: {
    region: string;
    commune: string;
    address: string;
    number: string;
    dept?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  items: CartItem[]; // Stored as JSON B array in DB
  created_at: string;
  is_guest: boolean;
}
