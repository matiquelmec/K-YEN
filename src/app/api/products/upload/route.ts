import { type NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { verifyJWT } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Authenticate admin
    const token = request.cookies.get('kuyen_admin_session')?.value;
    if (!token || !(await verifyJWT(token))) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const category = formData.get('category') as string || 'otros';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log(`⏳ Subiendo imagen de vestido a Cloudinary en carpeta: kuyen-tienda-vestidos/${category}...`);
    const uploadResult = await uploadToCloudinary(buffer, file.type, category);

    return NextResponse.json({
      success: true,
      publicUrl: uploadResult.publicUrl,
    });
  } catch (error: any) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ error: error.message || 'Image upload failed' }, { status: 500 });
  }
}
