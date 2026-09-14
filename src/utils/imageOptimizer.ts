/**
 * Image optimization utility for Abid Garments
 * Resizes, compresses, and converts images to WebP/JPEG using client-side canvas
 */

export interface OptimizedImageResult {
  dataUrl: string;
  originalSizeKB: number;
  optimizedSizeKB: number;
  reductionPercentage: number;
  width: number;
  height: number;
  mimeType: string;
}

export async function optimizeImageFile(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.82,
  preferWebP = true
): Promise<OptimizedImageResult> {
  const originalSizeKB = Math.round(file.size / 1024);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          let { width, height } = img;

          // Calculate aspect ratio scaled dimensions
          if (width > maxWidth || height > maxHeight) {
            if (width / height > maxWidth / maxHeight) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            throw new Error('Canvas 2D context not available');
          }

          // Render image
          ctx.drawImage(img, 0, 0, width, height);

          // Determine target mime type
          const targetMime = preferWebP ? 'image/webp' : 'image/jpeg';
          const dataUrl = canvas.toDataURL(targetMime, quality);

          // Calculate approximate base64 size
          const stringLength = dataUrl.length - dataUrl.indexOf(',') - 1;
          const optimizedSizeBytes = Math.round((stringLength * 3) / 4);
          const optimizedSizeKB = Math.round(optimizedSizeBytes / 1024);
          const reductionPercentage = Math.max(
            0,
            Math.round(((originalSizeKB - optimizedSizeKB) / (originalSizeKB || 1)) * 100)
          );

          resolve({
            dataUrl,
            originalSizeKB,
            optimizedSizeKB,
            reductionPercentage,
            width,
            height,
            mimeType: targetMime,
          });
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = () => reject(new Error('Failed to load image for optimization'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}
