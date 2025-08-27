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
  person: '/person',
  country: '/country',
  schedule: '/schedule',
  movie: '/movie',
  movieType: {
    single: '/movie/single',
    series: '/movie/series'
  },
  topic: '/topic',
  watch: '/watch'
});

export default route;
