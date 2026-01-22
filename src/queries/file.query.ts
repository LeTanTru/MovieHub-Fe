import { apiConfig, queryKeys, uploadOptions } from '@/constants';
import { ApiResponse, UploadImageResponseType } from '@/types';
import { http } from '@/utils';
import { useMutation } from '@tanstack/react-query';

export const useUploadImageMutation = () => {
  return useMutation({
    mutationKey: [`upload-image-${queryKeys.FILE}`],
    mutationFn: ({ file }: { file: Blob }) =>
      http.post<ApiResponse<UploadImageResponseType>>(apiConfig.file.upload, {
        body: {
          file: file,
          type: uploadOptions.AVATAR
        }
      })
  });
};

export const useDeleteFileMutation = () => {
  return useMutation({
    mutationKey: [`delete-${queryKeys.FILE}`],
    mutationFn: (body: { filePath: string }) =>
      http.post<ApiResponse<any>>(apiConfig.file.delete, {
        body
      })
  });
};
