import { fileApiRequest } from '@/api-requests';
import { queryKeys } from '@/constants';
import { useMutation } from '@tanstack/react-query';

export const useUploadImageMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.FILE_UPLOAD_IMAGE],
    mutationFn: ({ file }: { file: Blob }) => fileApiRequest.uploadImage(file)
  });
};

export const useDeleteFileMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.FILE_DELETE],
    mutationFn: (body: { filePath: string }) => fileApiRequest.deleteFile(body)
  });
};
