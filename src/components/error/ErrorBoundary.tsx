'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, you might want to log this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Log to error service (Sentry, LogRocket, etc.)
      // logErrorToService(error, errorInfo);
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className='min-h-screen bg-gradient-to-br from-slate-900 via-red-900/20 to-slate-900 flex items-center justify-center p-4'>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className='max-w-md w-full bg-white/10 backdrop-blur-lg border border-red-500/30 rounded-xl p-8 text-center'
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className='w-16 h-16 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center'
            >
              <AlertTriangle className='w-8 h-8 text-red-400' />
            </motion.div>

            <h1 className='text-2xl font-bold text-white mb-4'>
              ¡Algo salió mal!
            </h1>

            <p className='text-gray-300 mb-6 leading-relaxed'>
              Lo sentimos, ocurrió un error inesperado. Nuestro equipo ha sido
              notificado y está trabajando para solucionarlo.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className='mb-6 text-left'>
                <summary className='text-red-300 cursor-pointer hover:text-red-200 transition-colors'>
                  Detalles técnicos
                </summary>
                <pre className='mt-2 p-3 bg-black/40 rounded text-xs text-red-200 overflow-auto max-h-32'>
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            <div className='space-y-3'>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={this.handleRetry}
                className='w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 hover:from-blue-700 hover to-purple-700 transition-all'
              >
                <RefreshCw className='w-4 h-4' />
                Intentar de nuevo
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={this.handleGoHome}
                className='w-full bg-white/10 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-white/20 transition-all border border-white/20'
              >
                <Home className='w-4 h-4' />
                Ir al inicio
              </motion.button>
            </div>

            <p className='text-xs text-gray-400 mt-6'>
              Si el problema persiste, contáctanos en soporte@kuyen.cl
            </p>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
