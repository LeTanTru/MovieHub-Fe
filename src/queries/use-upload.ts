import { useMutation } from '@tanstack/react-query';

export const useUploadImage = () => {
  return useMutation({
    mutationFn: async (file: File) => {}
  });
};
