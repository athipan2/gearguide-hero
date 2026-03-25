/**
 * Image processing utilities for resizing and compressing images before upload.
 * Uses HTML5 Canvas for client-side processing.
 */

export interface ResizeOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maintainAspectRatio?: boolean;
}

export const IMAGE_VARIANTS = {
  hero: { maxWidth: 1200, maxHeight: 800, quality: 0.85 },
  card: { maxWidth: 600, maxHeight: 450, quality: 0.8 },
  thumbnail: { maxWidth: 200, maxHeight: 200, quality: 0.7 },
  full: { maxWidth: 2000, maxHeight: 1500, quality: 0.9 }
};

/**
 * Resizes a File or Blob and returns a new Blob.
 */
export async function resizeImage(
  file: File | Blob,
  options: ResizeOptions = IMAGE_VARIANTS.hero
): Promise<Blob> {
  const { maxWidth = 1200, maxHeight = 800, quality = 0.85, maintainAspectRatio = true } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (maintainAspectRatio) {
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }
        } else {
          width = maxWidth;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Canvas to Blob conversion failed'));
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}
