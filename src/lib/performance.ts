/**
 * Performance utilities for optimal loading and rendering
 */

// Lazy load images with intersection observer
export function createImageObserver() {
  if (typeof window === 'undefined') return null;

  const imageObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;

          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
          }

          observer.unobserve(img);
        }
      });
    },
    {
      rootMargin: '50px 0px',
      threshold: 0.01,
    }
  );

  return imageObserver;
}

// Preload critical resources
export function preloadCriticalResources() {
  if (typeof window === 'undefined') return;

  // Preload critical fonts
  const fontLink = document.createElement('link');
  fontLink.rel = 'preload';
  fontLink.href = '/fonts/playfair-display.woff2';
  fontLink.as = 'font';
  fontLink.type = 'font/woff2';
  fontLink.crossOrigin = 'anonymous';
  document.head.appendChild(fontLink);

  // Preload hero image
  const heroImageLink = document.createElement('link');
  heroImageLink.rel = 'preload';
  heroImageLink.href = '/images/hero-background.webp';
  heroImageLink.as = 'image';
  document.head.appendChild(heroImageLink);
}

// Optimize bundle loading
export function loadNonCriticalResources() {
  if (typeof window === 'undefined') return;

  // Load analytics after page is interactive
  window.addEventListener('load', () => {
    setTimeout(() => {
      // Load Google Analytics or other analytics
      if (process.env.NODE_ENV === 'production') {
        // Analytics loading code
      }
    }, 2000);
  });
}

// Performance monitoring
export function trackWebVitals() {
  if (typeof window === 'undefined') return;

  // Simple performance tracking without external dependencies
  try {
    const observer = new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        if (process.env.NODE_ENV === 'production') {
          console.log('Performance metric:', entry);
        }
      }
    });

    observer.observe({
      entryTypes: ['navigation', 'paint', 'largest-contentful-paint'],
    });
  } catch (error) {
    console.warn('Performance Observer not available:', error);
  }
}

// Reduce layout shifts
export function preventLayoutShift() {
  if (typeof window === 'undefined') return;

  // Add CSS to prevent layout shifts
  const style = document.createElement('style');
  style.textContent = `
    img[data-src] {
      background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
      min-height: 200px;
    }
    
    .loading-skeleton {
      animation: skeleton-loading 1.5s ease-in-out infinite alternate;
    }
    
    @keyframes skeleton-loading {
      0% { opacity: 0.7; }
      100% { opacity: 0.3; }
    }
  `;
  document.head.appendChild(style);
}

// Memory management
export function cleanupResources() {
  // Cleanup function for unmounting components
  return () => {
    // Remove event listeners
    // Clear timers
    // Cancel pending requests
  };
}

// Bundle optimization
export const optimizeBundle = {
  // Code splitting for routes
  loadProductPage: () => import('@/app/catalogo/page'),

  // Preload critical chunks
  preloadCritical: () => {
    // Preload critical route chunks
    import('@/components/ProductCard');
    import('@/components/ui/KuyenLogo');
  },
};

// Image optimization helpers
export function generateSrcSet(imagePath: string, sizes: number[]): string {
  return sizes.map(size => `${imagePath}?w=${size} ${size}w`).join(', ');
}

export function getOptimalImageSize(
  containerWidth: number,
  devicePixelRatio: number = 1
): number {
  const targetWidth = containerWidth * devicePixelRatio;
  const standardSizes = [320, 640, 768, 1024, 1280, 1920];

  return standardSizes.find(size => size >= targetWidth) || 1920;
}
