export const GOOGLE_WEB_LOGIN_TYPE = 1;

export const GENDER_MALE = 1;
export const GENDER_FEMALE = 2;
export const GENDER_OTHER = 3;

export const PERSON_KIND_ACTOR = 1;
export const PERSON_KIND_DIRECTOR = 2;

export const BREAKPOINT_MOBILE = 0;
export const BREAKPOINT_TABLET = 768;
export const BREAKPOINT_DESKTOP = 1280;

export const AGE_RATING_GENERAL = 1; // G - General Audience
export const AGE_RATING_PG = 2; // PG - Parental Guidance
export const AGE_RATING_PG13 = 3; // PG-13 - Not under 13
export const AGE_RATING_R = 4; // R - Restricted (under 17 needs adult)
export const AGE_RATING_NC17 = 5; // NC-17 - No one 17 and under admitted
export const AGE_RATING_18_PLUS = 6; // 18+ - Local classification

export const MOVIE_TYPE_SINGLE = 1;
export const MOVIE_TYPE_SERIES = 2;

export const MOVIE_ITEM_KIND_SEASON = 1;
export const MOVIE_ITEM_KIND_EPISODE = 2;
export const MOVIE_ITEM_KIND_TRAILER = 3;

export const DATE_DAY_TIME_FORMAT = 'EEEE HH:mm:ss dd/MM/yyyy';
export const DATE_FORMAT = 'dd/MM/yyyy';
export const DATE_SHORT = 'dd/MM';
export const DATE_TIME_FORMAT = 'dd/MM/yyyy HH:mm:ss';

export const TIME_DATE_FORMAT = 'HH:mm:ss dd/MM/yyyy';
export const TIME_FORMAT = 'HH:mm:ss';
export const TIME_SHORT = 'HH:mm';

export const DEFAULT_TABLE_PAGE_START = 0;
export const MAX_PAGE_SIZE = 1_000_000;
export const INITIAL_AUTO_COMPLETE_SIZE = 10;
export const NOTIFICATION_PAGE_SIZE = 20;

export const DEFAULT_PAGE_START = 0;
export const DEFAULT_PAGE_SIZE = 24;

export const UPLOAD_AVATAR = 'AVATAR';

export const KIND_ADMIN = 1;
export const KIND_MANAGER = 2;
export const KIND_EMPLOYEE = 3;
export const KIND_USER = 10;
export const KIND_USER_VIP = 11;

export const REVIEW_RATING_BAD = 1;
export const REVIEW_RATING_BORING = 2;
export const REVIEW_RATING_OK = 3;
export const REVIEW_RATING_GOOD = 4;
export const REVIEW_RATING_WONDERFUL = 5;

export const MOVIE_LIST_TAB_ALL = 'all';
export const MOVIE_LIST_TAB_TIME = 'time';

export const DISCUSSION_TAB_COMMENT = 'comment';
export const DISCUSSION_TAB_REVIEW = 'review';

export const MOVIE_TAB_TRAILER = 'trailer';
export const MOVIE_TAB_EPISODE = 'episode';
export const MOVIE_TAB_ACTOR = 'actor';
export const MOVIE_TAB_DIRECTOR = 'director';
export const MOVIE_TAB_SUGGESTION = 'suggestion';

export const VIDEO_SOURCE_TYPE_INTERNAL = 1;
export const VIDEO_SOURCE_TYPE_EXTERNAL = 2;

export const FAVOURITE_TYPE_MOVIE = 1;
export const FAVOURITE_TYPE_PERSON = 2;

export const ACTION_DELETE_FROM_PLAYLIST = 0;
export const ACTION_ADD_TO_PLAYLIST = 1;

export const MAX_PLAYLIST_COUNT = 5;

export const REACTION_TYPE_LIKE = 1;
export const REACTION_TYPE_DISLIKE = 2;

export const STATUS_HIDE = -1;

export const MOVIE_DETAIL_DISCUSSION_ID = 'discussion-detail';
export const MOVIE_WATCH_DISCUSSION_ID = 'discussion-watch';
export const SEARCH_MOVIE_LIST_ID = 'search-movie-list';

export const STYLE_TOP_RANKING = 1;
export const STYLE_DEFAULT = 2;
export const STYLE_CINEMA = 3;
export const STYLE_COMING_SOON = 4;
export const STYLE_LATEST_BY_COUNTRY = 5;
export const STYLE_ANIME = 6;

export const VIDEO_QUALITY_AUTO = 0;
export const VIDEO_QUALITY_720 = 1;
export const VIDEO_QUALITY_1080 = 2;
export const VIDEO_QUALITY_1440 = 3;
export const VIDEO_QUALITY_MAX = 4;

export const VIDEO_LIBRARY_SOURCE_TYPE_INTERNAL = 1;
export const VIDEO_LIBRARY_SOURCE_TYPE_EXTERNAL = 2;

export const SUGGEST_BY_WATCHED_PAGE_0 = 0;
export const SUGGEST_BY_WATCHED_PAGE_1 = 1;

export const NOTIFICATION_TYPE_MOVIE = 2;
export const NOTIFICATION_TYPE_COMMUNITY = 3;

export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

export const ACCESS_TOKEN_MAX_AGE = 24 * 60 * 60; // 1 day
export const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
export const USER_KIND_MAX_AGE = 24 * 60 * 60; // 1 day
export const CSRF_TOKEN_MAX_AGE = 60 * 60; // 1 hour

export const REDIRECT_AFTER_LOGIN_DURATION = 500;

export const INDICATOR_AUTO_HIDE_MS = 800;

export const SUBTITLE_FONT_SIZE_SMALL = 0;
export const SUBTITLE_FONT_SIZE_MEDIUM = 1;
export const SUBTITLE_FONT_SIZE_LARGE = 2;

export const SUBTITLE_TEXT_COLOR_YELLOW = 0;
export const SUBTITLE_TEXT_COLOR_WHITE = 1;
export const SUBTITLE_TEXT_COLOR_BLACK = 2;

export const SUBTITLE_BACKGROUND_COLOR_YELLOW = 0;
export const SUBTITLE_BACKGROUND_COLOR_WHITE = 1;
export const SUBTITLE_BACKGROUND_COLOR_BLACK = 2;

export const USER_REPORT_TYPE_COMMENT = 1;
export const USER_REPORT_TYPE_REVIEW = 2;
export const USER_REPORT_TYPE_VIDEO = 3;

export const IS_DEV_MODE = 'is_dev_mode';
export const ENV_PRODUCTION = 'production';
export const ENV_DEVELOPMENT = 'development';

export const ROOM_STATE_ALL = -1;
export const ROOM_STATE_PENDING = 0;
export const ROOM_STATE_RUNNING = 1;
export const ROOM_STATE_ENDED = 2;

export const ROOM_KIND_PRIVATE = 0;
export const ROOM_KIND_PUBLIC = 1;

export const MILLISECOND = 1_000;

export const ROOM_REASON_TIMEOUT = 'ROOM_TIMEOUT';
export const ROOM_REASON_END = 'ROOM_END';
export const ROOM_REASON_HOST_LEFT = 'HOST_LEFT';
