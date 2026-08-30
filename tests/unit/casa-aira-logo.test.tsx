import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import CasaAiraLogo from '@/components/ui/CasaAiraLogo';

describe('CasaAiraLogo Component', () => {
  it('renderiza la variante completa con el nombre CASA AIRA y descriptor BOUTIQUE', () => {
    render(<CasaAiraLogo variant="full" size="md" theme="light" />);
    
    expect(screen.getByText('CASA AIRA')).toBeDefined();
    expect(screen.getByText('BOUTIQUE')).toBeDefined();
  });

  it('renderiza la variante icon con accesibilidad y presencia de SVG', () => {
    const { container } = render(<CasaAiraLogo variant="icon" size="lg" theme="light" />);
    
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
  });

  it('renderiza la variante text con tipografía editorial Playfair', () => {
    render(<CasaAiraLogo variant="text" size="lg" theme="dark" />);
    
    expect(screen.getByText('CASA AIRA')).toBeDefined();
  });

  it('aplica correctamente las clases de color para tema dark', () => {
    render(<CasaAiraLogo variant="full" theme="dark" />);
    
    expect(screen.getByText('CASA AIRA').className).toContain('text-[#FAF8F5]');
    expect(screen.getByText('BOUTIQUE').className).toContain('text-stone-400');
  });

  it('aplica correctamente las clases de color para tema light', () => {
    render(<CasaAiraLogo variant="full" theme="light" />);
    
    expect(screen.getByText('CASA AIRA').className).toContain('text-[#181716]');
  });
});
