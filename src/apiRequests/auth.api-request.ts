import { apiConfig } from '@/constants';
import http from '@/utils/http.util';

const authApiRequest = {
  login: () => http.get(apiConfig.api)
};

export default authApiRequest;
