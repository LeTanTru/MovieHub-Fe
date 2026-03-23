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
      baseUrl: `${AppConstants.authApiUrl}/v1/user/active-vip`,
      method: 'POST',
      headers: baseHeader,
      isRequiredXClientType: true
    },
    auth: {
      socialLogin: {
        baseUrl: `${AppConstants.authApiUrl}/v1/user/auth/social-login`,
        method: 'GET',
        headers: baseHeader,
        isRequiredXClientType: true
      },
      webCallback: {
        baseUrl: `${AppConstants.authApiUrl}/v1/user/auth/web-callback`,
        method: 'POST',
        headers: baseHeader,
        isRequiredXClientType: true
      }
    },
    changePassword: {
      baseUrl: `${AppConstants.authApiUrl}/v1/user/change-password`,
      method: 'PUT',
      headers: baseHeader,
      isRequiredXClientType: true
    },
    forgotPassword: {
      baseUrl: `${AppConstants.authApiUrl}/v1/user/forgot-password`,
      method: 'POST',
      headers: baseHeader,
      isRequiredXClientType: true
    },
    login: {
      baseUrl: `${AppConstants.authApiUrl}/v1/user/login`,
      method: 'POST',
      headers: baseHeader,
      isRequiredXClientType: true
    },
    getProfile: {
      baseUrl: `${AppConstants.authApiUrl}/v1/user/profile`,
      method: 'GET',
      headers: baseHeader,
      isRequiredXClientType: true
    },
    register: {
      baseUrl: `${AppConstants.authApiUrl}/v1/user/register`,
      method: 'POST',
      headers: baseHeader,
      isRequiredXClientType: true
    },
    requestForgotPassword: {
      baseUrl: `${AppConstants.authApiUrl}/v1/user/request-forgot-password`,
      method: 'POST',
      headers: baseHeader,
      isRequiredXClientType: true
    },
    resendOtp: {
      baseUrl: `${AppConstants.authApiUrl}/v1/user/resend-otp`,
      method: 'POST',
      headers: baseHeader,
      isRequiredXClientType: true
    },
    updateProfile: {
      baseUrl: `${AppConstants.authApiUrl}/v1/user/update-profile`,
      method: 'PUT',
      headers: baseHeader,
      isRequiredXClientType: true
    },
    verifyOtp: {
      baseUrl: `${AppConstants.authApiUrl}/v1/user/verify-otp`,
      method: 'POST',
      headers: baseHeader,
      isRequiredXClientType: true
    },
    refreshToken: {
      baseUrl: `${AppConstants.authApiUrl}/api/token`,
      method: 'POST',
      headers: baseHeader,
      isRequiredXClientType: true
    },
    logout: {
      baseUrl: `${AppConstants.authApiUrl}/v1/auth/logout`,
      method: 'POST',
      headers: baseHeader,
      isRequiredXClientType: true
    },
    getAnonymousToken: {
      baseUrl: `${AppConstants.authApiUrl}/v1/auth/get-anonymous-token`,
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
      isUpload: true,
      permissionCode: 'FILE_U'
    },
    delete: {
      baseUrl: `${AppConstants.mediaUrl}/v1/file/delete-file`,
      method: 'POST',
      headers: baseHeader,
      permissionCode: 'FILE_U_D'
    }
  },
  category: {
    getList: {
      baseUrl: `${AppConstants.apiUrl}/v1/category/list`,
      method: 'GET',
      headers: baseHeader,
      ignoreAuth: true,
      isRequiredXClientType: true
    },
    getById: {
      baseUrl: `${AppConstants.apiUrl}/v1/category/get/:id`,
      method: 'GET',
      headers: baseHeader,
      ignoreAuth: true,
      isRequiredXClientType: true
    }
  },
  person: {
    getList: {
      baseUrl: `${AppConstants.apiUrl}/v1/person/list`,
      method: 'GET',
      headers: baseHeader,
      ignoreAuth: true,
      isRequiredXClientType: true
    },
    getById: {
      baseUrl: `${AppConstants.apiUrl}/v1/person/get/:id`,
      method: 'GET',
      headers: baseHeader,
      ignoreAuth: true,
      isRequiredXClientType: true
    }
  },
  movie: {
    getList: {
      baseUrl: `${AppConstants.apiUrl}/v1/movie/list`,
      method: 'GET',
      headers: baseHeader,
      ignoreAuth: true,
      isRequiredXClientType: true
    },
    getById: {
      baseUrl: `${AppConstants.apiUrl}/v1/movie/get/:id`,
      method: 'GET',
      headers: baseHeader,
      ignoreAuth: true,
      isRequiredXClientType: true
    },
    getSuggestionList: {
      baseUrl: `${AppConstants.apiUrl}/v1/movie/suggestion/:id`,
      method: 'GET',
      headers: baseHeader,
      ignoreAuth: true,
      isRequiredXClientType: true
    },
    getHistoryList: {
      baseUrl: `${AppConstants.apiUrl}/v1/movie/history`,
      method: 'GET',
      headers: baseHeader,
      isRequiredXClientType: true
    },
    getTopViewList: {
      baseUrl: `${AppConstants.apiUrl}/v1/movie/top-views`,
      method: 'GET',
      headers: baseHeader,
      ignoreAuth: true,
      isRequiredXClientType: true
    },
    getScheduleList: {
      baseUrl: `${AppConstants.apiUrl}/v1/movie/schedule`,
      method: 'GET',
      headers: baseHeader,
      isRequiredXClientType: true
    }
  },
  moviePerson: {
    getList: {
      baseUrl: `${AppConstants.apiUrl}/v1/movie-person/list`,
      method: 'GET',
      headers: baseHeader,
      ignoreAuth: true,
      isRequiredXClientType: true
    }
  },
  movieItem: {
    getList: {
      baseUrl: `${AppConstants.apiUrl}/v1/movie-item/list`,
      method: 'GET',
      headers: baseHeader,
      ignoreAuth: true,
      isRequiredXClientType: true
    }
  },
  collection: {
    getTopicList: {
      baseUrl: `${AppConstants.apiUrl}/v1/collection/topics`,
      method: 'GET',
      headers: baseHeader,
      ignoreAuth: true,
      isRequiredXClientType: true
    },
    getById: {
      baseUrl: `${AppConstants.apiUrl}/v1/collection/get/:id`,
      method: 'GET',
      headers: baseHeader,
      ignoreAuth: true,
      isRequiredXClientType: true
    },
    getList: {
      baseUrl: `${AppConstants.apiUrl}/v1/collection/list`,
      method: 'GET',
      headers: baseHeader,
      ignoreAuth: true,
      isRequiredXClientType: true
    }
  },
  collectionItem: {
    getList: {
      baseUrl: `${AppConstants.apiUrl}/v1/collection-item/list`,
      method: 'GET',
      headers: baseHeader,
      ignoreAuth: true,
      isRequiredXClientType: true
    }
  },
  comment: {
    getList: {
      baseUrl: `${AppConstants.apiUrl}/v1/comment/list`,
      method: 'GET',
      headers: baseHeader,
      ignoreAuth: true,
      isRequiredXClientType: true
    },
    create: {
      baseUrl: `${AppConstants.apiUrl}/v1/comment/create`,
      method: 'POST',
      headers: baseHeader,
      isRequiredXClientType: true
    },
    delete: {
      baseUrl: `${AppConstants.apiUrl}/v1/comment/delete/:id`,
      method: 'DELETE',
      headers: baseHeader,
      isRequiredXClientType: true
    },
    update: {
      baseUrl: `${AppConstants.apiUrl}/v1/comment/update`,
      method: 'PUT',
      headers: baseHeader,
      isRequiredXClientType: true
    },
    vote: {
      baseUrl: `${AppConstants.apiUrl}/v1/comment/vote`,
      method: 'PUT',
      headers: baseHeader,
      isRequiredXClientType: true
    },
    getVoteList: {
      baseUrl: `${AppConstants.apiUrl}/v1/comment/vote-list/:movieId`,
      method: 'GET',
      headers: baseHeader,
      isRequiredXClientType: true
    }
  },
  review: {
    checkMovie: {
      baseUrl: `${AppConstants.apiUrl}/v1/review/check/:movieId`,
      method: 'GET',
      headers: baseHeader,
      isRequiredXClientType: true
    },
    create: {
      baseUrl: `${AppConstants.apiUrl}/v1/review/create`,
      method: 'POST',
      headers: baseHeader,
      isRequiredXClientType: true
    },
    delete: {
      baseUrl: `${AppConstants.apiUrl}/v1/review/delete/:id`,
      method: 'DELETE',
      headers: baseHeader,
      isRequiredXClientType: true
    },
    getList: {
      baseUrl: `${AppConstants.apiUrl}/v1/review/list`,
      method: 'GET',
      headers: baseHeader,
      ignoreAuth: true,
      isRequiredXClientType: true
    },
    update: {
      baseUrl: `${AppConstants.apiUrl}/v1/review/update/:id`,
      method: 'PATCH',
      headers: baseHeader,
      isRequiredXClientType: true
    },
    vote: {
      baseUrl: `${AppConstants.apiUrl}/v1/review/vote`,
      method: 'PATCH',
      headers: baseHeader,
      isRequiredXClientType: true
    },
    getVoteList: {
      baseUrl: `${AppConstants.apiUrl}/v1/review/vote-list/:movieId`,
      method: 'GET',
      headers: baseHeader,
      isRequiredXClientType: true
    }
  },
  favourite: {
    create: {
      baseUrl: `${AppConstants.apiUrl}/v1/favourite/create`,
      method: 'POST',
      headers: baseHeader,
      isRequiredXClientType: true
    },
    delete: {
      baseUrl: `${AppConstants.apiUrl}/v1/favourite/delete`,
      method: 'DELETE',
      headers: baseHeader,
      isRequiredXClientType: true
    },
    get: {
      baseUrl: `${AppConstants.apiUrl}/v1/favourite/get`,
      method: 'GET',
      headers: baseHeader,
      isRequiredXClientType: true
    },
    getList: {
      baseUrl: `${AppConstants.apiUrl}/v1/favourite/list`,
      method: 'GET',
      headers: baseHeader,
      isRequiredXClientType: true
    },
    getListIds: {
      baseUrl: `${AppConstants.apiUrl}/v1/favourite/get-list-ids`,
      method: 'GET',
      headers: baseHeader,
      isRequiredXClientType: true
    }
  },
  playlist: {
    getListMovies: {
      baseUrl: `${AppConstants.apiUrl}/v1/playlist/:id/movies`,
      method: 'GET',
      headers: baseHeader,
      isRequiredXClientType: true
    },
    create: {
      baseUrl: `${AppConstants.apiUrl}/v1/playlist/create`,
      method: 'POST',
      headers: baseHeader,
      isRequiredXClientType: true
    },
    delete: {
      baseUrl: `${AppConstants.apiUrl}/v1/playlist/delete/:id`,
      method: 'DELETE',
      headers: baseHeader,
      isRequiredXClientType: true
    },
    getById: {
      baseUrl: `${AppConstants.apiUrl}/v1/playlist/get/:id`,
      method: 'GET',
      headers: baseHeader,
      isRequiredXClientType: true
    },
    getList: {
      baseUrl: `${AppConstants.apiUrl}/v1/playlist/list`,
      method: 'GET',
      headers: baseHeader,
      isRequiredXClientType: true
    },
    getListByMovie: {
      baseUrl: `${AppConstants.apiUrl}/v1/playlist/list-by-movie/:movieId`,
      method: 'GET',
      headers: baseHeader,
      isRequiredXClientType: true
    },
    removeItem: {
      baseUrl: `${AppConstants.apiUrl}/v1/playlist/remove-item`,
      method: 'DELETE',
      headers: baseHeader,
      isRequiredXClientType: true
    },
    update: {
      baseUrl: `${AppConstants.apiUrl}/v1/playlist/update`,
      method: 'PUT',
      headers: baseHeader,
      isRequiredXClientType: true
    },
    updateItem: {
      baseUrl: `${AppConstants.apiUrl}/v1/playlist/update-item`,
      method: 'POST',
      headers: baseHeader,
      isRequiredXClientType: true
    }
  },
  watchHistory: {
    getList: {
      baseUrl: `${AppConstants.apiUrl}/v1/watch-history/list`,
      method: 'GET',
      headers: baseHeader,
      isRequiredXClientType: true
    },
    tracking: {
      baseUrl: `${AppConstants.apiUrl}/v1/watch-history/tracking`,
      method: 'POST',
      headers: baseHeader,
      isRequiredXClientType: true
    },
    delete: {
      baseUrl: `${AppConstants.apiUrl}/v1/watch-history/delete/:movieId`,
      method: 'DELETE',
      headers: baseHeader,
      isRequiredXClientType: true
    }
  },
  sidebar: {
    getList: {
      baseUrl: `${AppConstants.apiUrl}/v1/sidebar/list`,
      method: 'GET',
      headers: baseHeader,
      ignoreAuth: true,
      isRequiredXClientType: true
    }
  }
});

export default apiConfig;
