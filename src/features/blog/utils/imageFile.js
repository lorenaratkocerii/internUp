const MAX_FILE_BYTES = 8 * 1024 * 1024;
const MAX_DIMENSION = 1400;
const QUALITY = 0.8;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];

export const ACCEPTED_IMAGE_TYPES = ACCEPTED.join(',');

export function readImageFile(file, { maxDimension = MAX_DIMENSION, quality = QUALITY, type = 'image/jpeg' } = {}) {
  return new Promise((resolve, reject) => {
    if (!ACCEPTED.includes(file.type)) {
      reject(new Error('Zgjidh një fotografi JPG, PNG ose WEBP.'));
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      reject(new Error('Fotografia duhet të jetë më e vogël se 8 MB.'));
      return;
    }

    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL(type, quality));
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Fotografia nuk u lexua. Provo një skedar tjetër.'));
    };
    image.src = url;
  });
}
