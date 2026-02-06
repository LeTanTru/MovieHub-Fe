export type RouteItem = {
  path?: string;
  auth?: boolean;
  permissionCode?: string[];
  [key: string]: RouteItem | string[] | boolean | string | number | undefined;
};

export type RouteConfig = Record<string, RouteItem>;

const defineRoute = <T extends RouteConfig>(routes: T): T => routes;

const route = defineRoute({
  home: {
    path: '/'
  },
  user: {
    favorite: {
      path: '/user/favorite'
    },
    notification: {
      path: '/user/notification'
    },
    playlist: {
      path: '/user/playlist'
    },
    profile: {
      path: '/account/profile'
    },
    watchHistory: {
      path: '/user/watch-history'
    },
    changePassword: {
      path: '/account/change-password'
    }
  },
  category: {
    path: '/category'
  },
  person: {
    path: '/person'
  },
  country: {
    path: '/country'
  },
  schedule: {
    path: '/schedule'
  },
  movie: {
    path: '/movie'
  },
  movieType: {
    single: {
      path: '/movie/single'
    },
    series: {
      path: '/movie/series'
    }
  },
  topic: {
    path: '/topic'
  },
  watch: {
    path: '/watch'
  },
  login: {
    path: '/login'
  },
  register: {
    path: 'register'
  },
  forgotPassword: {
    path: 'forgot-password'
  },
  verifyOtp: {
    path: 'verify-otp'
  }
});

export default route;
