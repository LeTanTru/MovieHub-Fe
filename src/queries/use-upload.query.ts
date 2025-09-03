import { uploadApiRequest } from '@/api-requests';
import { useMutation } from '@tanstack/react-query';

export const useUploadImageMutation = () => {
  return useMutation({
    mutationFn: (file: Blob) => uploadApiRequest.image(file)
  });
};
