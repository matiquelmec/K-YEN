import crypto from 'crypto';

export interface CloudinaryUploadResult {
  publicUrl: string;
  filePath: string;
  success: boolean;
}

/**
 * Uploads a base64 or Buffer image file directly to Cloudinary.
 * @param fileBuffer Image data as Buffer
 * @param mimeType Image MIME type (e.g. image/webp)
 * @param category Category folder (e.g. gotico, primaveral)
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

  const base64Image = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
  const timestamp = Math.round(new Date().getTime() / 1000);
  const folder = `kuyen-tienda-vestidos/${category.toLowerCase().trim()}`;
  
  // Clean public_id to prevent extensions or spaces
  const publicId = fileName 
    ? fileName.replace(/\.[^/.]+$/, "").replace(/[^a-z0-9_-]+/gi, "-").toLowerCase() 
    : undefined;

  // Create signature including public_id if present
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
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to upload to Cloudinary');
  }

  const uploadData = await response.json();

  return {
    success: true,
    publicUrl: uploadData.secure_url,
    filePath: uploadData.public_id,
  };
}
