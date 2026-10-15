// ImgBB Upload Service
export const IMGBB_API_KEY = '4d8f54c51bb726b496f79bc6709ddf3e';

const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL)
  ? import.meta.env.VITE_API_URL
  : 'http://localhost:5000/api';

/**
 * Convert a File/Blob to base64 string (without the data:...;base64, prefix)
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      // Strip the "data:image/xxx;base64," prefix
      const base64 = typeof result === 'string' && result.includes(',')
        ? result.split(',')[1]
        : result;
      resolve(base64);
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Compress/resize image before upload to avoid ImgBB size limits
 * Max dimension = 2000px, quality = 0.82
 */
function compressImage(file, maxDimension = 2000, quality = 0.82) {
  return new Promise((resolve) => {
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

      // If already small enough and file is under 4MB, skip compression
      if (width <= maxDimension && height <= maxDimension && file.size < 4 * 1024 * 1024) {
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
            resolve(new File([blob], file.name || 'upload.jpg', { type: 'image/jpeg' }));
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

function makeResultObject(finalUrl, data = {}) {
  const obj = {
    success: true,
    url: finalUrl,
    thumbUrl: data?.thumb?.url || finalUrl,
    deleteUrl: data?.delete_url || '',
    data: data,
  };
  // Polyfill string coercions so legacy code expecting string works seamlessly
  obj.toString = () => finalUrl;
  obj.valueOf = () => finalUrl;
  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive) {
    obj[Symbol.toPrimitive] = () => finalUrl;
  }
  return obj;
}

/**
 * Upload an image file or base64 or URL to ImgBB
 * Tries server proxy endpoint first (ad-blocker & CORS safe), then direct ImgBB API
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
        // External URL — try to fetch and convert to base64
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
          // Fall through to server or direct URL upload
        }

        if (!base64Data) {
          base64Data = imageSource;
        }
      } else {
        // Assume it's raw base64 already
        base64Data = imageSource;
      }
    } else {
      throw new Error('Invalid image format provided for upload');
    }

    if (!base64Data) {
      return { success: false, message: 'Could not process image for upload' };
    }

    // 1. ATTEMPT BACKEND PROXY FIRST (Safe from ad-blockers, no browser CORS issues)
    try {
      const backendRes = await fetch(`${API_BASE}/events/upload-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64Data }),
      });

      if (backendRes.ok) {
        const backendData = await backendRes.json();
        if (backendData && backendData.success && backendData.url) {
          return makeResultObject(backendData.url, backendData.data);
        }
      }
    } catch (backendErr) {
      console.warn('[ImgBB] Backend upload proxy failed, falling back to direct upload:', backendErr.message);
    }

    // 2. FALLBACK TO DIRECT IMGBB API
    const params = new URLSearchParams();
    params.append('image', base64Data);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      { method: 'POST', body: params }
    );

    const result = await response.json();

    if (result && result.success && result.data) {
      const finalUrl = result.data.display_url || result.data.url;
      return makeResultObject(finalUrl, result.data);
    } else {
      const errMsg = result?.error?.message || 'ImgBB upload failed';
      console.error('[ImgBB Error]', errMsg, result);
      return { success: false, message: errMsg };
    }

  } catch (error) {
    console.error('[ImgBB Exception]', error);
    return {
      success: false,
      message: error.message || 'Network error while connecting to ImgBB',
    };
  }
}

export default uploadToImgbb;

