import AppConstants from '@/constants/app';
import { ApiConfigGroup } from '@/types';

const baseHeader = { 'Content-Type': 'application/json' };
const multipartHeader = { 'Content-Type': 'multipart/form-data' };

const defineApiConfig = <T extends ApiConfigGroup>(config: T) => config;

const apiConfig = defineApiConfig({
  api: {
    auth: {
      loginGoogle: {
        baseUrl: '/api/auth/login/google',
        method: 'POST',
        headers: baseHeader
      },
      logout: {
        baseUrl: '/api/auth/logout',
        method: 'POST',
        headers: baseHeader
      },
      login: {
        baseUrl: '/api/auth/login',
        method: 'POST',
        headers: baseHeader
      }
    }
  },
  user: {
    activeVip: {
      baseUrl: `${AppConstants.apiUrl}v1/user/active-vip`,
      method: 'POST',
      headers: baseHeader
    },
    auth: {
      socialLogin: {
        baseUrl: `${AppConstants.apiUrl}v1/user/auth/social-login`,
        method: 'GET',
        headers: baseHeader,
        isRequiredTenantId: true
      },
      webCallback: {
        baseUrl: `${AppConstants.apiUrl}v1/user/auth/web-callback`,
        method: 'POST',
        headers: baseHeader,
        isRequiredTenantId: true
      }
    },
    changePassword: {
      baseUrl: `${AppConstants.apiUrl}v1/user/change-password`,
      method: 'POST',
      headers: baseHeader
    },
    login: {
      baseUrl: `${AppConstants.apiUrl}v1/user/login`,
      method: 'POST',
      headers: baseHeader,
      isRequiredTenantId: true
    },
    getProfile: {
      baseUrl: `${AppConstants.apiUrl}v1/user/profile`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true
    },
    register: {
      baseUrl: `${AppConstants.apiUrl}v1/user/register`,
      method: 'POST',
      headers: baseHeader,
      isRequiredTenantId: true
    },
    updateProfile: {
      baseUrl: `${AppConstants.apiUrl}v1/user/update-profile`,
      method: 'PUT',
      headers: baseHeader,
      isRequiredTenantId: true
    }
  },
  file: {
    upload: {
      baseUrl: `${AppConstants.mediaRootUrl}v1/file/upload`,
      method: 'POST',
      headers: multipartHeader,
      isRequiredTenantId: true,
      isUpload: true,
      permissionCode: 'FILE_U'
    }
  },
  category: {
    getList: {
      baseUrl: `${AppConstants.apiUrl}v1/category/list`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      ignoreAuth: true
    }
  },
  imageProxy: {
    baseUrl: '/api/image-proxy?url='
  },
  person: {
    getList: {
      baseUrl: `${AppConstants.apiUrl}v1/person/list`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      ignoreAuth: true
    },
    getById: {
      baseUrl: `${AppConstants.apiUrl}v1/person/get/:id`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      ignoreAuth: true
    }
  },
  movie: {
    getList: {
      baseUrl: `${AppConstants.apiUrl}v1/movie/list`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      ignoreAuth: true
    },
    getBySlug: {
      baseUrl: `${AppConstants.apiUrl}v1/movie/get/slug/:slug`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      ignoreAuth: true
    }
  },
  moviePerson: {
    getList: {
      baseUrl: `${AppConstants.apiUrl}v1/movie-person/list`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      ignoreAuth: true
    }
  },
  movieItem: {
    getList: {
      baseUrl: `${AppConstants.apiUrl}v1/movie-item/list`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      ignoreAuth: true
    }
  }
});

export default apiConfig;
