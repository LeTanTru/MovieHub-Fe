import envConfig from '@/config';
import { storageKeys } from '@/constants';
import { ApiConfig, Payload } from '@/types';
import {
  getAccessTokenFromLocalStorage,
  removeAccessTokenFromLocalStorage,
  isTokenExpired,
  getData
} from '@/utils';
import { getCookiesServer } from '@/utils/cookies-server.util';

const isClient = () => typeof window !== 'undefined';

const sendRequest = async <T>(
  apiConfig: ApiConfig,
  payload: Payload = {}
): Promise<T> => {
  let { baseUrl, headers, method, ignoreAuth, isRequiredTenantId, isUpload } =
    apiConfig;
  const { params = {}, pathParams = {}, data = {} } = payload;

  let accessToken: string | null = '';
  let tenantId: string | null | undefined = '';
  if (isClient()) {
    accessToken = getAccessTokenFromLocalStorage();
    if (isTokenExpired(accessToken)) {
      removeAccessTokenFromLocalStorage();
    }
    if (isRequiredTenantId) {
      tenantId =
        getData(storageKeys.X_TENANT) || envConfig.NEXT_PUBLIC_TENANT_ID;
    }
  } else {
    const { sessionToken, tenantId: serverTenantId } = await getCookiesServer();
    accessToken = sessionToken;
    if (isRequiredTenantId) {
      tenantId = serverTenantId || process.env.TENANT_ID;
    }
  }
  const baseHeader: { [key: string]: string } = { ...headers };

  if (!ignoreAuth && accessToken) {
    baseHeader['Authorization'] = `Bearer ${accessToken}`;
  }

  if (isRequiredTenantId) {
    baseHeader[storageKeys.X_TENANT] = tenantId!;
  }

  Object.entries(pathParams).forEach(([key, value]) => {
    baseUrl = baseUrl.replace(`:${key}`, value);
  });

  if (headers['Content-Type'] === 'multipart/form-data' && isUpload) {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    try {
      const response = await fetch(baseUrl, {
        method,
        // headers: baseHeader,
        body: formData
      });
      const result = await response.json();
      return result;
    } catch (error: any) {
      throw new Error(`Error in API request: ${error.message}`);
    }
  }

  const queryParams = new URLSearchParams(params).toString();
  const fullUrl = queryParams ? `${baseUrl}?${queryParams}` : baseUrl;
  try {
    const response = await fetch(fullUrl, {
      method,
      headers: {
        ...baseHeader,
        'Content-Type': headers['Content-Type'] || 'application/json'
      },
      body: method !== 'GET' && data ? JSON.stringify(data) : undefined
    });

    const result = await response.json();
    return result;
  } catch (error: any) {
    throw new Error(`Error in API request: ${error.message}`);
  }
};

const http = {
  get<T>(apiConfig: ApiConfig, payload?: Payload) {
    return sendRequest<T>(apiConfig, payload);
  },
  post<T>(apiConfig: ApiConfig, payload?: Payload) {
    return sendRequest<T>(apiConfig, payload);
  },
  put<T>(apiConfig: ApiConfig, payload?: Payload) {
    return sendRequest<T>(apiConfig, payload);
  },
  delete<T>(apiConfig: ApiConfig, payload?: Payload) {
    return sendRequest<T>(apiConfig, payload);
  }
};

export default http;
