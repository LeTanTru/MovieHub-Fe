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
        headers: baseHeader,
        ignoreAuth: true
      },
      logout: {
        baseUrl: '/api/auth/logout',
        method: 'POST',
        headers: baseHeader,
        ignoreAuth: true
      },
      login: {
        baseUrl: '/api/auth/login',
        method: 'POST',
        headers: baseHeader,
        ignoreAuth: true
      },
      refreshToken: {
        baseUrl: '/api/auth/refresh-token',
        method: 'POST',
        headers: baseHeader,
        ignoreAuth: true
      }
    }
  },
  user: {
    activeVip: {
      baseUrl: `${AppConstants.apiUrl}/v1/user/active-vip`,
      method: 'POST',
      headers: baseHeader,
      isRequiredXClientType: true
    },
    auth: {
      socialLogin: {
        baseUrl: `${AppConstants.apiUrl}/v1/user/auth/social-login`,
        method: 'GET',
        headers: baseHeader,
        isRequiredTenantId: true,
        isRequiredXClientType: true
      },
      webCallback: {
        baseUrl: `${AppConstants.apiUrl}/v1/user/auth/web-callback`,
        method: 'POST',
        headers: baseHeader,
        isRequiredTenantId: true,
        isRequiredXClientType: true
      }
    },
    changePassword: {
      baseUrl: `${AppConstants.apiUrl}/v1/user/change-password`,
      method: 'PUT',
      headers: baseHeader,
      isRequiredTenantId: true,
      isRequiredXClientType: true
    },
    forgotPassword: {
      baseUrl: `${AppConstants.apiUrl}/v1/user/forgot-password`,
      method: 'POST',
      headers: baseHeader,
      isRequiredTenantId: true,
      isRequiredXClientType: true
    },
    login: {
      baseUrl: `${AppConstants.apiUrl}/v1/user/login`,
      method: 'POST',
      headers: baseHeader,
      isRequiredTenantId: true,
      isRequiredXClientType: true
    },
    getProfile: {
      baseUrl: `${AppConstants.apiUrl}/v1/user/profile`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      isRequiredXClientType: true
    },
    register: {
      baseUrl: `${AppConstants.apiUrl}/v1/user/register`,
      method: 'POST',
      headers: baseHeader,
      isRequiredTenantId: true,
      isRequiredXClientType: true
    },
    requestForgotPassword: {
      baseUrl: `${AppConstants.apiUrl}/v1/user/request-forgot-password`,
      method: 'POST',
      headers: baseHeader,
      isRequiredTenantId: true,
      isRequiredXClientType: true
    },
    resendOtp: {
      baseUrl: `${AppConstants.apiUrl}/v1/user/resend-otp`,
      method: 'POST',
      headers: baseHeader,
      isRequiredTenantId: true,
      isRequiredXClientType: true
    },
    updateProfile: {
      baseUrl: `${AppConstants.apiUrl}/v1/user/update-profile`,
      method: 'PUT',
      headers: baseHeader,
      isRequiredTenantId: true,
      isRequiredXClientType: true
    },
    verifyOtp: {
      baseUrl: `${AppConstants.apiUrl}/v1/user/verify-otp`,
      method: 'POST',
      headers: baseHeader,
      isRequiredTenantId: true,
      isRequiredXClientType: true
    },
    refreshToken: {
      baseUrl: `${AppConstants.metaApiUrl}/api/token`,
      method: 'POST',
      headers: baseHeader,
      isRequiredTenantId: true,
      isRequiredXClientType: true
    },
    logout: {
      baseUrl: `${AppConstants.metaApiUrl}/v1/auth/logout`,
      method: 'POST',
      headers: baseHeader,
      isRequiredXClientType: true
    },
    getAnonymousToken: {
      baseUrl: `${AppConstants.metaApiUrl}/v1/auth/get-anonymous-token`,
      method: 'POST',
      headers: baseHeader,
      ignoreAuth: true,
      isRequiredXClientType: true
    }
  },
  file: {
    upload: {
      baseUrl: `${AppConstants.mediaUrl}/v1/file/upload`,
      method: 'POST',
      headers: multipartHeader,
      isRequiredTenantId: true,
      isUpload: true,
      permissionCode: 'FILE_U',
      isRequiredXClientType: true
    },
    delete: {
      baseUrl: `${AppConstants.mediaUrl}/v1/file/delete-file`,
      method: 'POST',
      headers: baseHeader,
      permissionCode: 'FILE_U_D',
      isRequiredTenantId: true,
      isRequiredXClientType: true
    }
  },
  category: {
    getList: {
      baseUrl: `${AppConstants.apiUrl}/v1/category/list`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      ignoreAuth: true,
      isRequiredXClientType: true
    },
    getById: {
      baseUrl: `${AppConstants.apiUrl}/v1/category/get/:id`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      ignoreAuth: true,
      isRequiredXClientType: true
    }
  },
  person: {
    getList: {
      baseUrl: `${AppConstants.apiUrl}/v1/person/list`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      ignoreAuth: true,
      isRequiredXClientType: true
    },
    getById: {
      baseUrl: `${AppConstants.apiUrl}/v1/person/get/:id`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      ignoreAuth: true,
      isRequiredXClientType: true
    }
  },
  movie: {
    getList: {
      baseUrl: `${AppConstants.apiUrl}/v1/movie/list`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      ignoreAuth: true,
      isRequiredXClientType: true
    },
    getById: {
      baseUrl: `${AppConstants.apiUrl}/v1/movie/get/:id`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      ignoreAuth: true,
      isRequiredXClientType: true
    },
    getSuggestionList: {
      baseUrl: `${AppConstants.apiUrl}/v1/movie/suggestion/:id`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      ignoreAuth: true,
      isRequiredXClientType: true
    },
    getHistoryList: {
      baseUrl: `${AppConstants.apiUrl}/v1/movie/history`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      isRequiredXClientType: true
    },
    getTopViewList: {
      baseUrl: `${AppConstants.apiUrl}/v1/movie/top-views`,
      method: 'GET',
      headers: baseHeader,
      ignoreAuth: true,
      isRequiredTenantId: true,
      isRequiredXClientType: true
    },
    getScheduleList: {
      baseUrl: `${AppConstants.apiUrl}/v1/movie/schedule`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      isRequiredXClientType: true
    }
  },
  moviePerson: {
    getList: {
      baseUrl: `${AppConstants.apiUrl}/v1/movie-person/list`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      ignoreAuth: true,
      isRequiredXClientType: true
    }
  },
  movieItem: {
    getList: {
      baseUrl: `${AppConstants.apiUrl}/v1/movie-item/list`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      ignoreAuth: true,
      isRequiredXClientType: true
    }
  },
  collection: {
    getTopicList: {
      baseUrl: `${AppConstants.apiUrl}/v1/collection/topics`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      ignoreAuth: true,
      isRequiredXClientType: true
    },
    getById: {
      baseUrl: `${AppConstants.apiUrl}/v1/collection/get/:id`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      ignoreAuth: true,
      isRequiredXClientType: true
    },
    getList: {
      baseUrl: `${AppConstants.apiUrl}/v1/collection/list`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      ignoreAuth: true,
      isRequiredXClientType: true
    }
  },
  collectionItem: {
    getList: {
      baseUrl: `${AppConstants.apiUrl}/v1/collection-item/list`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      ignoreAuth: true,
      isRequiredXClientType: true
    }
  },
  comment: {
    getList: {
      baseUrl: `${AppConstants.apiUrl}/v1/comment/list`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      ignoreAuth: true,
      isRequiredXClientType: true
    },
    create: {
      baseUrl: `${AppConstants.apiUrl}/v1/comment/create`,
      method: 'POST',
      headers: baseHeader,
      isRequiredTenantId: true,
      isRequiredXClientType: true
    },
    delete: {
      baseUrl: `${AppConstants.apiUrl}/v1/comment/delete/:id`,
      method: 'DELETE',
      headers: baseHeader,
      isRequiredTenantId: true,
      isRequiredXClientType: true
    },
    update: {
      baseUrl: `${AppConstants.apiUrl}/v1/comment/update`,
      method: 'PUT',
      headers: baseHeader,
      isRequiredTenantId: true,
      isRequiredXClientType: true
    },
    vote: {
      baseUrl: `${AppConstants.apiUrl}/v1/comment/vote`,
      method: 'PUT',
      headers: baseHeader,
      isRequiredTenantId: true,
      isRequiredXClientType: true
    },
    getVoteList: {
      baseUrl: `${AppConstants.apiUrl}/v1/comment/vote-list/:movieId`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      isRequiredXClientType: true
    }
  },
  review: {
    checkMovie: {
      baseUrl: `${AppConstants.apiUrl}/v1/review/check/:movieId`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      isRequiredXClientType: true
    },
    create: {
      baseUrl: `${AppConstants.apiUrl}/v1/review/create`,
      method: 'POST',
      headers: baseHeader,
      isRequiredTenantId: true,
      isRequiredXClientType: true
    },
    delete: {
      baseUrl: `${AppConstants.apiUrl}/v1/review/delete/:id`,
      method: 'DELETE',
      headers: baseHeader,
      isRequiredTenantId: true,
      isRequiredXClientType: true
    },
    getList: {
      baseUrl: `${AppConstants.apiUrl}/v1/review/list`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      ignoreAuth: true,
      isRequiredXClientType: true
    },
    update: {
      baseUrl: `${AppConstants.apiUrl}/v1/review/update/:id`,
      method: 'PATCH',
      headers: baseHeader,
      isRequiredTenantId: true,
      isRequiredXClientType: true
    },
    vote: {
      baseUrl: `${AppConstants.apiUrl}/v1/review/vote`,
      method: 'PATCH',
      headers: baseHeader,
      isRequiredTenantId: true,
      isRequiredXClientType: true
    },
    getVoteList: {
      baseUrl: `${AppConstants.apiUrl}/v1/review/vote-list/:movieId`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      isRequiredXClientType: true
    }
  },
  favourite: {
    create: {
      baseUrl: `${AppConstants.apiUrl}/v1/favourite/create`,
      method: 'POST',
      headers: baseHeader,
      isRequiredTenantId: true,
      isRequiredXClientType: true
    },
    delete: {
      baseUrl: `${AppConstants.apiUrl}/v1/favourite/delete`,
      method: 'DELETE',
      headers: baseHeader,
      isRequiredTenantId: true,
      isRequiredXClientType: true
    },
    get: {
      baseUrl: `${AppConstants.apiUrl}/v1/favourite/get`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      isRequiredXClientType: true
    },
    getList: {
      baseUrl: `${AppConstants.apiUrl}/v1/favourite/list`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      isRequiredXClientType: true
    },
    getListIds: {
      baseUrl: `${AppConstants.apiUrl}/v1/favourite/get-list-ids`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      isRequiredXClientType: true
    }
  },
  playlist: {
    getListMovies: {
      baseUrl: `${AppConstants.apiUrl}/v1/playlist/:id/movies`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      isRequiredXClientType: true
    },
    create: {
      baseUrl: `${AppConstants.apiUrl}/v1/playlist/create`,
      method: 'POST',
      headers: baseHeader,
      isRequiredTenantId: true,
      isRequiredXClientType: true
    },
    delete: {
      baseUrl: `${AppConstants.apiUrl}/v1/playlist/delete/:id`,
      method: 'DELETE',
      headers: baseHeader,
      isRequiredTenantId: true,
      isRequiredXClientType: true
    },
    getById: {
      baseUrl: `${AppConstants.apiUrl}/v1/playlist/get/:id`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      isRequiredXClientType: true
    },
    getList: {
      baseUrl: `${AppConstants.apiUrl}/v1/playlist/list`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      isRequiredXClientType: true
    },
    getListByMovie: {
      baseUrl: `${AppConstants.apiUrl}/v1/playlist/list-by-movie/:movieId`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      isRequiredXClientType: true
    },
    removeItem: {
      baseUrl: `${AppConstants.apiUrl}/v1/playlist/remove-item`,
      method: 'DELETE',
      headers: baseHeader,
      isRequiredTenantId: true,
      isRequiredXClientType: true
    },
    update: {
      baseUrl: `${AppConstants.apiUrl}/v1/playlist/update`,
      method: 'PUT',
      headers: baseHeader,
      isRequiredTenantId: true,
      isRequiredXClientType: true
    },
    updateItem: {
      baseUrl: `${AppConstants.apiUrl}/v1/playlist/update-item`,
      method: 'POST',
      headers: baseHeader,
      isRequiredTenantId: true,
      isRequiredXClientType: true
    }
  },
  watchHistory: {
    getList: {
      baseUrl: `${AppConstants.apiUrl}/v1/watch-history/list`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      isRequiredXClientType: true
    },
    tracking: {
      baseUrl: `${AppConstants.apiUrl}/v1/watch-history/tracking`,
      method: 'POST',
      headers: baseHeader,
      isRequiredTenantId: true,
      isRequiredXClientType: true
    },
    delete: {
      baseUrl: `${AppConstants.apiUrl}/v1/watch-history/delete/:movieId`,
      method: 'DELETE',
      headers: baseHeader,
      isRequiredTenantId: true,
      isRequiredXClientType: true
    }
  },
  sidebar: {
    getList: {
      baseUrl: `${AppConstants.apiUrl}/v1/sidebar/list`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      ignoreAuth: true,
      isRequiredXClientType: true
    }
  }
});

export default apiConfig;
