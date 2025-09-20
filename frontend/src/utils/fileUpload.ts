import { uploadAPI } from './uploadAPI';

export const uploadImageToServer = async (file: File): Promise<string> => {
  try {
    console.log('Starting upload for file:', file.name, file.size, file.type);
    
    const response = await uploadAPI.uploadImage(file);
    console.log('Upload successful:', response.imageUrl);
    
    return response.imageUrl;
  } catch (error: any) {
    console.error('Upload error details:', error);
    
    // Handle specific error cases
    if (error.status === 400) {
      throw new Error('Invalid file format or corrupted file. Please try another image.');
    } else if (error.status === 401) {
      throw new Error('Session expired. Please log in again.');
    } else if (error.status === 413) {
      throw new Error('File too large. Maximum size is 5MB.');
    } else if (error.status === 415) {
      throw new Error('Invalid file type. Please use JPEG, PNG, WEBP, or GIF.');
    } else if (error.message.includes('network')) {
      throw new Error('Network error. Please check your connection and try again.');
    } else if (error.message.includes('timeout')) {
      throw new Error('Upload timed out. Please try a smaller file.');
    }
    
    throw new Error(error.message || 'Failed to upload image. Please try again.');
  }
};

export const validateImageFile = (file: File): string | null => {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    return 'Please select a valid image file (JPEG, PNG, WEBP, GIF, SVG)';
  }

  if (file.size > maxSize) {
    return 'Image size must be less than 5MB';
  }

  return null;
};

// Optional: Helper function to get file extension
export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

// Optional: Helper function to generate unique filename
export const generateUniqueFilename = (originalName: string): string => {
  const extension = getFileExtension(originalName);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `image-${timestamp}-${random}.${extension}`;
};