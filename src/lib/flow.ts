import crypto from 'crypto';

export interface FlowPaymentParams {
  commerceOrder: string;
  subject: string;
  currency?: string;
  amount: number;
  email: string;
  urlConfirmation: string;
  urlReturn: string;
  optional?: Record<string, any>;
  paymentMethod?: number;
}

export interface FlowPaymentResponse {
  url: string;
  token: string;
  flowOrder: number;
  redirectUrl: string;
}

export interface FlowPaymentStatus {
  flowOrder: number;
  commerceOrder: string;
  requestDate: string;
  status: number; // 1: Pendiente, 2: Pagada, 3: Rechazada, 4: Anulada
  subject: string;
  currency: string;
  amount: number;
  payer: string;
  paymentData?: {
    date?: string;
    media?: string;
    conversionDate?: string;
    conversionRate?: number;
    amount?: number;
    currency?: string;
    fee?: number;
    balance?: number;
    transferDate?: string;
  };
}

/**
 * Genera la firma digital HMAC-SHA256 oficial requerida por Flow.cl.
 * 1. Ordena las claves alfabéticamente.
 * 2. Concatena `key + value` consecutivamente.
 * 3. Firma con HMAC-SHA256 usando FLOW_SECRET_KEY.
 */
export function signFlowParams(params: Record<string, any>, secretKey: string): string {
  const keys = Object.keys(params).sort();
  let toSign = '';
  for (const key of keys) {
    if (params[key] !== undefined && params[key] !== null) {
      toSign += key + String(params[key]);
    }
  }

  return crypto.createHmac('sha256', secretKey).update(toSign).digest('hex');
}

/**
 * Obtiene la configuración base de Flow desde variables de entorno.
 * Soporta FLOW_API_URL explícita, o inferencia según FLOW_ENV / NODE_ENV.
 */
export function getFlowConfig() {
  const apiKey = (process.env.FLOW_API_KEY || '').trim();
  const secretKey = (process.env.FLOW_SECRET_KEY || '').trim();
  
  const isProduction = process.env.FLOW_ENV === 'production' || process.env.NODE_ENV === 'production';
  const defaultApiUrl = isProduction ? 'https://www.flow.cl/api' : 'https://sandbox.flow.cl/api';
  const apiUrl = (process.env.FLOW_API_URL || defaultApiUrl).trim().replace(/\/$/, '');

  return { apiKey, secretKey, apiUrl };
}

/**
 * Crea una orden de pago en Flow.cl y retorna la URL de redirección
 */
export async function createFlowPayment(params: FlowPaymentParams): Promise<FlowPaymentResponse> {
  const { apiKey, secretKey, apiUrl } = getFlowConfig();

  if (!apiKey || !secretKey) {
    throw new Error('Las credenciales de Flow (FLOW_API_KEY, FLOW_SECRET_KEY) no están configuradas.');
  }

  const payload: Record<string, any> = {
    apiKey,
    commerceOrder: params.commerceOrder,
    subject: params.subject,
    currency: params.currency || 'CLP',
    amount: Math.round(params.amount),
    email: params.email,
    urlConfirmation: params.urlConfirmation,
    urlReturn: params.urlReturn,
  };

  if (params.paymentMethod) {
    payload.paymentMethod = params.paymentMethod;
  }

  if (params.optional) {
    payload.optional = JSON.stringify(params.optional);
  }

  // Generar firma digital
  payload.s = signFlowParams(payload, secretKey);

  const body = new URLSearchParams();
  for (const [key, value] of Object.entries(payload)) {
    body.append(key, String(value));
  }

  const endpoint = `${apiUrl}/payment/create`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Error en Flow payment/create (HTTP ${response.status})`);
  }

  return {
    url: data.url,
    token: data.token,
    flowOrder: data.flowOrder,
    redirectUrl: `${data.url}?token=${data.token}`,
  };
}

/**
 * Consulta el estado oficial y verificado de una transacción mediante su token
 */
export async function getFlowPaymentStatus(token: string): Promise<FlowPaymentStatus> {
  const { apiKey, secretKey, apiUrl } = getFlowConfig();

  if (!apiKey || !secretKey) {
    throw new Error('Las credenciales de Flow no están configuradas.');
  }

  const params: Record<string, string> = {
    apiKey,
    token,
  };

  params.s = signFlowParams(params, secretKey);

  const query = new URLSearchParams(params).toString();
  const endpoint = `${apiUrl}/payment/getStatus?${query}`;

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Error en Flow payment/getStatus (HTTP ${response.status})`);
  }

  return data as FlowPaymentStatus;
}
