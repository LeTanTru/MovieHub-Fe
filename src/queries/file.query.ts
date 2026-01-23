import { fileApiRequest } from '@/api-requests';
import { queryKeys } from '@/constants';
import { useMutation } from '@tanstack/react-query';

export const useUploadImageMutation = () => {
  return useMutation({
    mutationKey: [`upload-image-${queryKeys.FILE}`],
    mutationFn: ({ file }: { file: Blob }) =>
      fileApiRequest.uploadImage({ file })
  });
};

export const useDeleteFileMutation = () => {
  return useMutation({
    mutationKey: [`delete-${queryKeys.FILE}`],
    mutationFn: (body: { filePath: string }) => fileApiRequest.deleteFile(body)
  });
};
