'use client';

import CasaAiraLogo from './CasaAiraLogo';

interface KuyenLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  variant?: 'full' | 'icon' | 'text';
  animated?: boolean;
  className?: string;
  theme?: 'light' | 'dark';
}

export default function KuyenLogo({
  size = 'md',
  variant = 'full',
  animated = true,
  className = '',
  theme = 'light',
}: KuyenLogoProps) {
  const mappedSize = size === '3xl' || size === '4xl' ? '2xl' : size;
  return (
    <CasaAiraLogo
      size={mappedSize as any}
      variant={variant}
      animated={animated}
      className={className}
      theme={theme}
    />
  );
}
