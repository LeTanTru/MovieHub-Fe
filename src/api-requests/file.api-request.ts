import { apiConfig, uploadOptions } from '@/constants';
import { ApiResponse, UploadImageResponseType } from '@/types';
import { http } from '@/utils';

const fileApiRequest = {
  uploadImage: (file: Blob) =>
    http.post<ApiResponse<UploadImageResponseType>>(apiConfig.file.upload, {
      body: {
        file: file,
        type: uploadOptions.AVATAR
      }
    }),
  deleteFile: (body: { filePath: string }) =>
    http.post<ApiResponse<any>>(apiConfig.file.delete, {
      body
    })
};

export default fileApiRequest;
