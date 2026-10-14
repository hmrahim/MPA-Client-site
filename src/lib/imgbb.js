// ImgBB Upload Service
export const IMGBB_API_KEY = '4d8f54c51bb726b496f79bc6709ddf3e';

/**
 * Convert a File/Blob to base64 string (without the data:...;base64, prefix)
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      // Strip the "data:image/xxx;base64," prefix
      const base64 = result.split(',')[1] || result;
      resolve(base64);
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Compress/resize image before upload to avoid ImgBB size limits
 * Max dimension = 2000px, quality = 0.8
 */
function compressImage(file, maxDimension = 2000, quality = 0.8) {
  return new Promise((resolve, reject) => {
    // Only compress actual image files
    if (!file.type || !file.type.startsWith('image/')) {
      resolve(file);
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;

      // If already small enough and file is under 10MB, skip compression
      if (width <= maxDimension && height <= maxDimension && file.size < 10 * 1024 * 1024) {
        resolve(file);
        return;
      }

      // Scale down if needed
      if (width > maxDimension || height > maxDimension) {
        const ratio = Math.min(maxDimension / width, maxDimension / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(new File([blob], file.name || 'image.jpg', { type: 'image/jpeg' }));
          } else {
            resolve(file); // fallback to original
          }
        },
        'image/jpeg',
        quality
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file); // fallback to original on error
    };
    img.src = url;
  });
}

/**
 * Upload an image file or base64 or URL directly to ImgBB
 * @param {File|Blob|string} imageSource - Browser File object, Blob, or image URL/base64
 * @returns {Promise<{success: boolean, url?: string, data?: object, message?: string}>}
 */
export async function uploadToImgbb(imageSource) {
  try {
    let base64Data = null;

    if (imageSource instanceof File || imageSource instanceof Blob) {
      // Compress first, then convert to base64
      const compressed = await compressImage(imageSource);
      base64Data = await fileToBase64(compressed);

    } else if (typeof imageSource === 'string') {
      if (imageSource.startsWith('data:image')) {
        // data URL — strip prefix
        base64Data = imageSource.split(',')[1] || imageSource;

      } else if (imageSource.startsWith('http://') || imageSource.startsWith('https://')) {
        // External URL — fetch it and convert to base64
        // ImgBB's URL support via FormData is unreliable, so we fetch & convert
        try {
          const proxyResponse = await fetch(imageSource, { mode: 'cors' });
          if (proxyResponse.ok) {
            const blob = await proxyResponse.blob();
            if (blob.type && blob.type.startsWith('image/')) {
              const compressed = await compressImage(new File([blob], 'image.jpg', { type: blob.type }));
              base64Data = await fileToBase64(compressed);
            }
          }
        } catch {
          // CORS blocked — fall through to URL-based upload
        }

        // If fetching failed (CORS etc), try URL directly via URLSearchParams
        if (!base64Data) {
          const params = new URLSearchParams();
          params.append('image', imageSource);

          const response = await fetch(
            `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
            { method: 'POST', body: params }
          );

          const result = await response.json();
          if (result && result.success && result.data) {
            const finalUrl = result.data.display_url || result.data.url;
            return {
              success: true,
              url: finalUrl,
              thumbUrl: result.data.thumb?.url || finalUrl,
              deleteUrl: result.data.delete_url,
              data: result.data,
            };
          } else {
            const errMsg = result?.error?.message || 'ImgBB upload failed';
            console.error('[ImgBB Error]', errMsg, result);
            return { success: false, message: errMsg };
          }
        }

      } else {
        // Assume it's raw base64 already
        base64Data = imageSource;
      }
    } else {
      throw new Error('Invalid image format provided for upload');
    }

    // Upload base64 data using URLSearchParams (NOT FormData)
    // ImgBB works reliably with URLSearchParams for base64 strings
    if (base64Data) {
      const params = new URLSearchParams();
      params.append('image', base64Data);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        { method: 'POST', body: params }
      );

      const result = await response.json();

      if (result && result.success && result.data) {
        const finalUrl = result.data.display_url || result.data.url;
        return {
          success: true,
          url: finalUrl,
          thumbUrl: result.data.thumb?.url || finalUrl,
          deleteUrl: result.data.delete_url,
          data: result.data,
        };
      } else {
        const errMsg = result?.error?.message || 'ImgBB upload failed';
        console.error('[ImgBB Error]', errMsg, result);
        return { success: false, message: errMsg };
      }
    }

    return { success: false, message: 'Could not process image for upload' };

  } catch (error) {
    console.error('[ImgBB Exception]', error);
    return {
      success: false,
      message: error.message || 'Network error while connecting to ImgBB',
    };
  }
}

export default uploadToImgbb;
