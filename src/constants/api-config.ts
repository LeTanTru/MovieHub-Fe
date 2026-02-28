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
      headers: baseHeader
    },
    auth: {
      socialLogin: {
        baseUrl: `${AppConstants.apiUrl}/v1/user/auth/social-login`,
        method: 'GET',
        headers: baseHeader,
        isRequiredTenantId: true
      },
      webCallback: {
        baseUrl: `${AppConstants.apiUrl}/v1/user/auth/web-callback`,
        method: 'POST',
        headers: baseHeader,
        isRequiredTenantId: true
      }
    },
    changePassword: {
      baseUrl: `${AppConstants.apiUrl}/v1/user/change-password`,
      method: 'PUT',
      headers: baseHeader,
      isRequiredTenantId: true
    },
    forgotPassword: {
      baseUrl: `${AppConstants.apiUrl}/v1/user/forgot-password`,
      method: 'POST',
      headers: baseHeader,
      isRequiredTenantId: true
    },
    login: {
      baseUrl: `${AppConstants.apiUrl}/v1/user/login`,
      method: 'POST',
      headers: baseHeader,
      isRequiredTenantId: true
    },
    getProfile: {
      baseUrl: `${AppConstants.apiUrl}/v1/user/profile`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true
    },
    register: {
      baseUrl: `${AppConstants.apiUrl}/v1/user/register`,
      method: 'POST',
      headers: baseHeader,
      isRequiredTenantId: true
    },
    requestForgotPassword: {
      baseUrl: `${AppConstants.apiUrl}/v1/user/request-forgot-password`,
      method: 'POST',
      headers: baseHeader,
      isRequiredTenantId: true
    },
    resendOtp: {
      baseUrl: `${AppConstants.apiUrl}/v1/user/resend-otp`,
      method: 'POST',
      headers: baseHeader,
      isRequiredTenantId: true
    },
    updateProfile: {
      baseUrl: `${AppConstants.apiUrl}/v1/user/update-profile`,
      method: 'PUT',
      headers: baseHeader,
      isRequiredTenantId: true
    },
    verifyOtp: {
      baseUrl: `${AppConstants.apiUrl}/v1/user/verify-otp`,
      method: 'POST',
      headers: baseHeader,
      isRequiredTenantId: true
    },
    refreshToken: {
      baseUrl: `${AppConstants.metaApiUrl}/api/token`,
      method: 'POST',
      headers: baseHeader,
      isRequiredTenantId: true
    },
    logout: {
      baseUrl: `${AppConstants.metaApiUrl}/v1/auth/logout`,
      method: 'POST',
      headers: baseHeader
    },
    getAnonymousToken: {
      baseUrl: `${AppConstants.metaApiUrl}/v1/auth/get-anonymous-token`,
      method: 'POST',
      headers: baseHeader,
      ignoreAuth: true
    }
  },
  file: {
    upload: {
      baseUrl: `${AppConstants.mediaUrl}/v1/file/upload`,
      method: 'POST',
      headers: multipartHeader,
      isRequiredTenantId: true,
      isUpload: true,
      permissionCode: 'FILE_U'
    },
    delete: {
      baseUrl: `${AppConstants.mediaUrl}/v1/file/delete-file`,
      method: 'POST',
      headers: baseHeader,
      permissionCode: 'FILE_U_D',
      isRequiredTenantId: true
    }
  },
  category: {
    getList: {
      baseUrl: `${AppConstants.apiUrl}/v1/category/list`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      ignoreAuth: true
    },
    getById: {
      baseUrl: `${AppConstants.apiUrl}/v1/category/get/:id`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      ignoreAuth: true
    }
  },
  person: {
    getList: {
      baseUrl: `${AppConstants.apiUrl}/v1/person/list`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      ignoreAuth: true
    },
    getById: {
      baseUrl: `${AppConstants.apiUrl}/v1/person/get/:id`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      ignoreAuth: true
    }
  },
  movie: {
    getList: {
      baseUrl: `${AppConstants.apiUrl}/v1/movie/list`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      ignoreAuth: true
    },
    getById: {
      baseUrl: `${AppConstants.apiUrl}/v1/movie/get/:id`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      ignoreAuth: true
    },
    getSuggestionList: {
      baseUrl: `${AppConstants.apiUrl}/v1/movie/suggestion/:id`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      ignoreAuth: true
    },
    getHistoryList: {
      baseUrl: `${AppConstants.apiUrl}/v1/movie/history`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true
    },
    getTopViewList: {
      baseUrl: `${AppConstants.apiUrl}/v1/movie/top-views`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true
    },
    getScheduleList: {
      baseUrl: `${AppConstants.apiUrl}/v1/movie/schedule`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true
    }
  },
  moviePerson: {
    getList: {
      baseUrl: `${AppConstants.apiUrl}/v1/movie-person/list`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      ignoreAuth: true
    }
  },
  movieItem: {
    getList: {
      baseUrl: `${AppConstants.apiUrl}/v1/movie-item/list`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      ignoreAuth: true
    }
  },
  collection: {
    getTopicList: {
      baseUrl: `${AppConstants.apiUrl}/v1/collection/topics`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      ignoreAuth: true
    },
    getById: {
      baseUrl: `${AppConstants.apiUrl}/v1/collection/get/:id`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      ignoreAuth: true
    },
    getList: {
      baseUrl: `${AppConstants.apiUrl}/v1/collection/list`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      ignoreAuth: true
    }
  },
  collectionItem: {
    getList: {
      baseUrl: `${AppConstants.apiUrl}/v1/collection-item/list`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      ignoreAuth: true
    }
  },
  comment: {
    getList: {
      baseUrl: `${AppConstants.apiUrl}/v1/comment/list`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      ignoreAuth: true
    },
    create: {
      baseUrl: `${AppConstants.apiUrl}/v1/comment/create`,
      method: 'POST',
      headers: baseHeader,
      isRequiredTenantId: true
    },
    delete: {
      baseUrl: `${AppConstants.apiUrl}/v1/comment/delete/:id`,
      method: 'DELETE',
      headers: baseHeader,
      isRequiredTenantId: true
    },
    update: {
      baseUrl: `${AppConstants.apiUrl}/v1/comment/update`,
      method: 'PUT',
      headers: baseHeader,
      isRequiredTenantId: true
    },
    vote: {
      baseUrl: `${AppConstants.apiUrl}/v1/comment/vote`,
      method: 'PUT',
      headers: baseHeader,
      isRequiredTenantId: true
    },
    getVoteList: {
      baseUrl: `${AppConstants.apiUrl}/v1/comment/vote-list/:movieId`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true
    }
  },
  review: {
    checkMovie: {
      baseUrl: `${AppConstants.apiUrl}/v1/review/check/:movieId`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true
    },
    create: {
      baseUrl: `${AppConstants.apiUrl}/v1/review/create`,
      method: 'POST',
      headers: baseHeader,
      isRequiredTenantId: true
    },
    delete: {
      baseUrl: `${AppConstants.apiUrl}/v1/review/delete/:id`,
      method: 'DELETE',
      headers: baseHeader,
      isRequiredTenantId: true
    },
    getList: {
      baseUrl: `${AppConstants.apiUrl}/v1/review/list`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      ignoreAuth: true
    },
    update: {
      baseUrl: `${AppConstants.apiUrl}/v1/review/update/:id`,
      method: 'PATCH',
      headers: baseHeader,
      isRequiredTenantId: true
    },
    vote: {
      baseUrl: `${AppConstants.apiUrl}/v1/review/vote`,
      method: 'PATCH',
      headers: baseHeader,
      isRequiredTenantId: true
    },
    getVoteList: {
      baseUrl: `${AppConstants.apiUrl}/v1/review/vote-list/:movieId`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true
    }
  },
  favourite: {
    create: {
      baseUrl: `${AppConstants.apiUrl}/v1/favourite/create`,
      method: 'POST',
      headers: baseHeader,
      isRequiredTenantId: true
    },
    delete: {
      baseUrl: `${AppConstants.apiUrl}/v1/favourite/delete`,
      method: 'DELETE',
      headers: baseHeader,
      isRequiredTenantId: true
    },
    get: {
      baseUrl: `${AppConstants.apiUrl}/v1/favourite/get`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true
    },
    getList: {
      baseUrl: `${AppConstants.apiUrl}/v1/favourite/list`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true
    },
    getListIds: {
      baseUrl: `${AppConstants.apiUrl}/v1/favourite/get-list-ids`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true
    }
  },
  playlist: {
    getListMovies: {
      baseUrl: `${AppConstants.apiUrl}/v1/playlist/:id/movies`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true
    },
    create: {
      baseUrl: `${AppConstants.apiUrl}/v1/playlist/create`,
      method: 'POST',
      headers: baseHeader,
      isRequiredTenantId: true
    },
    delete: {
      baseUrl: `${AppConstants.apiUrl}/v1/playlist/delete/:id`,
      method: 'DELETE',
      headers: baseHeader,
      isRequiredTenantId: true
    },
    getById: {
      baseUrl: `${AppConstants.apiUrl}/v1/playlist/get/:id`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true
    },
    getList: {
      baseUrl: `${AppConstants.apiUrl}/v1/playlist/list`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true
    },
    getListByMovie: {
      baseUrl: `${AppConstants.apiUrl}/v1/playlist/list-by-movie/:movieId`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true
    },
    removeItem: {
      baseUrl: `${AppConstants.apiUrl}/v1/playlist/remove-item`,
      method: 'DELETE',
      headers: baseHeader,
      isRequiredTenantId: true
    },
    update: {
      baseUrl: `${AppConstants.apiUrl}/v1/playlist/update`,
      method: 'PUT',
      headers: baseHeader,
      isRequiredTenantId: true
    },
    updateItem: {
      baseUrl: `${AppConstants.apiUrl}/v1/playlist/update-item`,
      method: 'POST',
      headers: baseHeader,
      isRequiredTenantId: true
    }
  },
  watchHistory: {
    getList: {
      baseUrl: `${AppConstants.apiUrl}/v1/watch-history/list`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true
    },
    tracking: {
      baseUrl: `${AppConstants.apiUrl}/v1/watch-history/tracking`,
      method: 'POST',
      headers: baseHeader,
      isRequiredTenantId: true
    },
    delete: {
      baseUrl: `${AppConstants.apiUrl}/v1/watch-history/delete/:movieId`,
      method: 'DELETE',
      headers: baseHeader,
      isRequiredTenantId: true
    }
  },
  sidebar: {
    getList: {
      baseUrl: `${AppConstants.apiUrl}/v1/sidebar/list`,
      method: 'GET',
      headers: baseHeader,
      isRequiredTenantId: true,
      ignoreAuth: true
    }
  }
});

export default apiConfig;
