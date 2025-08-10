const defineRoute = <T>(routes: T): T => routes;

const route = defineRoute({
  home: '/',
  user: {
    favorite: '/user/favorite',
    notification: '/user/notification',
    playlist: '/user/playlist',
    profile: '/user/profile',
    watchHistory: '/user/watch-history'
  },
  category: '/category',
  actor: '/actor',
  country: '/country',
  schedule: '/schedule',
  movie: {
    type: {
      single: '/movie/single',
      series: '/movie/series'
    }
  }
});

export default route;
