'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role?: 'customer' | 'admin';
  createdAt?: Date;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  // Verificar sesión al cargar
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));

      // Verificar token en localStorage
      const token = localStorage.getItem('kuyen_auth_token');
      const userData = localStorage.getItem('kuyen_user');

      if (token && userData) {
        const user = JSON.parse(userData);
        setState({
          user,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });
      } else {
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          error: null,
        });
      }
    } catch (error) {
      console.error('Error checking session:', error);
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: 'Error al verificar la sesión',
      });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // TODO: Implementar llamada real a la API
      // Por ahora simular login exitoso
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0] || 'Usuario',
        role: 'customer',
        createdAt: new Date(),
      };

      // Guardar en localStorage
      localStorage.setItem('kuyen_auth_token', 'mock_token_' + Date.now());
      localStorage.setItem('kuyen_user', JSON.stringify(mockUser));

      setState({
        user: mockUser,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Error al iniciar sesión',
      }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));

      // Limpiar localStorage
      localStorage.removeItem('kuyen_auth_token');
      localStorage.removeItem('kuyen_user');
      localStorage.removeItem('kuyen_cart');

      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
    } catch (error) {
      console.error('Error during logout:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Error al cerrar sesión',
      }));
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // TODO: Implementar llamada real a la API
      // Por ahora simular registro exitoso
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name,
        role: 'customer',
        createdAt: new Date(),
      };

      // Guardar en localStorage
      localStorage.setItem('kuyen_auth_token', 'mock_token_' + Date.now());
      localStorage.setItem('kuyen_user', JSON.stringify(mockUser));

      setState({
        user: mockUser,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Error al registrar usuario',
      }));
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // TODO: Implementar llamada real a la API
      console.log('Password reset requested for:', email);

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Error al restablecer contraseña',
      }));
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      if (!state.user) throw new Error('Usuario no autenticado');

      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const updatedUser = { ...state.user, ...updates };

      // TODO: Implementar llamada real a la API
      localStorage.setItem('kuyen_user', JSON.stringify(updatedUser));

      setState(prev => ({
        ...prev,
        user: updatedUser,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Error al actualizar perfil',
      }));
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        register,
        resetPassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};