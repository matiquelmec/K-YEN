export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  images: string[];
  category: ProductCategory;
  sizes: ProductSize[];
  colors: ProductColor[];
  inStock: boolean;
  featured: boolean;
  rating?: number;
  reviews?: number;
  tags?: string[];
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface ProductSize {
  id: string;
  name: string;
  measurements?: {
    bust?: number;
    waist?: number;
    hips?: number;
  };
  available: boolean;
}

export interface ProductColor {
  id: string;
  name: string;
  hex: string;
  available: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: ProductSize;
  selectedColor: ProductColor;
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
  | 'price-low'
  | 'price-high'
  | 'popular'
  | 'rating';
export type FilterBy = 'category' | 'size' | 'color' | 'price' | 'availability';
