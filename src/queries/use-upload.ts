import uploadApiRequest from '@/apiRequests/upload.api-request';
import { useMutation } from '@tanstack/react-query';

export const useUploadImageMutation = () => {
  return useMutation({
    mutationFn: async (file: Blob) => await uploadApiRequest.image(file)
  });
};
