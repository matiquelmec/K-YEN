import { NextResponse } from 'next/server';
import { turso } from '@/lib/db/turso';

export const dynamic = 'force-dynamic';

export async function GET() {
  const start = Date.now();
  try {
    await turso.execute('SELECT 1');
    const latencyMs = Date.now() - start;

    const services = {
      database: 'connected',
      flowGateway: Boolean(process.env.FLOW_API_KEY && process.env.FLOW_SECRET_KEY)
        ? 'configured'
        : 'sandbox_or_unconfigured',
      cloudinaryCdn: Boolean(
        process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME
      )
        ? 'configured'
        : 'unconfigured',
    };

    return NextResponse.json(
      {
        status: 'ok',
        service: 'casa-aira-boutique',
        latencyMs,
        services,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    const latencyMs = Date.now() - start;
    console.error('[/api/health] Healthcheck error:', error);
    return NextResponse.json(
      {
        status: 'degraded',
        service: 'casa-aira-boutique',
        latencyMs,
        error: 'Database connectivity check failed',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
