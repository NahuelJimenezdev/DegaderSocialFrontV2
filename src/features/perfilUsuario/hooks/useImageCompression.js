import { useCallback } from 'react';

/**
 * Hook para comprimir imágenes antes de subirlas
 * @returns {Object} Objeto con la función compressImage
 */
export const useImageCompression = () => {
  /**
   * Comprime una imagen a un ancho máximo y calidad específica
   * @param {File} file - Archivo de imagen a comprimir
   * @param {number} maxWidth - Ancho máximo en píxeles (default: 1200)
   * @param {number} quality - Calidad de compresión 0-1 (default: 0.8)
   * @returns {Promise<Blob>} Imagen comprimida como Blob
   */
  const compressImage = useCallback((file, maxWidth = 1200, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(resolve, 'image/jpeg', quality);
      };

      img.src = URL.createObjectURL(file);
    });
  }, []);

  return { compressImage };
};
