export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type ApiConfig = {
  baseUrl: string;
  headers: Record<string, string>;
  method: HttpMethod;
  ignoreAuth?: boolean;
  isRequiredTenantId?: boolean;
  isUpload?: boolean;
};

export type Payload = {
  params?: Record<string, any>;
  pathParams?: Record<string, string>;
  data?: any;
};
