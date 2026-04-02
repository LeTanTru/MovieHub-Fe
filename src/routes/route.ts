type RouteItem = {
  path?: string;
  auth?: boolean;
  permissionCode?: string[];
  [key: string]: RouteItem | string[] | boolean | string | number | undefined;
};

type RouteConfig = Record<string, RouteItem>;

const defineRoute = <T extends RouteConfig>(routes: T): T => routes;

const route = defineRoute({
  home: {
    path: '/'
  },
  user: {
    favourite: {
      path: '/user/favourite'
    },
    notification: {
      path: '/user/notification'
    },
    playlist: {
      path: '/user/playlist'
    },
    watchHistory: {
      path: '/user/watch-history'
    },
    settings: {
      path: '/user/settings'
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
    path: '/register'
  },
  forgotPassword: {
    path: '/forgot-password'
  },
  verifyOtp: {
    path: 'verify-otp'
  },
  search: {
    path: '/search'
  },
  account: {
    profile: {
      path: '/account/profile'
    },
    changePassword: {
      path: '/account/change-password'
    }
  }
});

export default route;
