export const accountQueryKeys = {
  PROFILE_UPDATE: 'update-profile',
  PROFILE: 'profile'
};

export const appVersionQueryKeys = {
  APP_VERSION_LATEST: 'app-version-latest'
};

export const authQueryKeys = {
  CHANGE_PASSWORD: 'change-password',
  FORGOT_PASSWORD: 'forgot-password',
  GET_LOGIN_GOOGLE: 'get-login-google',
  LOGIN_GOOGLE: 'login-google',
  LOGIN: 'login',
  LOGOUT: 'logout',
  REGISTER: 'register',
  REQUEST_FORGOT_PASSWORD: 'request-forgot-password',
  RESEND_OTP: 'resend-otp',
  SESSION: 'session',
  VERIFY_OTP: 'verify-otp'
};

export const categoryQueryKeys = {
  CATEGORY_LIST: 'category-list',
  CATEGORY: 'category'
};

export const collectionItemQueryKeys = {
  COLLECTION_ITEM_LIST: 'collection-item-list',
  COLLECTION_ITEM: 'collection-item'
};

export const collectionQueryKeys = {
  COLLECTION_LIST: 'collection-list',
  COLLECTION_TOPIC_LIST: 'collection-topic-list',
  COLLECTION: 'collection'
};

export const commentQueryKeys = {
  COMMENT_LIST: 'comment-list',
  COMMENT_REPLIES_LIST: 'comment-replies-list',
  COMMENT_VOTE_LIST: 'comment-vote-list',
  COMMENT: 'comment',
  CREATE_COMMENT: 'create-comment',
  DELETE_COMMENT: 'delete-comment',
  PIN_COMMENT: 'pin-comment',
  UPDATE_COMMENT: 'update-comment',
  VOTE_COMMENT: 'vote-comment'
};

export const favouriteQueryKeys = {
  CREATE_FAVOURITE: 'create-favourite',
  DELETE_FAVOURITE: 'delete-favourite',
  FAVOURITE_GET_LIST_IDS: 'favourite-get-list-ids',
  FAVOURITE_LIST: 'favourite-list',
  FAVOURITE: 'favourite'
};

export const fileQueryKeys = {
  FILE_DELETE: 'delete-file',
  FILE_UPLOAD_IMAGE: 'upload-image-file',
  FILE: 'file'
};

export const moviePersonQueryKeys = {
  MOVIE_PERSON_LIST: 'movie-person-list',
  MOVIE_PERSON: 'movie-person'
};

export const movieQueryKeys = {
  MOVIE_HISTORY: 'movie-history',
  MOVIE_ITEM_LIST: 'movie-item-list',
  MOVIE_ITEM: 'movie-item',
  MOVIE_LIST_WATCHED: 'movie-list-watched',
  MOVIE_LIST: 'movie-list',
  MOVIE_NEXT_EPISODE: 'movie-next-episode',
  MOVIE_RECOMMENDATION_KNN: 'movie-recommendation-knn',
  MOVIE_RECOMMENDATION_RECENT_WATCHED_CATEGORY:
    'movie-recommendation-recent-watched-category',
  MOVIE_RECOMMENDATION: 'movie-recommendation',
  MOVIE_SCHEDULE_LIST: 'movie-schedule-list',
  MOVIE_SUGGESTION_LIST: 'suggestion-movie-list',
  MOVIE_TOP_VIEW_LIST: 'movie-top-view-list',
  MOVIE: 'movie',
  SUGGEST_BY_WATCHED: 'suggest-by-watched'
};

export const notificationQueryKeys = {
  DELETE_ALL_NOTIFICATION: 'delete-all-notification',
  DELETE_NOTIFICATION: 'delete-notification',
  NOTIFICATION_LIST: 'notification-list',
  READ_ALL_NOTIFICATION: 'read-all-notification',
  UNREAD_NOTIFICATION_COUNT: 'unread-notification-count',
  UPDATE_READ_NOTIFICATION: 'update-read-notification'
};

export const personQueryKeys = {
  PERSON_LIST: 'person-list',
  PERSON: 'person'
};

export const playlistQueryKeys = {
  PLAYLIST_BY_MOVIES: 'playlist-by-movies',
  PLAYLIST_CREATE: 'playlist-create',
  PLAYLIST_DELETE: 'playlist-delete',
  PLAYLIST_ITEM: 'playlist-item',
  PLAYLIST_LIST: 'playlist-list',
  PLAYLIST_MOVIES: 'playlist-movies',
  PLAYLIST: 'playlist',
  REMOVE_PLAYLIST_ITEM: 'remove-playlist-item'
};

export const reviewQueryKeys = {
  CHECK_MOVIE: 'check-movie',
  CREATE_REVIEW: 'create-review',
  DELETE_REVIEW: 'delete-review',
  REVIEW_LIST: 'review-list',
  REVIEW_VOTE_LIST: 'review-vote-list',
  REVIEW: 'review',
  VOTE_REVIEW: 'vote-review'
};

export const roomQueryKeys = {
  CHECK_ROOM: 'check-room',
  ROOM_CREATE: 'room-create',
  ROOM_DELETE: 'room-delete',
  ROOM_END: 'room-end',
  ROOM_JOIN: 'room-join',
  ROOM_LIST: 'room-list',
  ROOM_MY_ROOMS: 'room-my-rooms',
  ROOM_START: 'room-start',
  ROOM: 'room'
};

export const settingsQueryKeys = {
  PUBLIC_SETTING: 'public-setting',
  UPDATE_SETTING: 'update-setting'
};

export const sidebarQueryKeys = {
  SIDEBAR_LIST: 'sidebar-list'
};

export const surveyQueryKeys = {
  MAKE_SURVEY: 'make-survey',
  MOVIE_SURVEY_LIST: 'movie-survey-list'
};

export const userReportQueryKeys = {
  CREATE_USER_REPORT: 'create-user-report'
};

export const videoLibrarySubtitleQueryKeys = {
  VIDEO_LIBRARY_SUBTITLE_LIST: 'video-library-subtitle-list'
};

export const watchHistoryQueryKeys = {
  WATCH_HISTORY_DELETE: 'watch-history-delete',
  WATCH_HISTORY_LIST: 'watch-history-list',
  WATCH_HISTORY_TRACKING: 'watch-history-tracking'
};

export const queryKeys = {
  ...accountQueryKeys,
  ...appVersionQueryKeys,
  ...authQueryKeys,
  ...categoryQueryKeys,
  ...collectionItemQueryKeys,
  ...collectionQueryKeys,
  ...commentQueryKeys,
  ...favouriteQueryKeys,
  ...fileQueryKeys,
  ...moviePersonQueryKeys,
  ...movieQueryKeys,
  ...notificationQueryKeys,
  ...personQueryKeys,
  ...playlistQueryKeys,
  ...reviewQueryKeys,
  ...roomQueryKeys,
  ...settingsQueryKeys,
  ...sidebarQueryKeys,
  ...surveyQueryKeys,
  ...userReportQueryKeys,
  ...videoLibrarySubtitleQueryKeys,
  ...watchHistoryQueryKeys
};
