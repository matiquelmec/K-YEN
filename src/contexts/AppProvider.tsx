'use client';

import { ReactNode } from 'react';
import { CartProvider } from './CartContext';


interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  );
}