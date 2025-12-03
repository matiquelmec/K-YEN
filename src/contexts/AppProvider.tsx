'use client';

import { ReactNode } from 'react';
import { CartProvider } from './CartContext';
import { AuthProvider } from './AuthContext';

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </AuthProvider>
  );
}