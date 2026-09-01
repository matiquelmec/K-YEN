import { type NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { verifyJWT } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const token =
      request.cookies.get('kuyen_admin_session')?.value ||
      request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

    if (!token || !(await verifyJWT(token))) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No se ha adjuntado ningún archivo' }, { status: 400 });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      return NextResponse.json(
        { error: 'Formato no permitido. Solo se aceptan imágenes JPG, PNG o WebP.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeFileName = `manifesto-editorial-${Date.now().toString().slice(-6)}`;
    const uploadResult = await uploadToCloudinary(buffer, file.type, 'brand', safeFileName);

    return NextResponse.json({
      success: true,
      publicUrl: uploadResult.publicUrl,
    });
  } catch (error: any) {
    console.error('Error uploading manifesto image:', error);
    return NextResponse.json(
      { error: error.message || 'Error al subir la imagen editorial' },
      { status: 500 }
    );
  }
}
