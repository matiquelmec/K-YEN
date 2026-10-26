import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import CasaAiraLogo from '@/components/ui/CasaAiraLogo';

describe('CasaAiraLogo Component (Official Vector Identity 2026)', () => {
  it('renderiza la variante completa horizontal oficial con SVG canónico', () => {
    const { container } = render(<CasaAiraLogo variant="full" size="md" theme="light" />);
    const img = container.querySelector('img');

    expect(img).not.toBeNull();
    expect(img?.getAttribute('src')).toContain('casa-aira_horizontal_color.svg');
    expect(img?.getAttribute('alt')).toBe('Casa Aira Boutique');
  });

  it('renderiza la variante icon con el isotipo SVG oficial', () => {
    const { container } = render(<CasaAiraLogo variant="icon" size="lg" theme="light" />);
    const img = container.querySelector('img');

    expect(img).not.toBeNull();
    expect(img?.getAttribute('src')).toContain('casa-aira_isotipo_color.svg');
    expect(img?.getAttribute('alt')).toBe('Isotipo Oficial Casa Aira');
  });

  it('renderiza la variante text con el wordmark SVG oficial', () => {
    const { container } = render(<CasaAiraLogo variant="text" size="lg" theme="dark" />);
    const img = container.querySelector('img');

    expect(img).not.toBeNull();
    expect(img?.getAttribute('src')).toContain('casa-aira_wordmark_blanco.svg');
    expect(img?.getAttribute('alt')).toBe('Casa Aira Tipografía');
  });

  it('aplica correctamente el asset SVG blanco para tema dark', () => {
    const { container } = render(<CasaAiraLogo variant="full" theme="dark" />);
    const img = container.querySelector('img');

    expect(img?.getAttribute('src')).toContain('casa-aira_horizontal_blanco.svg');
  });

  it('aplica correctamente el asset SVG color para tema light', () => {
    const { container } = render(<CasaAiraLogo variant="full" theme="light" />);
    const img = container.querySelector('img');

    expect(img?.getAttribute('src')).toContain('casa-aira_horizontal_color.svg');
  });
});
