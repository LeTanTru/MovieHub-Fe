import { apiConfig, uploadOptions } from '@/constants';
import { ApiResponse, UploadImageResponseType } from '@/types';
import { http } from '@/utils';

const uploadApiRequest = {
  image: async (file: Blob) =>
    await http.post<ApiResponse<UploadImageResponseType>>(
      apiConfig.file.upload,
      {
        body: {
          file: file,
          type: uploadOptions.AVATAR
        }
      }
    )
};

export default uploadApiRequest;
