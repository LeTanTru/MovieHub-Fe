import {
  ratingBad,
  ratingBoring,
  ratingGood,
  ratingOk,
  ratingWonderful
} from '@/assets';
import {
  AGE_RATING_K,
  AGE_RATING_P,
  AGE_RATING_T13,
  AGE_RATING_T16,
  AGE_RATING_T18,
  BREAKPOINT_DESKTOP,
  BREAKPOINT_MOBILE,
  BREAKPOINT_TABLET,
  DISCUSSION_TAB_COMMENT,
  DISCUSSION_TAB_REVIEW,
  FAVOURITE_TYPE_MOVIE,
  FAVOURITE_TYPE_PERSON,
  GENDER_FEMALE,
  GENDER_MALE,
  GENDER_OTHER,
  KIND_ADMIN,
  KIND_MANAGER,
  KIND_USER_VIP,
  MOVIE_ITEM_KIND_EPISODE,
  MOVIE_ITEM_KIND_SEASON,
  MOVIE_ITEM_KIND_TRAILER,
  MOVIE_LIST_TAB_ALL,
  MOVIE_LIST_TAB_TIME,
  MOVIE_TAB_ACTOR,
  MOVIE_TAB_DIRECTOR,
  MOVIE_TAB_EPISODE,
  MOVIE_TAB_SUGGESTION,
  MOVIE_TAB_TRAILER,
  MOVIE_TYPE_SERIES,
  MOVIE_TYPE_SINGLE,
  PERSON_KIND_ACTOR,
  PERSON_KIND_DIRECTOR,
  REVIEW_RATING_BAD,
  REVIEW_RATING_BORING,
  REVIEW_RATING_GOOD,
  REVIEW_RATING_OK,
  REVIEW_RATING_WONDERFUL,
  UPLOAD_AVATAR
} from '@/constants/constant';
import { route } from '@/routes';
import {
  DropdownAvatarItemType,
  OptionType,
  UserSidebarItemType
} from '@/types';
import {
  BellIcon,
  Heart,
  History,
  ListVideo,
  LockKeyhole,
  User2
} from 'lucide-react';
import type { StaticImageData } from 'next/image';
import { FaInfinity, FaMars, FaVenus } from 'react-icons/fa6';
import { IconType } from 'react-icons/lib';

export const GENDER: number[] = [GENDER_MALE, GENDER_FEMALE, GENDER_OTHER];

export const genderOptions: OptionType[] = [
  { value: GENDER_MALE, label: 'Nam' },
  { value: GENDER_FEMALE, label: 'Nữ' },
  { value: GENDER_OTHER, label: 'Khác' }
];

export const uploadOptions = {
  AVATAR: UPLOAD_AVATAR
};

export const genderIconMaps: Record<number, IconType> = {
  [GENDER_MALE]: FaMars,
  [GENDER_FEMALE]: FaVenus,
  [GENDER_OTHER]: FaInfinity
};

export const dropdownAvatarList: DropdownAvatarItemType[] = [
  {
    link: route.user.favourite.path,
    icon: Heart,
    className: 'fill-white stroke-0 size-5',
    title: 'Yêu thích'
  },
  {
    link: route.user.playlist.path,
    icon: ListVideo,
    className: 'size-5',
    title: 'Danh sách phát'
  },
  {
    link: route.user.watchHistory.path,
    icon: History,
    className: 'size-5',
    title: 'Xem tiếp'
  },
  {
    link: route.user.profile.path,
    icon: User2,
    className: 'size-5',
    title: 'Tài khoản'
  },
  {
    link: route.user.changePassword.path,
    icon: LockKeyhole,
    className: 'size-5',
    title: 'Đổi mật khẩu'
  }
];

export const dropdownAvatarAccountList: DropdownAvatarItemType[] = [
  {
    link: route.user.profile.path,
    icon: User2,
    className: 'size-5',
    title: 'Tài khoản'
  },
  {
    link: route.user.changePassword.path,
    icon: LockKeyhole,
    className: 'size-5',
    title: 'Đổi mật khẩu'
  }
];

export const userSidebarList: UserSidebarItemType[] = [
  {
    link: route.user.favourite.path,
    icon: Heart,
    className: 'fill-white stroke-0 size-5',
    title: 'Yêu thích'
  },
  {
    link: route.user.playlist.path,
    icon: ListVideo,
    className: 'size-5',
    title: 'Danh sách phát'
  },
  {
    link: route.user.watchHistory.path,
    icon: History,
    className: 'size-5',
    title: 'Xem tiếp'
  },
  {
    link: route.user.notification.path,
    icon: BellIcon,
    className: 'size-5',
    title: 'Thông báo'
  },
  {
    link: route.user.profile.path,
    icon: User2,
    className: 'size-5',
    title: 'Tài khoản'
  },
  {
    link: route.user.changePassword.path,
    icon: LockKeyhole,
    className: 'size-5',
    title: 'Đổi mật khẩu'
  }
];

export const breakPoints = {
  mobile: BREAKPOINT_MOBILE,
  tablet: BREAKPOINT_TABLET,
  desktop: BREAKPOINT_DESKTOP
};

export const ageRatings = [
  {
    value: AGE_RATING_P,
    label: 'P',
    mean: 'Mọi lứa tuổi'
  },
  {
    value: AGE_RATING_K,
    label: 'K',
    mean: 'Dưới 13 tuổi'
  },
  {
    value: AGE_RATING_T13,
    label: 'T13',
    mean: '13 tuổi trở lên'
  },
  {
    value: AGE_RATING_T16,
    label: 'T16',
    mean: '16 tuổi trở lên'
  },
  {
    value: AGE_RATING_T18,
    label: 'T18',
    mean: '18 tuổi trở lên'
  }
];

export const movieItemKinds = {
  MOVIE_ITEM_KIND_TRAILER,
  MOVIE_ITEM_KIND_EPISODE,
  MOVIE_ITEM_KIND_SEASON
};

export const movieTypes = {
  MOVIE_TYPE_SINGLE,
  MOVIE_TYPE_SERIES
};

export const queryKeys = {
  CATEGORY_LIST: 'category-list',
  CATEGORY: 'category',
  CHANGE_PASSWORD: 'change-password',
  CHECK_MOVIE: 'check-movie',
  COLLECTION_ITEM_LIST: 'collection-item-list',
  COLLECTION_ITEM: 'collection-item',
  COLLECTION_TOPIC_LIST: 'collection-topic-list',
  COLLECTION: 'collection',
  COMMENT_LIST: 'comment-list',
  COMMENT_VOTE_LIST: 'comment-vote-list',
  COMMENT: 'comment',
  CREATE_COMMENT: 'create-comment',
  CREATE_FAVOURITE: 'create-favourite',
  CREATE_REVIEW: 'create-review',
  DELETE_COMMENT: 'delete-comment',
  DELETE_FAVOURITE: 'delete-favourite',
  DELETE_REVIEW: 'delete-review',
  FAVOURITE_LIST: 'favourite-list',
  FAVOURITE: 'favourite',
  FILE_DELETE: 'delete-file',
  FILE_UPLOAD_IMAGE: 'upload-image-file',
  FILE: 'file',
  FORGOT_PASSWORD: 'forgot-password',
  GET_LOGIN_GOOGLE: 'get-login-google',
  LOGIN_GOOGLE: 'login-google',
  LOGIN: 'login',
  LOGOUT: 'logout',
  MOVIE_ITEM_LIST: 'movie-item-list',
  MOVIE_ITEM: 'movie-item',
  MOVIE_LIST: 'movie-list',
  MOVIE_PERSON_LIST: 'movie-person-list',
  MOVIE_PERSON: 'movie-person',
  MOVIE_SUGGESTION_LIST: 'suggestion-movie-list',
  MOVIE: 'movie',
  PERSON_LIST: 'person-list',
  PERSON: 'person',
  PIN_COMMENT: 'pin-comment',
  PLAYLIST_BY_MOVIES: 'playlist-by-movies',
  PLAYLIST_CREATE: 'playlist-create',
  PLAYLIST_DELETE: 'playlist-delete',
  PLAYLIST_ITEM: 'playlist-item',
  PLAYLIST_LIST: 'playlist-list',
  PLAYLIST_MOVIES: 'playlist-movies',
  PLAYLIST: 'playlist',
  PROFILE_UPDATE: 'update-profile',
  PROFILE: 'profile',
  REGISTER: 'register',
  REMOVE_COOKIE_SERVER: 'remove-cookie-server',
  REQUEST_FORGOT_PASSWORD: 'request-forgot-password',
  RESEND_OTP: 'resend-otp',
  REVIEW_LIST: 'review-list',
  REVIEW_VOTE_LIST: 'review-vote-list',
  REVIEW: 'review',
  SET_COOKIE_SERVER: 'set-cookie-server',
  UPDATE_COMMENT: 'update-comment',
  UPDATE_REVIEW: 'update-review',
  VERIFY_OTP: 'verify-otp',
  VOTE_COMMENT: 'vote-comment',
  VOTE_REVIEW: 'vote-review'
};

export const countries = [
  {
    value: 'SA',
    label: 'Ả Rập Xê Út'
  },
  {
    value: 'AF',
    label: 'Afghanistan'
  },
  {
    value: 'EG',
    label: 'Ai Cập'
  },
  {
    value: 'AL',
    label: 'Albania'
  },
  {
    value: 'DZ',
    label: 'Algeria'
  },
  {
    value: 'IN',
    label: 'Ấn Độ'
  },
  {
    value: 'AD',
    label: 'Andorra'
  },
  {
    value: 'AO',
    label: 'Angola'
  },
  {
    value: 'AI',
    label: 'Anguilla'
  },
  {
    value: 'GB',
    label: 'Anh'
  },
  {
    value: 'AG',
    label: 'Antigua và Barbuda'
  },
  {
    value: 'AT',
    label: 'Áo'
  },
  {
    value: 'AR',
    label: 'Argentina'
  },
  {
    value: 'AM',
    label: 'Armenia'
  },
  {
    value: 'AW',
    label: 'Aruba'
  },
  {
    value: 'AU',
    label: 'Australia'
  },
  {
    value: 'AZ',
    label: 'Azerbaijan'
  },
  {
    value: 'PL',
    label: 'Ba Lan'
  },
  {
    value: 'MK',
    label: 'Bắc Macedonia'
  },
  {
    value: 'BS',
    label: 'Bahamas'
  },
  {
    value: 'BH',
    label: 'Bahrain'
  },
  {
    value: 'BD',
    label: 'Bangladesh'
  },
  {
    value: 'BB',
    label: 'Barbados'
  },
  {
    value: 'BY',
    label: 'Belarus'
  },
  {
    value: 'BZ',
    label: 'Belize'
  },
  {
    value: 'BJ',
    label: 'Benin'
  },
  {
    value: 'BM',
    label: 'Bermuda'
  },
  {
    value: 'BT',
    label: 'Bhutan'
  },
  {
    value: 'BE',
    label: 'Bỉ'
  },
  {
    value: 'CI',
    label: 'Bờ Biển Ngà'
  },
  {
    value: 'PT',
    label: 'Bồ Đào Nha'
  },
  {
    value: 'BO',
    label: 'Bolivia'
  },
  {
    value: 'BA',
    label: 'Bosnia và Herzegovina'
  },
  {
    value: 'BW',
    label: 'Botswana'
  },
  {
    value: 'BR',
    label: 'Brazil'
  },
  {
    value: 'BN',
    label: 'Brunei'
  },
  {
    value: 'BG',
    label: 'Bulgaria'
  },
  {
    value: 'BF',
    label: 'Burkina Faso'
  },
  {
    value: 'BI',
    label: 'Burundi'
  },
  {
    value: 'AE',
    label: 'Các Tiểu Vương Quốc Ả Rập Thống Nhất'
  },
  {
    value: 'CM',
    label: 'Cameroon'
  },
  {
    value: 'KH',
    label: 'Campuchia'
  },
  {
    value: 'CA',
    label: 'Canada'
  },
  {
    value: 'CV',
    label: 'Cape Verde'
  },
  {
    value: 'CL',
    label: 'Chile'
  },
  {
    value: 'CO',
    label: 'Colombia'
  },
  {
    value: 'KM',
    label: 'Comoros'
  },
  {
    value: 'CD',
    label: 'Cộng hòa Dân chủ Congo'
  },
  {
    value: 'DO',
    label: 'Cộng hòa Dominica'
  },
  {
    value: 'CZ',
    label: 'Cộng hòa Séc'
  },
  {
    value: 'CG',
    label: 'Congo'
  },
  {
    value: 'CR',
    label: 'Costa Rica'
  },
  {
    value: 'HR',
    label: 'Croatia'
  },
  {
    value: 'CU',
    label: 'Cuba'
  },
  {
    value: 'CW',
    label: 'Curaçao'
  },
  {
    value: 'TW',
    label: 'Đài Loan'
  },
  {
    value: 'DK',
    label: 'Đan Mạch'
  },
  {
    value: 'IM',
    label: 'Đảo Man'
  },
  {
    value: 'DJ',
    label: 'Djibouti'
  },
  {
    value: 'DM',
    label: 'Dominica'
  },
  {
    value: 'TL',
    label: 'Đông Timor'
  },
  {
    value: 'DE',
    label: 'Đức'
  },
  {
    value: 'EC',
    label: 'Ecuador'
  },
  {
    value: 'SV',
    label: 'El Salvador'
  },
  {
    value: 'ER',
    label: 'Eritrea'
  },
  {
    value: 'EE',
    label: 'Estonia'
  },
  {
    value: 'SZ',
    label: 'Eswatini'
  },
  {
    value: 'ET',
    label: 'Ethiopia'
  },
  {
    value: 'FJ',
    label: 'Fiji'
  },
  {
    value: 'GA',
    label: 'Gabon'
  },
  {
    value: 'GM',
    label: 'Gambia'
  },
  {
    value: 'GE',
    label: 'Georgia'
  },
  {
    value: 'GH',
    label: 'Ghana'
  },
  {
    value: 'GI',
    label: 'Gibraltar'
  },
  {
    value: 'GL',
    label: 'Greenland'
  },
  {
    value: 'GD',
    label: 'Grenada'
  },
  {
    value: 'GU',
    label: 'Guam'
  },
  {
    value: 'GT',
    label: 'Guatemala'
  },
  {
    value: 'GG',
    label: 'Guernsey'
  },
  {
    value: 'GN',
    label: 'Guinea'
  },
  {
    value: 'GQ',
    label: 'Guinea Xích Đạo'
  },
  {
    value: 'GW',
    label: 'Guinea-Bissau'
  },
  {
    value: 'GY',
    label: 'Guyana'
  },
  {
    value: 'NL',
    label: 'Hà Lan'
  },
  {
    value: 'HT',
    label: 'Haiti'
  },
  {
    value: 'KR',
    label: 'Hàn Quốc'
  },
  {
    value: 'US',
    label: 'Hoa Kỳ'
  },
  {
    value: 'HN',
    label: 'Honduras'
  },
  {
    value: 'HK',
    label: 'Hồng Kông'
  },
  {
    value: 'HU',
    label: 'Hungary'
  },
  {
    value: 'GR',
    label: 'Hy Lạp'
  },
  {
    value: 'IS',
    label: 'Iceland'
  },
  {
    value: 'ID',
    label: 'Indonesia'
  },
  {
    value: 'IR',
    label: 'Iran'
  },
  {
    value: 'IQ',
    label: 'Iraq'
  },
  {
    value: 'IE',
    label: 'Ireland'
  },
  {
    value: 'IL',
    label: 'Israel'
  },
  {
    value: 'JM',
    label: 'Jamaica'
  },
  {
    value: 'JE',
    label: 'Jersey'
  },
  {
    value: 'JO',
    label: 'Jordan'
  },
  {
    value: 'KZ',
    label: 'Kazakhstan'
  },
  {
    value: 'KE',
    label: 'Kenya'
  },
  {
    value: 'KI',
    label: 'Kiribati'
  },
  {
    value: 'KW',
    label: 'Kuwait'
  },
  {
    value: 'KG',
    label: 'Kyrgyzstan'
  },
  {
    value: 'LA',
    label: 'Lào'
  },
  {
    value: 'LV',
    label: 'Latvia'
  },
  {
    value: 'LB',
    label: 'Lebanon'
  },
  {
    value: 'LS',
    label: 'Lesotho'
  },
  {
    value: 'LR',
    label: 'Liberia'
  },
  {
    value: 'LY',
    label: 'Libya'
  },
  {
    value: 'LI',
    label: 'Liechtenstein'
  },
  {
    value: 'LT',
    label: 'Lithuania'
  },
  {
    value: 'LU',
    label: 'Luxembourg'
  },
  {
    value: 'MO',
    label: 'Macao'
  },
  {
    value: 'MG',
    label: 'Madagascar'
  },
  {
    value: 'MW',
    label: 'Malawi'
  },
  {
    value: 'MY',
    label: 'Malaysia'
  },
  {
    value: 'MV',
    label: 'Maldives'
  },
  {
    value: 'ML',
    label: 'Mali'
  },
  {
    value: 'MT',
    label: 'Malta'
  },
  {
    value: 'MR',
    label: 'Mauritania'
  },
  {
    value: 'MU',
    label: 'Mauritius'
  },
  {
    value: 'MX',
    label: 'Mexico'
  },
  {
    value: 'FM',
    label: 'Micronesia'
  },
  {
    value: 'MD',
    label: 'Moldova'
  },
  {
    value: 'MC',
    label: 'Monaco'
  },
  {
    value: 'MN',
    label: 'Mông Cổ'
  },
  {
    value: 'ME',
    label: 'Montenegro'
  },
  {
    value: 'MA',
    label: 'Morocco'
  },
  {
    value: 'MZ',
    label: 'Mozambique'
  },
  {
    value: 'MM',
    label: 'Myanmar'
  },
  {
    value: 'NO',
    label: 'Na Uy'
  },
  {
    value: 'ZA',
    label: 'Nam Phi'
  },
  {
    value: 'SS',
    label: 'Nam Sudan'
  },
  {
    value: 'NA',
    label: 'Namibia'
  },
  {
    value: 'NR',
    label: 'Nauru'
  },
  {
    value: 'NP',
    label: 'Nepal'
  },
  {
    value: 'NC',
    label: 'New Caledonia'
  },
  {
    value: 'NZ',
    label: 'New Zealand'
  },
  {
    value: 'RU',
    label: 'Nga'
  },
  {
    value: 'JP',
    label: 'Nhật Bản'
  },
  {
    value: 'NI',
    label: 'Nicaragua'
  },
  {
    value: 'NE',
    label: 'Niger'
  },
  {
    value: 'NG',
    label: 'Nigeria'
  },
  {
    value: 'OM',
    label: 'Oman'
  },
  {
    value: 'PK',
    label: 'Pakistan'
  },
  {
    value: 'PW',
    label: 'Palau'
  },
  {
    value: 'PS',
    label: 'Palestine'
  },
  {
    value: 'PA',
    label: 'Panama'
  },
  {
    value: 'PG',
    label: 'Papua New Guinea'
  },
  {
    value: 'PY',
    label: 'Paraguay'
  },
  {
    value: 'PE',
    label: 'Peru'
  },
  {
    value: 'FI',
    label: 'Phần Lan'
  },
  {
    value: 'FR',
    label: 'Pháp'
  },
  {
    value: 'PH',
    label: 'Philippines'
  },
  {
    value: 'PF',
    label: 'Polynesia thuộc Pháp'
  },
  {
    value: 'PR',
    label: 'Puerto Rico'
  },
  {
    value: 'QA',
    label: 'Qatar'
  },
  {
    value: 'CK',
    label: 'Quần đảo Cook'
  },
  {
    value: 'MH',
    label: 'Quần đảo Marshall'
  },
  {
    value: 'SB',
    label: 'Quần đảo Solomon'
  },
  {
    value: 'RO',
    label: 'Romania'
  },
  {
    value: 'RW',
    label: 'Rwanda'
  },
  {
    value: 'KN',
    label: 'Saint Kitts và Nevis'
  },
  {
    value: 'LC',
    label: 'Saint Lucia'
  },
  {
    value: 'VC',
    label: 'Saint Vincent và Grenadines'
  },
  {
    value: 'WS',
    label: 'Samoa'
  },
  {
    value: 'SM',
    label: 'San Marino'
  },
  {
    value: 'ST',
    label: 'São Tomé và Príncipe'
  },
  {
    value: 'SN',
    label: 'Senegal'
  },
  {
    value: 'RS',
    label: 'Serbia'
  },
  {
    value: 'SC',
    label: 'Seychelles'
  },
  {
    value: 'SL',
    label: 'Sierra Leone'
  },
  {
    value: 'SG',
    label: 'Singapore'
  },
  {
    value: 'CY',
    label: 'Síp'
  },
  {
    value: 'SK',
    label: 'Slovakia'
  },
  {
    value: 'SI',
    label: 'Slovenia'
  },
  {
    value: 'SO',
    label: 'Somalia'
  },
  {
    value: 'LK',
    label: 'Sri Lanka'
  },
  {
    value: 'SD',
    label: 'Sudan'
  },
  {
    value: 'SR',
    label: 'Suriname'
  },
  {
    value: 'SY',
    label: 'Syria'
  },
  {
    value: 'TJ',
    label: 'Tajikistan'
  },
  {
    value: 'TZ',
    label: 'Tanzania'
  },
  {
    value: 'ES',
    label: 'Tây Ban Nha'
  },
  {
    value: 'TD',
    label: 'Tchad'
  },
  {
    value: 'TH',
    label: 'Thái Lan'
  },
  {
    value: 'TR',
    label: 'Thổ Nhĩ Kỳ'
  },
  {
    value: 'SE',
    label: 'Thụy Điển'
  },
  {
    value: 'CH',
    label: 'Thụy Sĩ'
  },
  {
    value: 'TG',
    label: 'Togo'
  },
  {
    value: 'TO',
    label: 'Tonga'
  },
  {
    value: 'KP',
    label: 'Triều Tiên'
  },
  {
    value: 'TT',
    label: 'Trinidad và Tobago'
  },
  {
    value: 'CN',
    label: 'Trung Quốc'
  },
  {
    value: 'TN',
    label: 'Tunisia'
  },
  {
    value: 'TM',
    label: 'Turkmenistan'
  },
  {
    value: 'TV',
    label: 'Tuvalu'
  },
  {
    value: 'UG',
    label: 'Uganda'
  },
  {
    value: 'UA',
    label: 'Ukraina'
  },
  {
    value: 'UY',
    label: 'Uruguay'
  },
  {
    value: 'UZ',
    label: 'Uzbekistan'
  },
  {
    value: 'VU',
    label: 'Vanuatu'
  },
  {
    value: 'VA',
    label: 'Vatican'
  },
  {
    value: 'VE',
    label: 'Venezuela'
  },
  {
    value: 'VN',
    label: 'Việt Nam'
  },
  {
    value: 'IT',
    label: 'Ý'
  },
  {
    value: 'YE',
    label: 'Yemen'
  },
  {
    value: 'ZM',
    label: 'Zambia'
  },
  {
    value: 'ZW',
    label: 'Zimbabwe'
  }
];

export const languages = [
  {
    value: 'ar',
    label: 'Tiếng Ả Rập'
  },
  {
    value: 'af',
    label: 'Tiếng Afrikaans'
  },
  {
    value: 'sq',
    label: 'Tiếng Albania'
  },
  {
    value: 'am',
    label: 'Tiếng Amharic'
  },
  {
    value: 'en',
    label: 'Tiếng Anh'
  },
  {
    value: 'hy',
    label: 'Tiếng Armenia'
  },
  {
    value: 'as',
    label: 'Tiếng Assam'
  },
  {
    value: 'az',
    label: 'Tiếng Azerbaijan'
  },
  {
    value: 'pl',
    label: 'Tiếng Ba Lan'
  },
  {
    value: 'fa',
    label: 'Tiếng Ba Tư (Persian)'
  },
  {
    value: 'eu',
    label: 'Tiếng Basque'
  },
  {
    value: 'be',
    label: 'Tiếng Belarus'
  },
  {
    value: 'bn',
    label: 'Tiếng Bengal'
  },
  {
    value: 'pt',
    label: 'Tiếng Bồ Đào Nha'
  },
  {
    value: 'bs',
    label: 'Tiếng Bosnia'
  },
  {
    value: 'bg',
    label: 'Tiếng Bulgaria'
  },
  {
    value: 'my',
    label: 'Tiếng Burmese (Miến Điện)'
  },
  {
    value: 'ca',
    label: 'Tiếng Catalan'
  },
  {
    value: 'ceb',
    label: 'Tiếng Cebuano'
  },
  {
    value: 'ny',
    label: 'Tiếng Chichewa'
  },
  {
    value: 'co',
    label: 'Tiếng Corsican'
  },
  {
    value: 'hr',
    label: 'Tiếng Croatia'
  },
  {
    value: 'cs',
    label: 'Tiếng Czech (Séc)'
  },
  {
    value: 'da',
    label: 'Tiếng Đan Mạch'
  },
  {
    value: 'de',
    label: 'Tiếng Đức'
  },
  {
    value: 'eo',
    label: 'Tiếng Esperanto'
  },
  {
    value: 'et',
    label: 'Tiếng Estonia'
  },
  {
    value: 'fy',
    label: 'Tiếng Frisian'
  },
  {
    value: 'gl',
    label: 'Tiếng Galician'
  },
  {
    value: 'ka',
    label: 'Tiếng Georgia'
  },
  {
    value: 'gu',
    label: 'Tiếng Gujarati'
  },
  {
    value: 'nl',
    label: 'Tiếng Hà Lan'
  },
  {
    value: 'ht',
    label: 'Tiếng Haiti'
  },
  {
    value: 'ko',
    label: 'Tiếng Hàn'
  },
  {
    value: 'ha',
    label: 'Tiếng Hausa'
  },
  {
    value: 'haw',
    label: 'Tiếng Hawaii'
  },
  {
    value: 'he',
    label: 'Tiếng Hebrew'
  },
  {
    value: 'hi',
    label: 'Tiếng Hindi'
  },
  {
    value: 'hmn',
    label: 'Tiếng Hmong'
  },
  {
    value: 'hu',
    label: 'Tiếng Hungary'
  },
  {
    value: 'el',
    label: 'Tiếng Hy Lạp'
  },
  {
    value: 'is',
    label: 'Tiếng Iceland'
  },
  {
    value: 'ig',
    label: 'Tiếng Igbo'
  },
  {
    value: 'id',
    label: 'Tiếng Indonesia'
  },
  {
    value: 'ga',
    label: 'Tiếng Ireland'
  },
  {
    value: 'jv',
    label: 'Tiếng Java'
  },
  {
    value: 'kn',
    label: 'Tiếng Kannada'
  },
  {
    value: 'kk',
    label: 'Tiếng Kazakh'
  },
  {
    value: 'km',
    label: 'Tiếng Khmer (Campuchia)'
  },
  {
    value: 'rw',
    label: 'Tiếng Kinyarwanda'
  },
  {
    value: 'ku',
    label: 'Tiếng Kurdish'
  },
  {
    value: 'ky',
    label: 'Tiếng Kyrgyz'
  },
  {
    value: 'lo',
    label: 'Tiếng Lào'
  },
  {
    value: 'la',
    label: 'Tiếng Latin'
  },
  {
    value: 'lv',
    label: 'Tiếng Latvia'
  },
  {
    value: 'lt',
    label: 'Tiếng Lithuania'
  },
  {
    value: 'lb',
    label: 'Tiếng Luxembourg'
  },
  {
    value: 'ms',
    label: 'Tiếng Mã Lai'
  },
  {
    value: 'mk',
    label: 'Tiếng Macedonia'
  },
  {
    value: 'mg',
    label: 'Tiếng Malagasy'
  },
  {
    value: 'ml',
    label: 'Tiếng Malayalam'
  },
  {
    value: 'mt',
    label: 'Tiếng Malta'
  },
  {
    value: 'mi',
    label: 'Tiếng Maori'
  },
  {
    value: 'mr',
    label: 'Tiếng Marathi'
  },
  {
    value: 'mn',
    label: 'Tiếng Mông Cổ'
  },
  {
    value: 'no',
    label: 'Tiếng Na Uy'
  },
  {
    value: 'ne',
    label: 'Tiếng Nepal'
  },
  {
    value: 'ru',
    label: 'Tiếng Nga'
  },
  {
    value: 'ja',
    label: 'Tiếng Nhật'
  },
  {
    value: 'or',
    label: 'Tiếng Odia'
  },
  {
    value: 'ps',
    label: 'Tiếng Pashto'
  },
  {
    value: 'fi',
    label: 'Tiếng Phần Lan'
  },
  {
    value: 'fr',
    label: 'Tiếng Pháp'
  },
  {
    value: 'pa',
    label: 'Tiếng Punjabi'
  },
  {
    value: 'ro',
    label: 'Tiếng Romania'
  },
  {
    value: 'sm',
    label: 'Tiếng Samoa'
  },
  {
    value: 'gd',
    label: 'Tiếng Scotland Gaelic'
  },
  {
    value: 'sr',
    label: 'Tiếng Serbia'
  },
  {
    value: 'st',
    label: 'Tiếng Sesotho'
  },
  {
    value: 'sn',
    label: 'Tiếng Shona'
  },
  {
    value: 'sd',
    label: 'Tiếng Sindhi'
  },
  {
    value: 'si',
    label: 'Tiếng Sinhala'
  },
  {
    value: 'sk',
    label: 'Tiếng Slovak'
  },
  {
    value: 'sl',
    label: 'Tiếng Slovenia'
  },
  {
    value: 'so',
    label: 'Tiếng Somali'
  },
  {
    value: 'su',
    label: 'Tiếng Sundanese'
  },
  {
    value: 'sw',
    label: 'Tiếng Swahili'
  },
  {
    value: 'tl',
    label: 'Tiếng Tagalog (Filipino)'
  },
  {
    value: 'tg',
    label: 'Tiếng Tajik'
  },
  {
    value: 'ta',
    label: 'Tiếng Tamil'
  },
  {
    value: 'tt',
    label: 'Tiếng Tatar'
  },
  {
    value: 'es',
    label: 'Tiếng Tây Ban Nha'
  },
  {
    value: 'te',
    label: 'Tiếng Telugu'
  },
  {
    value: 'th',
    label: 'Tiếng Thái'
  },
  {
    value: 'tr',
    label: 'Tiếng Thổ Nhĩ Kỳ'
  },
  {
    value: 'sv',
    label: 'Tiếng Thụy Điển'
  },
  {
    value: 'zh',
    label: 'Tiếng Trung'
  },
  {
    value: 'zh-CN',
    label: 'Tiếng Trung (Giản thể)'
  },
  {
    value: 'zh-TW',
    label: 'Tiếng Trung (Phồn thể)'
  },
  {
    value: 'tk',
    label: 'Tiếng Turkmen'
  },
  {
    value: 'uk',
    label: 'Tiếng Ukraina'
  },
  {
    value: 'ur',
    label: 'Tiếng Urdu'
  },
  {
    value: 'ug',
    label: 'Tiếng Uyghur'
  },
  {
    value: 'uz',
    label: 'Tiếng Uzbek'
  },
  {
    value: 'vi',
    label: 'Tiếng Việt'
  },
  {
    value: 'cy',
    label: 'Tiếng Wales'
  },
  {
    value: 'xh',
    label: 'Tiếng Xhosa'
  },
  {
    value: 'it',
    label: 'Tiếng Ý'
  },
  {
    value: 'yi',
    label: 'Tiếng Yiddish'
  },
  {
    value: 'yo',
    label: 'Tiếng Yoruba'
  },
  {
    value: 'zu',
    label: 'Tiếng Zulu'
  }
];

export const kindMaps: Record<number, { label: string; style: string }> = {
  [KIND_ADMIN]: {
    label: 'Super Admin',
    style: 'border-red-500  text-red-600'
  },
  [KIND_MANAGER]: {
    label: 'Admin',
    style: 'border-orange-500  text-orange-600'
  },
  [KIND_USER_VIP]: {
    label: 'VIP',
    style: 'border-cyan-500  text-cyan-600'
  }
};

export const reviewRatings: (Pick<OptionType, 'value' | 'label'> & {
  icon: StaticImageData;
})[] = [
  { value: REVIEW_RATING_BAD, label: 'Dở tệ', icon: ratingBad },
  { value: REVIEW_RATING_BORING, label: 'Phim chán', icon: ratingBoring },
  { value: REVIEW_RATING_OK, label: 'Phim ổn', icon: ratingOk },
  { value: REVIEW_RATING_GOOD, label: 'Phim hay', icon: ratingGood },
  { value: REVIEW_RATING_WONDERFUL, label: 'Tuyệt vời', icon: ratingWonderful }
];

export const discussionActions: { key: string; label: string }[] = [
  { key: DISCUSSION_TAB_COMMENT, label: 'Bình luận' },
  { key: DISCUSSION_TAB_REVIEW, label: 'Đánh giá' }
];

export const movieListActions: { key: string; label: string }[] = [
  { key: MOVIE_LIST_TAB_ALL, label: 'Tất cả' },
  { key: MOVIE_LIST_TAB_TIME, label: 'Thời gian' }
];

export const movieTabPersonTitles: Record<number, string> = {
  [PERSON_KIND_ACTOR]: 'Diễn viên',
  [PERSON_KIND_DIRECTOR]: 'Đạo diễn'
};

export const movieTabs = [
  {
    key: MOVIE_TAB_EPISODE,
    label: 'Tập phim'
  },
  {
    key: MOVIE_TAB_TRAILER,
    label: 'Trailer'
  },
  {
    key: MOVIE_TAB_ACTOR,
    label: 'Diễn viên'
  },
  {
    key: MOVIE_TAB_DIRECTOR,
    label: 'Đạo diễn'
  },
  {
    key: MOVIE_TAB_SUGGESTION,
    label: 'Đề xuất'
  }
];

export const favouriteTabs = [
  {
    key: FAVOURITE_TYPE_MOVIE,
    label: 'Phim'
  },
  {
    key: FAVOURITE_TYPE_PERSON,
    label: 'Diễn viên'
  }
];
