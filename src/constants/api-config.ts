import AppConstants from '@/constants/app';

const baseHeader = { 'Content-Type': 'application/json' };
const multipartHeader = { 'Content-Type': 'multipart/form-data' };

const apiConfig: any = {
  user: {
    activeVip: {
      baseUrl: `${AppConstants.apiUrl}v1/user/active-vip`,
      method: 'POST',
      header: baseHeader
    },
    auth: {
      socialLogin: {
        baseUrl: `${AppConstants.apiUrl}v1/user/auth/social-login`,
        method: 'POST',
        header: baseHeader
      },
      webCallback: {
        baseUrl: `${AppConstants.apiUrl}v1/user/auth/web-callback`,
        method: 'POST',
        header: baseHeader
      }
    },
    changePassword: {
      baseUrl: `${AppConstants.apiUrl}v1/user/change-password`,
      method: 'POST',
      header: baseHeader
    },
    login: {
      baseUrl: `${AppConstants.apiUrl}v1/user/login`,
      method: 'POST',
      header: baseHeader
    },
    getProfile: {
      baseUrl: `${AppConstants.apiUrl}v1/user/profile`,
      method: 'GET',
      header: baseHeader
    },
    register: {
      baseUrl: `${AppConstants.apiUrl}v1/user/register`,
      method: 'POST',
      header: baseHeader
    },
    updateProfile: {
      baseUrl: `${AppConstants.apiUrl}v1/user/profile`,
      method: 'PUT',
      header: baseHeader
    }
  },
  file: {
    upload: {
      path: `${AppConstants.mediaRootUrl}v1/file/upload`,
      method: 'POST',
      headers: multipartHeader,
      isRequiredTenantId: true,
      isUpload: true,
      permissionCode: 'FILE_U'
    }
  }
};

export default apiConfig;
