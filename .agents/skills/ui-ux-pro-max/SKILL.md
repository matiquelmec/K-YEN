---
name: ui-ux-pro-max
description: Estándar de diseño Couture Editorial & Quiet Luxury para Casa Aira Boutique. Define la paleta OKLCH/Hex, jerarquía tipográfica Playfair Display + Inter, retícula Base 8, ergonomía táctil (>= 44px), integración elegante de redes sociales y WhatsApp Concierge, y cumplimiento WCAG 2.2 AA.
---

# UI/UX Pro Max — Casa Aira Couture Design System

Esta skill guía el diseño e implementación de interfaces de usuario para **Casa Aira Boutique (`tienda-vestidos`)**, asegurando una estética de alta costura (*Quiet Luxury*), conversión sin fricción y ergonomía móvil impecable.

## 1. Paleta Cromática Perceptual (Couture & Quiet Luxury)

| Token Semántico | Hex | Equivalente OKLCH | Uso Principal |
| :--- | :--- | :--- | :--- |
| **Alabastro Editorial** | `#FAF8F5` | `oklch(0.98 0.006 75)` | Fondo principal de páginas y lienzo cálido |
| **Arena Seda** | `#F4EFE8` | `oklch(0.95 0.012 75)` | Secciones secundarias (Manifiesto, Tarjetas suaves) |
| **Obsidiana Sastre** | `#181716` | `oklch(0.20 0.004 60)` | Tipografía principal, botones primarios y Footer |
| **Calipso Egeo** | `#1D707F` | `oklch(0.51 0.085 215)` | Acento de marca, estados activos, enlaces y badges |
| **Oro Champagne** | `#BFA15F` | `oklch(0.72 0.095 85)` | Detalles de lujo, líneas divisorias y acentos en fondo oscuro |
| **Rosa de Alba** | `#F8BBD9` | `oklch(0.84 0.075 350)` | Badges suaves y acentos de colección primaveral |
| **Esmeralda Concierge** | `#059669` | `oklch(0.60 0.150 160)` | Botones de asesoría personalizada por WhatsApp |

## 2. Jerarquía Tipográfica & Espaciado Base 8

- **Titulares Editoriales (`font-serif`):** `'Playfair Display', Georgia, serif`. Peso normal (`font-normal`), interlineado ajustado (`leading-tight` o `leading-[1.12]`), con palabras clave en cursiva (`italic text-calypso-700` o `text-calypso-300`).
- **Supratítulos / Eyebrows:** `text-[10px] sm:text-[11px] uppercase tracking-[0.35em] font-semibold`.
- **Cuerpo y Controles (`font-sans`):** `'Inter', sans-serif`. Pesos `font-light` para párrafos descriptivos y `font-semibold uppercase tracking-[0.2em]` para botones.
- **Retícula Base 8:** Utilizar múltiplos de 8px (`p-4`, `p-6`, `p-8`, `gap-4`, `gap-6`, `gap-8`, `py-24`, `py-32`).

## 3. Ergonomía Móvil, Touch Targets y Accesibilidad (WCAG 2.2 AA)

1. **Touch Targets Mínimos ($\ge 44\text{px}$):**
   - Todo botón interactivo (selectores de talla `XS` a `6XL`, swatches de color, íconos de redes sociales, carrito y menú móvil) debe tener al menos `44x44px` de área clicable (`min-w-[44px] min-h-[44px]`).
2. **Micro-Interacciones de Alta Costura:**
   - Transiciones suaves (`transition-all duration-300` o `duration-500`), zoom sutil en fotografías de vestidos (`group-hover:scale-105 transition-transform duration-700`) y estados `focus-visible` nítidos.
3. **Redes Sociales & WhatsApp Concierge:**
   - Presentar las redes sociales (Instagram, TikTok, Facebook, Pinterest) y el canal de WhatsApp como un servicio de **Atención & Asesoría de Calce Boutique**, evitando botones flotantes invasivos que tapen el selector de tallas o el botón de compra en móvil.
