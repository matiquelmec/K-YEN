'use client';

import { Suspense, ReactNode } from 'react';
import LoadingSpinner from './LoadingSpinner';
import ErrorBoundary from '../error/ErrorBoundary';

interface SuspenseWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  errorFallback?: ReactNode;
  loadingMessage?: string;
}

export default function SuspenseWrapper({
  children,
  fallback,
  errorFallback,
  loadingMessage = 'Cargando contenido...',
}: SuspenseWrapperProps) {
  const defaultFallback = (
    <div className='min-h-[400px] flex items-center justify-center'>
      <LoadingSpinner message={loadingMessage} size='lg' />
    </div>
  );

  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback || defaultFallback}>{children}</Suspense>
    </ErrorBoundary>
  );
}
