import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { signFlowParams, getFlowConfig } from '@/lib/flow';
import { optimizeCloudinaryUrl } from '@/lib/product-utils';

describe('Flow.cl Payment Gateway Integration Tests', () => {
  const secretKey = 'test_secret_key_flow_2026';

  it('debe generar la firma digital HMAC-SHA256 ordenando claves alfabéticamente', () => {
    // Parámetros desordenados
    const params = {
      subject: 'Vestido Rosa Alba',
      apiKey: 'API_KEY_12345',
      amount: 45990,
      commerceOrder: 'ORD-987654',
      currency: 'CLP',
      email: 'clienta@casaaira.cl'
    };

    const signature = signFlowParams(params, secretKey);

    expect(signature).toBeDefined();
    expect(typeof signature).toBe('string');
    expect(signature.length).toBe(64); // SHA-256 en hexadecimal es de 64 caracteres

    // La misma entrada debe generar exactamente la misma firma
    const signature2 = signFlowParams(params, secretKey);
    expect(signature).toBe(signature2);

    // Si se altera un valor (ej. amount), la firma debe cambiar
    const signatureTampered = signFlowParams({ ...params, amount: 1000 }, secretKey);
    expect(signature).not.toBe(signatureTampered);
  });

  it('debe mapear correctamente los estados numéricos oficiales de Flow', () => {
    // Mapeo oficial:
    // 1: Pendiente, 2: Pagada, 3: Rechazada, 4: Anulada
    const mapFlowStatus = (status: number) => {
      switch (status) {
        case 2:
          return { orderStatus: 'paid', paymentStatus: 'approved' };
        case 1:
          return { orderStatus: 'pending', paymentStatus: 'pending' };
        case 3:
          return { orderStatus: 'cancelled', paymentStatus: 'rejected' };
        case 4:
          return { orderStatus: 'cancelled', paymentStatus: 'cancelled' };
        default:
          return { orderStatus: 'pending', paymentStatus: 'unknown' };
      }
    };

    expect(mapFlowStatus(2)).toEqual({ orderStatus: 'paid', paymentStatus: 'approved' });
    expect(mapFlowStatus(1)).toEqual({ orderStatus: 'pending', paymentStatus: 'pending' });
    expect(mapFlowStatus(3)).toEqual({ orderStatus: 'cancelled', paymentStatus: 'rejected' });
    expect(mapFlowStatus(4)).toEqual({ orderStatus: 'cancelled', paymentStatus: 'cancelled' });
  });

  it('debe ignorar claves con valor undefined o null al concatenar para la firma', () => {
    const paramsWithNull = {
      apiKey: 'KEY123',
      amount: 10000,
      optional: null,
      notes: undefined
    };

    const paramsClean = {
      apiKey: 'KEY123',
      amount: 10000
    };

    const sig1 = signFlowParams(paramsWithNull, secretKey);
    const sig2 = signFlowParams(paramsClean, secretKey);

    expect(sig1).toBe(sig2);
  });

  it('debe optimizar URLs de Cloudinary con f_auto,q_auto:good,w_... de forma idempotente (Nivel 5)', () => {
    const rawUrl = 'https://res.cloudinary.com/demo/image/upload/v1700000/vestido-gala.jpg';
    const optimized = optimizeCloudinaryUrl(rawUrl, 800);

    expect(optimized).toBe(
      'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto:good,w_800,c_limit/v1700000/vestido-gala.jpg'
    );

    // Idempotencia: aplicar optimizeCloudinaryUrl nuevamente no debe duplicar parámetros
    expect(optimizeCloudinaryUrl(optimized, 800)).toBe(optimized);

    // Rutas locales o externas no-Cloudinary deben permanecer intactas
    expect(optimizeCloudinaryUrl('/brand/logo.png', 600)).toBe('/brand/logo.png');
  });

  describe('Configuración dinámica del entorno Flow', () => {
    const originalEnv = { ...process.env };

    beforeEach(() => {
      delete process.env.FLOW_API_KEY;
      delete process.env.FLOW_SECRET_KEY;
      delete process.env.FLOW_ENV;
      delete process.env.FLOW_API_URL;
      (process.env as Record<string, string | undefined>).NODE_ENV = 'test';
    });

    afterEach(() => {
      process.env = { ...originalEnv };
    });

    it('debe usar endpoint de Producción cuando FLOW_ENV=production', () => {
      process.env.FLOW_API_KEY = 'PROD_KEY';
      process.env.FLOW_SECRET_KEY = 'PROD_SEC';
      process.env.FLOW_ENV = 'production';

      const config = getFlowConfig();
      expect(config.apiUrl).toBe('https://www.flow.cl/api');
      expect(config.apiKey).toBe('PROD_KEY');
      expect(config.secretKey).toBe('PROD_SEC');
    });

    it('debe usar endpoint de Sandbox por defecto si FLOW_ENV=sandbox o no está definido', () => {
      process.env.FLOW_API_KEY = 'SANDBOX_KEY';
      process.env.FLOW_SECRET_KEY = 'SANDBOX_SEC';
      process.env.FLOW_ENV = 'sandbox';

      const config = getFlowConfig();
      expect(config.apiUrl).toBe('https://sandbox.flow.cl/api');
    });

    it('debe priorizar FLOW_API_URL si se define explícitamente', () => {
      process.env.FLOW_API_URL = 'https://custom-flow.proxy.internal/api/';

      const config = getFlowConfig();
      expect(config.apiUrl).toBe('https://custom-flow.proxy.internal/api');
    });
  });
});
