import crypto from 'crypto';

export interface CloudinaryUploadResult {
  publicUrl: string;
  filePath: string;
  success: boolean;
}

/**
 * Uploads a base64 or Buffer image file directly to Cloudinary.
 * Con sanitización NFD, límites de tamaño y transformaciones automáticas.
 * @param fileBuffer Image data as Buffer
 * @param mimeType Image MIME type (e.g. image/webp)
 * @param category Category folder (e.g. gotico, primaveral)
 * @param fileName Original file name or SKU-prefixed identifier
 */
export async function uploadToCloudinary(
  fileBuffer: Buffer,
  mimeType: string,
  category: string = 'otros',
  fileName?: string
): Promise<CloudinaryUploadResult> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary credentials are not configured in environment variables.');
  }

  // 1. Validar tipo MIME
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/jpg'];
  if (!allowedMimeTypes.includes(mimeType)) {
    throw new Error(`Tipo de archivo no permitido: ${mimeType}. Solo se permiten JPG, PNG, WEBP y AVIF.`);
  }

  // 2. Validar tamaño máximo (5MB)
  const maxSize = 5 * 1024 * 1024;
  if (fileBuffer.length > maxSize) {
    throw new Error('El archivo excede el tamaño máximo permitido de 5MB.');
  }

  const base64Image = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
  const timestamp = Math.round(new Date().getTime() / 1000);
  const folder = `kuyen-tienda-vestidos/${category.toLowerCase().trim()}`;
  
  // 3. Sanitización NFD estricta para evitar errores en CDN (Estándar JoyasJP)
  let publicId: string | undefined;
  if (fileName) {
    const rawName = fileName.replace(/\.[^/.]+$/, '');
    publicId = rawName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9_-]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_+|_+$/g, '');
  }

  // 4. Crear firma con parámetros
  let paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
  if (publicId) {
    paramsToSign = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}`;
  }
  paramsToSign += apiSecret;

  const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const formData = new FormData();
  formData.append('file', base64Image);
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp.toString());
  formData.append('signature', signature);
  formData.append('folder', folder);
  if (publicId) {
    formData.append('public_id', publicId);
  }

  const response = await fetch(cloudinaryUrl, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to upload to Cloudinary');
  }

  const uploadData = await response.json();

  // Optimización de URL: entregamos URL segura con optimización automática
  const secureUrl = String(uploadData.secure_url || '').replace(
    '/upload/',
    '/upload/f_auto,q_auto/'
  );

  return {
    success: true,
    publicUrl: secureUrl || uploadData.secure_url,
    filePath: uploadData.public_id,
  };
}
