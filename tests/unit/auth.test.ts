import { describe, it, expect } from 'vitest';
import { signJWT, verifyJWT } from '@/lib/auth';

describe('Auth & JWT Service', () => {
  it('debe firmar y verificar un token JWT correctamente', async () => {
    const payload = { email: 'test@kuyen.cl', role: 'admin' };
    const token = await signJWT(payload, 3600);

    expect(token).toBeDefined();
    expect(token.split('.')).toHaveLength(3);

    const verified = await verifyJWT(token);
    expect(verified).not.toBeNull();
    expect(verified?.email).toBe('test@kuyen.cl');
    expect(verified?.role).toBe('admin');
  });

  it('debe rechazar un token manipulado en la firma', async () => {
    const payload = { email: 'admin@kuyen.cl', role: 'admin' };
    const token = await signJWT(payload, 3600);
    const parts = token.split('.');
    
    // Manipular el payload cambiando a otro rol
    const fakeToken = `${parts[0]}.${parts[1]}tampered.${parts[2]}`;
    const verified = await verifyJWT(fakeToken);

    expect(verified).toBeNull();
  });

  it('debe rechazar un token expirado', async () => {
    const payload = { email: 'expired@kuyen.cl' };
    // Token expirado en el pasado (-10 segundos)
    const token = await signJWT(payload, -10);

    const verified = await verifyJWT(token);
    expect(verified).toBeNull();
  });
});
