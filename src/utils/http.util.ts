import { storageKeys } from '@/constants';
import { ApiConfig } from '@/types';
import {
  getAccessTokenFromLocalStorage,
  removeAccessTokenFromLocalStorage,
  isTokenExpired,
  getData
} from '@/utils';
import { getCookiesServer } from '@/utils/cookies-server.util';

const isClient = () => typeof window !== 'undefined';

type Payload = {
  params?: Record<string, any>;
  pathParams?: Record<string, string>;
  data?: any;
};

const sendRequest = async <Response>(
  apiConfig: ApiConfig,
  payload: Payload
): Promise<{
  data?: Response;
  error?: any;
}> => {
  let { baseUrl, headers, method, ignoreAuth, isRequiredTenantId, isUpload } =
    apiConfig;
  const { params = {}, pathParams = {}, data = {} } = payload;

  let accessToken: string | null = '';
  let tenantId: string | null = '';
  if (isClient()) {
    accessToken = getAccessTokenFromLocalStorage();
    if (isTokenExpired(accessToken)) {
      removeAccessTokenFromLocalStorage();
    }
    if (isRequiredTenantId) {
      tenantId = getData(storageKeys.X_TENANT);
    }
  } else {
    const { sessionToken, tenantId: serverTenantId } = await getCookiesServer();
    accessToken = sessionToken;
    if (isRequiredTenantId) {
      tenantId = serverTenantId;
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
      const result: Response = await response.json();
      return { data: result };
    } catch (error: any) {
      return { error };
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
      body: data ? JSON.stringify(data) : undefined
    });

    const result: Response = await response.json();
    return { data: result };
  } catch (error: any) {
    return { error };
  }
};

const http = {
  get<Response>(apiConfig: ApiConfig, payload: Payload) {
    return sendRequest<Response>(apiConfig, payload);
  },
  post<Response>(apiConfig: ApiConfig, payload: Payload) {
    return sendRequest<Response>(apiConfig, payload);
  },
  put<Response>(apiConfig: ApiConfig, payload: Payload) {
    return sendRequest<Response>(apiConfig, payload);
  },
  delete<Response>(apiConfig: ApiConfig, payload: Payload) {
    return sendRequest<Response>(apiConfig, payload);
  }
};

export default http;
