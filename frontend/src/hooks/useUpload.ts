// hooks/useImageUpload.ts
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { uploadImageToServer } from '../utils/fileUpload';
import type { ApiError } from '../utils/apiClient';

export const useImageUpload = () => {
  return useMutation<string, ApiError, File>({
    mutationFn: uploadImageToServer,
    onError: (error) => {
      toast.error(error.message || 'Failed to upload image');
    },
  });
};