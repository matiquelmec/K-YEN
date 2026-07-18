/**
 * Web Crypto API-based JWT signing and verification.
 * Safe for Next.js Edge Runtime (middleware) and Node.js.
 */

const getSecretKey = async () => {
  const secret = process.env.JWT_SECRET || 'kuyen_admin_default_secret_key_change_me';
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
};

export async function signJWT(payload: Record<string, any>, expiresInSeconds: number = 86400): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  
  const tokenPayload = { ...payload, exp };
  
  const enc = new TextEncoder();
  const headerBase64 = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const payloadBase64 = btoa(JSON.stringify(tokenPayload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  
  const tokenString = `${headerBase64}.${payloadBase64}`;
  const key = await getSecretKey();
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(tokenString));
  
  const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
    
  return `${tokenString}.${signatureBase64}`;
}

export async function verifyJWT(token: string): Promise<Record<string, any> | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const [headerBase64, payloadBase64, signatureBase64] = parts;
    if (!headerBase64 || !payloadBase64 || !signatureBase64) return null;
    const tokenString = `${headerBase64}.${payloadBase64}`;
    
    // Re-verify signature
    const key = await getSecretKey();
    const enc = new TextEncoder();
    
    const sigBinary = new Uint8Array(
      atob(signatureBase64.replace(/-/g, '+').replace(/_/g, '/'))
        .split('')
        .map(c => c.charCodeAt(0))
    );
    
    const isValid = await crypto.subtle.verify('HMAC', key, sigBinary, enc.encode(tokenString));
    if (!isValid) return null;
    
    const payload = JSON.parse(atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/')));
    
    // Check expiration
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      return null; // Expired
    }
    
    return payload;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}
