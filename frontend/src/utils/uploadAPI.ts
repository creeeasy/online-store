import { apiClient } from "./apiClient";

export const uploadAPI = {
  uploadImage: async (file: File): Promise<{ imageUrl: string }> => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await apiClient.postFormData<{ imageUrl: string }>(
        '/upload',
        formData,
        {
          timeout: 30000,
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            console.log(`Upload progress: ${percentCompleted}%`);
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  },
};
